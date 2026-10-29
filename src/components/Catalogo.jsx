import { useMemo, useState, useEffect } from 'react'
import TarjetaProducto from './TarjetaProducto'
import { coincideBusqueda } from '../lib/busqueda'

const POR_PAGINA = 12

export default function Catalogo({ productos, tipoInicial = '', marcaInicial = '', busquedaInicial = '' }) {
  const [busqueda, setBusqueda] = useState(busquedaInicial)
  const [tipo, setTipo] = useState(tipoInicial)
  const [marca, setMarca] = useState(marcaInicial)
  const [orden, setOrden] = useState('')
  const [pagina, setPagina] = useState(0)

  const tipos = useMemo(() => {
    const set = new Set()
    productos.forEach((p) => {
      if (p.tipo?.nombre) set.add(p.tipo.nombre)
    })
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [productos])

  const marcas = useMemo(() => {
    const set = new Set()
    productos.forEach((p) => {
      if (p.marca) set.add(p.marca.trim())
    })
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [productos])

  const filtrados = useMemo(() => {
    let res = productos.filter((p) => {
      if (tipo && p.tipo?.nombre !== tipo) return false
      if (marca && p.marca?.trim() !== marca) return false
      if (!busqueda.trim()) return true
      return coincideBusqueda(busqueda, [
        p.nombre?.toLowerCase() ?? '',
        p.codigo?.toLowerCase() ?? '',
        p.marca?.toLowerCase() ?? '',
        p.descripcion?.toLowerCase() ?? '',
        p.tipo?.nombre?.toLowerCase() ?? ''
      ])
    })
    if (orden === 'asc') res = [...res].sort((a, b) => Number(a.precio_venta) - Number(b.precio_venta))
    if (orden === 'desc') res = [...res].sort((a, b) => Number(b.precio_venta) - Number(a.precio_venta))
    return res
  }, [productos, busqueda, tipo, marca, orden])

  const hayFiltro = busqueda || tipo || marca

  useEffect(() => {
    setPagina(0)
  }, [busqueda, tipo, marca, orden])

  const paginas = Math.ceil(filtrados.length / POR_PAGINA)
  const visibles = filtrados.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA)

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          placeholder="Buscar por nombre, código o marca..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-xl border border-neutral-600 bg-neutral-800 px-4 py-3 text-sm text-neutral-200 shadow-sm placeholder:text-neutral-400 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 sm:w-72"
        />

        <div className="flex flex-1 flex-wrap gap-2">
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="rounded-xl border border-neutral-600 bg-neutral-800 px-3 py-3 text-sm text-neutral-200 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
          >
            <option value="">Todos los tipos</option>
            {tipos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            className="rounded-xl border border-neutral-600 bg-neutral-800 px-3 py-3 text-sm text-neutral-200 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
          >
            <option value="">Todas las marcas</option>
            {marcas.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="rounded-xl border border-neutral-600 bg-neutral-800 px-3 py-3 text-sm text-neutral-200 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
          >
            <option value="">Ordenar por</option>
            <option value="asc">Menor precio</option>
            <option value="desc">Mayor precio</option>
          </select>

          {hayFiltro && (
            <button
              type="button"
              onClick={() => {
                setBusqueda('')
                setTipo('')
                setMarca('')
                setOrden('')
              }}
              className="rounded-xl border border-neutral-700 px-4 py-3 text-sm font-medium text-neutral-400 transition hover:bg-neutral-800"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <p className="mb-4 text-sm text-neutral-400">
        {filtrados.length === 1 ? '1 producto' : `${filtrados.length} productos`}
      </p>

      {filtrados.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-600 bg-neutral-800 px-6 py-16 text-center">
          <p className="font-medium text-neutral-400">No encontramos productos con esa búsqueda</p>
          <p className="mt-1 text-sm text-neutral-400">Probá con otros filtros o términos.</p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
