import { useEffect, useState } from 'react'
import { useCarrito } from '../lib/carrito'

export default function CarritoBadge() {
  const { cantidadTotal } = useCarrito()
  const [montado, setMontado] = useState(false)

  useEffect(() => {
    setMontado(true)
  }, [])

  const cantidad = montado ? cantidadTotal : 0

  return (
    <a
      href="/carrito"
      className="relative rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-neutral-700 hover:text-slate-100"
    >
      Carrito
      {cantidad > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[11px] font-bold text-white">
          {cantidad}
        </span>
      )}
    </a>
  )
}
