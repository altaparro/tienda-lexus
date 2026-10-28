import { useMemo, useState } from 'react'
import TarjetaProducto from './TarjetaProducto'
import { coincideBusqueda } from '../lib/busqueda'

export default function Catalogo({ productos, tipoInicial = '', marcaInicial = '' }) {
  const [busqueda, setBusqueda] = useState('')
  const [tipo, setTipo] = useState(tipoInicial)
  const [marca, setMarca] = useState(marcaInicial)

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
    return productos.filter((p) => {
      if (tipo && p.tipo?.nombre !== tipo) return false
      if (marca && p.marca?.trim() !== marca) return false
      if (!busqueda.trim()) return true
      return coincideBusqueda(busqueda, [
        p.nombre?.toLowerCase() ?? '',
        p.codigo?.toLowerCase() ?? '',
        p.marca?.toLowerCase() ?? '',
        p.tipo?.nombre?.toLowerCase() ?? ''
      ])
    })
  }, [productos, busqueda, tipo, marca])

  const hayFiltro = busqueda || tipo || marca

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          placeholder="Buscar por nombre, código o marca..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 sm:w-72"
        />

        <div className="flex flex-1 flex-wrap gap-2">
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
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
            className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          >
            <option value="">Todas las marcas</option>
            {marcas.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {hayFiltro && (
            <button
              type="button"
              onClick={() => {
                setBusqueda('')
                setTipo('')
                setMarca('')
              }}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-white"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <p className="mb-4 text-sm text-slate-500">
        {filtrados.length === 1 ? '1 producto' : `${filtrados.length} productos`}
      </p>

      {filtrados.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <p className="font-medium text-slate-600">No encontramos productos con esa búsqueda</p>
          <p className="mt-1 text-sm text-slate-400">Probá con otros filtros o términos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtrados.map((p) => (
            <TarjetaProducto key={p.id} producto={p} />
          ))}
        </div>
      )}
    </div>
  )
}
