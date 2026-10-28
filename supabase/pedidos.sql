-- ============================================================
-- Migración: pedidos de la tienda online
-- Ejecutar en Supabase > SQL Editor (después de visible_tienda.sql)
-- ============================================================

-- ------------------------------------------------------------
-- 1. Tablas
-- ------------------------------------------------------------

create table if not exists public.pedidos (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  cliente_id bigint references public.clientes(id) on delete set null,
  nombre text not null,
  telefono text,
  email text,
  direccion text,
  notas text,
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'confirmado', 'entregado', 'cancelado')),
  venta_id bigint references public.ventas(id) on delete set null,
  total numeric(12,2) not null default 0
);

create index if not exists pedidos_estado_idx on public.pedidos (estado);
create index if not exists pedidos_created_at_idx on public.pedidos (created_at desc);

create table if not exists public.pedido_detalle (
  id bigint generated always as identity primary key,
  pedido_id bigint not null references public.pedidos(id) on delete cascade,
  producto_id bigint references public.productos(id) on delete set null,
  nombre_producto text not null,
  codigo_producto text,
  cantidad int not null check (cantidad > 0),
  precio_unitario numeric(12,2) not null,
  subtotal numeric(12,2) not null
);

create index if not exists pedido_detalle_pedido_id_idx on public.pedido_detalle (pedido_id);

-- ------------------------------------------------------------
-- 2. RLS (mismo patrón permisivo que el resto de la base)
-- ------------------------------------------------------------

alter table public.pedidos enable row level security;
alter table public.pedido_detalle enable row level security;

do $$
declare t text;
begin
  foreach t in array array['pedidos', 'pedido_detalle'] loop
    execute format('drop policy if exists %I on public.%I', t || '_select', t);
    execute format('create policy %I on public.%I for select using (true)', t || '_select', t);
    execute format('drop policy if exists %I on public.%I', t || '_insert', t);
    execute format('create policy %I on public.%I for insert with check (true)', t || '_insert', t);
    execute format('drop policy if exists %I on public.%I', t || '_update', t);
    execute format('create policy %I on public.%I for update using (true) with check (true)', t || '_update', t);
    execute format('drop policy if exists %I on public.%I', t || '_delete', t);
    execute format('create policy %I on public.%I for delete using (true)', t || '_delete', t);
  end loop;
end $$;

-- ------------------------------------------------------------
-- 3. crear_pedido_tienda: alta atómica desde la tienda online
--    - valida productos visibles y stock
--    - recalcula precios desde la base (no confía en el navegador)
--    - busca o crea el cliente por teléfono
-- ------------------------------------------------------------

create or replace function public.crear_pedido_tienda(
  p_nombre text,
  p_telefono text,
  p_email text default null,
  p_direccion text default null,
  p_notas text default null,
  p_items jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pedido_id bigint;
  v_cliente_id bigint;
  v_total numeric(12,2) := 0;
  v_item jsonb;
  v_pid bigint;
  v_cant int;
  v_stock int;
  v_precio numeric(12,2);
  v_nombre text;
  v_codigo text;
begin
  if p_nombre is null or trim(p_nombre) = '' then
    raise exception 'El nombre es obligatorio';
  end if;

  if p_telefono is null or trim(p_telefono) = '' then
    raise exception 'El teléfono es obligatorio';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'El pedido debe tener al menos un producto';
  end if;

  -- Cliente por teléfono (si ya existe, se reutiliza)
  select id into v_cliente_id
  from clientes
  where telefono = trim(p_telefono)
  order by id
  limit 1;

  if not found then
    insert into clientes (nombre, telefono, email)
    values (trim(p_nombre), trim(p_telefono), nullif(trim(coalesce(p_email, '')), ''))
    returning id into v_cliente_id;
  elsif p_email is not null and trim(p_email) <> '' then
    update clientes
    set email = nullif(trim(p_email), '')
    where id = v_cliente_id and (email is null or email = '');
  end if;

  -- Validar items y calcular total con precios de la base
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_pid := (v_item->>'producto_id')::bigint;
    v_cant := coalesce((v_item->>'cantidad')::int, 0);

    if v_pid is null or v_cant <= 0 then
      raise exception 'Item inválido en el pedido';
    end if;

    select stock, precio_venta, nombre, codigo
    into v_stock, v_precio, v_nombre, v_codigo
    from productos
    where id = v_pid and visible_tienda = true;

    if not found then
      raise exception 'El producto % no está disponible en la tienda', v_pid;
    end if;

    if v_stock < v_cant then
      raise exception 'Stock insuficiente para el producto %', v_nombre;
    end if;

    v_total := v_total + v_precio * v_cant;
  end loop;

  insert into pedidos (cliente_id, nombre, telefono, email, direccion, notas, total)
  values (
    v_cliente_id,
    trim(p_nombre),
    trim(p_telefono),
    nullif(trim(coalesce(p_email, '')), ''),
    nullif(trim(coalesce(p_direccion, '')), ''),
    nullif(trim(coalesce(p_notas, '')), ''),
    v_total
  )
  returning id into v_pedido_id;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_pid := (v_item->>'producto_id')::bigint;
    v_cant := coalesce((v_item->>'cantidad')::int, 0);

    select precio_venta, nombre, codigo
    into v_precio, v_nombre, v_codigo
    from productos where id = v_pid;

    insert into pedido_detalle (pedido_id, producto_id, nombre_producto, codigo_producto, cantidad, precio_unitario, subtotal)
    values (v_pedido_id, v_pid, v_nombre, v_codigo, v_cant, v_precio, v_precio * v_cant);
  end loop;

  return jsonb_build_object('pedido_id', v_pedido_id, 'total', v_total);
end;
$$;

grant execute on function public.crear_pedido_tienda(text, text, text, text, text, jsonb) to anon, authenticated;

-- ------------------------------------------------------------
-- 4. confirmar_pedido: pasa el pedido a venta (descuenta stock)
--    - solo actúa si está pendiente
--    - reutiliza registrar_venta (interés del medio de pago incluido)
--    - si falla (stock insuficiente), todo revierte y sigue pendiente
-- ------------------------------------------------------------

create or replace function public.confirmar_pedido(
  p_pedido_id bigint,
  p_medio_pago_id bigint
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pedido public.pedidos%rowtype;
  v_items jsonb;
  v_result jsonb;
begin
  select * into v_pedido
  from pedidos
  where id = p_pedido_id;

  if not found then
    raise exception 'El pedido no existe';
  end if;

  if v_pedido.estado <> 'pendiente' then
    raise exception 'El pedido no está pendiente (estado actual: %)', v_pedido.estado;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object('producto_id', d.producto_id, 'cantidad', d.cantidad)
      order by d.id
    ),
    '[]'::jsonb
  )
  into v_items
  from pedido_detalle d
  where d.pedido_id = p_pedido_id;

  if jsonb_array_length(v_items) = 0 then
    raise exception 'El pedido no tiene productos';
  end if;

  v_result := registrar_venta(
    p_medio_pago_id,
    v_items,
    null,
    0,
    v_pedido.cliente_id
  );

  update pedidos
  set estado = 'confirmado',
      venta_id = (v_result->>'venta_id')::bigint
  where id = p_pedido_id;

  return v_result || jsonb_build_object(
    'pedido_id', p_pedido_id,
    'estado', 'confirmado'
  );
end;
$$;

grant execute on function public.confirmar_pedido(bigint, bigint) to anon, authenticated;
