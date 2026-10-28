import { supabase } from '../../lib/supabase'

export const prerender = false

export async function POST({ request }) {
  let body

  try {
    body = await request.json()
  } catch {
    return new Response(
      JSON.stringify({ error: 'Cuerpo de la petición inválido o vacío' }),
      { status: 400 }
    )
  }

  const nombre = String(body?.nombre || '').trim()
  const telefono = String(body?.telefono || '').trim()
  const email = String(body?.email || '').trim()
  const direccion = String(body?.direccion || '').trim()
  const notas = String(body?.notas || '').trim()
  const items = Array.isArray(body?.items) ? body.items : []

  if (!nombre || !telefono) {
    return new Response(JSON.stringify({ error: 'Nombre y teléfono son obligatorios' }), {
      status: 400
    })
  }

  const itemsValidos =
    items.length > 0 &&
    items.every(
      (i) => Number.isInteger(Number(i?.producto_id)) && Number(i?.cantidad) > 0
    )

  if (!itemsValidos) {
    return new Response(JSON.stringify({ error: 'El pedido no tiene productos válidos' }), {
      status: 400
    })
  }

  const itemsNorm = items.map((i) => ({
    producto_id: Number(i.producto_id),
    cantidad: Number(i.cantidad)
  }))

  const { data, error } = await supabase.rpc('crear_pedido_tienda', {
    p_nombre: nombre,
    p_telefono: telefono,
    p_email: email || null,
    p_direccion: direccion || null,
    p_notas: notas || null,
    p_items: itemsNorm
  })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }

  return new Response(JSON.stringify(data), { status: 201 })
}
