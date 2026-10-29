import { useState } from 'react'

export default function GaleriaProducto({ imagenes, nombre }) {
  const [activo, setActivo] = useState(0)

  if (!imagenes?.length) return null

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <img
          src={imagenes[activo]}
          alt={nombre}
          className="h-full w-full object-contain p-8"
        />
      </div>

      {imagenes.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {imagenes.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActivo(i)}
              className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition ${
                i === activo
                  ? 'border-orange-500'
                  : 'border-transparent hover:border-slate-300'
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
