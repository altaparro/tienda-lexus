import { supabase } from './supabase'

export async function obtenerProductosPublicos() {
  const { data, error } = await supabase
    .from('productos')
    .select('*, tipo:tipo_producto(id, nombre)')
    .eq('visible_tienda', true)
    .order('id')

  if (error) {
    console.error('[tienda] productos:', error.message)
    return []
  }

  return data || []
}

export async function obtenerProductoPublico(id) {
  const numero = Number(id)
  if (!Number.isInteger(numero)) return null

  const { data, error } = await supabase
    .from('productos')
    .select('*, tipo:tipo_producto(id, nombre)')
    .eq('id', numero)
    .eq('visible_tienda', true)
    .maybeSingle()

  if (error) {
    console.error('[tienda] producto:', error.message)
    return null
  }

  return data
}
