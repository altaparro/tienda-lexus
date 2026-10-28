-- ============================================================
-- Migración: flag de publicación en la tienda online
-- Ejecutar en Supabase > SQL Editor
-- ============================================================

alter table public.productos
  add column if not exists visible_tienda boolean not null default false;

-- Ejemplo: publicar todos los productos con stock
-- update public.productos set visible_tienda = true where stock > 0;
