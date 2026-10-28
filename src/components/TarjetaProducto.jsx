import { fmtPrecio } from '../lib/format'

function estadoStock(stock) {
  if (stock <= 0) return { texto: 'Sin stock', clase: 'bg-red-50 text-red-600 ring-red-100' }
  if (stock <= 5) return { texto: 'Últimas unidades', clase: 'bg-amber-50 text-amber-600 ring-amber-100' }
  return null
}

export default function TarjetaProducto({ producto }) {
  const stock = Number(producto.stock || 0)
  const aviso = estadoStock(stock)

  return (
    <a
      href={`/producto/${producto.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            loading="lazy"
            className="h-full w-full object-contain p-4 transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <img src="/logo.png" alt="" className="h-20 w-20 rounded-xl object-contain opacity-40" />
          </div>
        )}
        {aviso && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${aviso.clase}`}
          >
            {aviso.texto}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {producto.marca && (
          <span className="text-xs font-semibold uppercase tracking-wide text-orange-600">
            {producto.marca}
          </span>
        )}
        <h3 className="mt-1 line-clamp-2 flex-1 text-sm font-semibold text-slate-800 group-hover:text-slate-950">
          {producto.nombre}
        </h3>
        <p className="mt-3 text-lg font-bold tabular-nums text-slate-900">
          {fmtPrecio.format(producto.precio_venta)}
        </p>
      </div>
    </a>
  )
}
