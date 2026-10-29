import { useState } from 'react'
import TarjetaProducto from './TarjetaProducto'

const POR_PAGINA = 12

export default function ListadoProductos({ productos }) {
  const [pagina, setPagina] = useState(0)

  if (!productos?.length) return null

  const paginas = Math.ceil(productos.length / POR_PAGINA)
  const visibles = productos.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA)

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {visibles.map((p) => (
          <TarjetaProducto key={p.id} producto={p} />
        ))}
      </div>

      {paginas > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={pagina === 0}
            onClick={() => setPagina((p) => p - 1)}
            className="rounded-lg border border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-400 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Anteriores
          </button>
          <span className="px-3 text-sm tabular-nums text-neutral-400">
            Página {pagina + 1} de {paginas}
          </span>
          <button
            type="button"
            disabled={pagina >= paginas - 1}
            onClick={() => setPagina((p) => p + 1)}
            className="rounded-lg border border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-400 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguientes →
          </button>
        </div>
      )}
    </div>
  )
}
