import { useEffect, useState } from 'react'
import { useCarrito } from '../lib/carrito'
import { fmtPrecio } from '../lib/format'

export default function CarritoPage() {
  const { items, total, cantidadTotal, cambiarCantidad, quitar } = useCarrito()
  const [montado, setMontado] = useState(false)

  useEffect(() => {
    setMontado(true)
  }, [])

  if (!montado) {
    return (
      <div className="space-y-3" aria-hidden="true">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-600 bg-neutral-800 px-6 py-16 text-center">
        <p className="text-lg font-semibold text-slate-300">Tu carrito está vacío</p>
        <p className="mt-1 text-sm text-slate-400">Explorá el catálogo y agregá productos.</p>
        <a
          href="/catalogo"
          className="mt-6 inline-block rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          Ver catálogo
        </a>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.producto_id}
            className="flex gap-4 rounded-2xl border border-slate-700 bg-neutral-800 p-4 shadow-sm"
          >
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-800">
              {item.imagen ? (
                <img src={item.imagen} alt={item.nombre} className="h-full w-full object-contain p-2" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <img src="/logo.png" alt="" className="h-10 w-10 object-contain opacity-40" />
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {item.marca && (
                    <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                      {item.marca}
                    </p>
                  )}
                  <a
                    href={`/producto/${item.producto_id}`}
                    className="truncate text-sm font-semibold text-slate-200 hover:text-orange-700"
                  >
                    {item.nombre}
                  </a>
                  <p className="mt-0.5 text-sm text-slate-400">
                    {fmtPrecio.format(item.precio)} c/u
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => quitar(item.producto_id)}
                  className="text-xs font-medium text-slate-400 transition hover:text-red-500"
                >
                  Quitar
                </button>
              </div>

              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => cambiarCantidad(item.producto_id, item.cantidad - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition hover:bg-neutral-800"
                    aria-label="Restar uno"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold tabular-nums text-slate-200">
                    {item.cantidad}
                  </span>
                  <button
                    type="button"
                    onClick={() => cambiarCantidad(item.producto_id, item.cantidad + 1)}
                    disabled={item.cantidad >= item.stock}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Sumar uno"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm font-bold tabular-nums text-slate-100">
                  {fmtPrecio.format(item.precio * item.cantidad)}
                </span>
              </div>

              {item.cantidad >= item.stock && (
                <p className="mt-2 text-xs text-amber-600">Stock máximo: {item.stock} unidades</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <aside className="h-fit rounded-2xl border border-slate-700 bg-neutral-800 p-5 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-300">Resumen</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-slate-400">
            <dt>Productos ({cantidadTotal})</dt>
            <dd className="tabular-nums">{fmtPrecio.format(total)}</dd>
          </div>
          <div className="flex justify-between font-bold text-slate-100">
            <dt>Total</dt>
            <dd className="tabular-nums">{fmtPrecio.format(total)}</dd>
          </div>
        </dl>

        <a
          href="/checkout"
          className="mt-5 block rounded-xl bg-orange-600 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
        >
          Finalizar compra
        </a>
        <a
          href="/catalogo"
          className="mt-3 block text-center text-sm font-medium text-slate-400 transition hover:text-slate-300"
        >
          Seguir comprando
        </a>

        <p className="mt-4 border-t border-slate-700 pt-4 text-xs leading-relaxed text-slate-400">
          Al confirmar, te contactamos por WhatsApp para coordinar el pago y la entrega.
        </p>
      </aside>
    </div>
  )
}
