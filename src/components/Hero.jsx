import { useEffect, useState } from 'react'
import { NEGOCIO } from '../lib/negocio.js'

export default function Hero({ imagenes, titulo, subtitulo }) {
  const [activa, setActiva] = useState(0)

  useEffect(() => {
    if (imagenes.length < 2) return
    const t = setInterval(() => setActiva((a) => (a + 1) % imagenes.length), 5000)
    return () => clearInterval(t)
  }, [imagenes.length])

  if (!imagenes.length) return null

  return (
    <section className="relative overflow-hidden bg-neutral-900">
      <div className="relative h-[320px] w-full overflow-hidden sm:h-[420px]">
        {imagenes.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden={i !== activa}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              i === activa ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-8 sm:pb-10">
          <h1 className="max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            {titulo || NEGOCIO.nombre}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-300 sm:text-base">
            {subtitulo || 'Venta e instalación de estéreos, parlantes, alarmas y más. Pedí online y coordinamos por WhatsApp.'}
          </p>
          <a
            href="/catalogo"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition hover:bg-orange-500"
          >
            Ver catálogo →
          </a>
        </div>
      </div>
    </section>
  )
}
