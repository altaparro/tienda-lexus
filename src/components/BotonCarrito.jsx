import { useState } from 'react'
import { agregar } from '../lib/carrito'

export default function BotonCarrito({ producto, cantidad = 1 }) {
  const [agregado, setAgregado] = useState(false)
  const sinStock = Number(producto.stock || 0) <= 0

  function manejarClick() {
    if (sinStock) return
    agregar(producto, cantidad)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1600)
  }

  if (sinStock) {
    return (
      <button
        type="button"
        disabled
        className="w-full cursor-not-allowed rounded-xl bg-neutral-200 px-6 py-3.5 text-sm font-semibold text-neutral-400"
      >
        Sin stock
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={manejarClick}
      className={`w-full rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition ${
        agregado
          ? 'bg-emerald-600 hover:bg-emerald-700'
          : 'bg-orange-600 hover:bg-orange-700'
      }`}
    >
      {agregado ? '✓ Agregado al carrito' : 'Agregar al carrito'}
    </button>
  )
}
