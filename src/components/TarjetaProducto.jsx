import { fmtPrecio } from '../lib/format'

function estadoStock(stock) {
  if (stock <= 0) return { texto: 'Sin stock', clase: 'bg-red-500/10 text-red-400 ring-red-500/20' }
  return null
}

export default function TarjetaProducto({ producto }) {
  const stock = Number(producto.stock || 0)
  const aviso = estadoStock(stock)

  return (
    <a
      href={`/producto/${producto.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-800 shadow-sm transition hover:-translate-y-1 hover:border-orange-500/60 hover:shadow-lg hover:shadow-orange-900/20"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            loading="lazy"
            className="h-full w-full object-contain p-4 transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-700">
            <svg
              className="h-10 w-10 text-neutral-300"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
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
        <h3 className="mt-1 line-clamp-2 flex-1 text-sm font-semibold text-neutral-200 group-hover:text-neutral-50">
          {producto.nombre}
        </h3>
        {producto.descripcion && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-400">
            {producto.descripcion}
          </p>
        )}
        <p className="mt-3 text-lg font-bold tabular-nums text-neutral-100">
          {fmtPrecio.format(producto.precio_venta)}
        </p>
      </div>
    </a>
  )
}
