-- ============================================================
-- Migración: eliminar visible_tienda
-- La tienda online muestra TODOS los productos del sistema,
-- sin publicación manual por producto.
-- Ejecutar en Supabase > SQL Editor (después de pedidos.sql)
-- ============================================================

-- 1. Reemplazar la función sin el chequeo de visible_tienda
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
    where id = v_pid;

    if not found then
      raise exception 'El producto % no existe', v_pid;
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

-- 2. Quitar la columna de publicación (ya no existe el concepto)
alter table public.productos drop column if exists visible_tienda;
