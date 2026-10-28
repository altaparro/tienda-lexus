import { useMemo, useSyncExternalStore } from 'react'

const CLAVE = 'carrito-lexus'
const VACIO = []

let items = []
const listeners = new Set()

function leer() {
  if (typeof localStorage === 'undefined') return
  try {
    const guardado = localStorage.getItem(CLAVE)
    const arr = guardado ? JSON.parse(guardado) : []
    items = Array.isArray(arr) ? arr : []
  } catch {
    items = []
  }
}

function guardar() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(items))
  } catch {
    // sin localStorage no se persiste, pero el carrito sigue en memoria
  }
  for (const cb of listeners) cb()
}

if (typeof window !== 'undefined') leer()

function suscribir(cb) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function getSnapshot() {
  return items
}

function getServerSnapshot() {
  return VACIO
}

export function agregar(producto, cantidad = 1) {
  const existente = items.find((i) => i.producto_id === producto.id)
  if (existente) {
    const maximo = producto.stock ?? existente.cantidad + cantidad
    items = items.map((i) =>
      i.producto_id === producto.id
        ? { ...i, cantidad: Math.min(i.cantidad + cantidad, maximo) }
        : i
    )
  } else {
    items = [
      ...items,
      {
        producto_id: producto.id,
        nombre: producto.nombre,
        marca: producto.marca || null,
        imagen: producto.imagen || null,
        precio: Number(producto.precio_venta),
        stock: Number(producto.stock || 0),
        cantidad
      }
    ]
  }
  guardar()
}

export function cambiarCantidad(productoId, cantidad) {
  items = items
    .map((i) =>
      i.producto_id === productoId
        ? { ...i, cantidad: Math.max(0, Math.min(cantidad, i.stock || cantidad)) }
        : i
    )
    .filter((i) => i.cantidad > 0)
  guardar()
}

export function quitar(productoId) {
  items = items.filter((i) => i.producto_id !== productoId)
  guardar()
}

export function vaciar() {
  items = []
  guardar()
}

export function useCarrito() {
  const actuales = useSyncExternalStore(suscribir, getSnapshot, getServerSnapshot)

  const total = useMemo(
    () => actuales.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
    [actuales]
  )

  const cantidadTotal = useMemo(
    () => actuales.reduce((acc, i) => acc + i.cantidad, 0),
    [actuales]
  )

  return { items: actuales, total, cantidadTotal, agregar, cambiarCantidad, quitar, vaciar }
}
