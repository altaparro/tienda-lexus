import { useEffect, useState } from 'react'

export default function Hero({ nombre, texto, imagenes, waConsulta }) {
  const [activa, setActiva] = useState(0)

  useEffect(() => {
    if (imagenes.length < 2) return
    const t = setInterval(() => setActiva((a) => (a + 1) % imagenes.length), 5000)
    return () => clearInterval(t)
  }, [imagenes.length])

  const conFondo = imagenes.length > 0

  return (
    <section
      className={
        conFondo
          ? 'relative overflow-hidden border-b border-slate-800'
          : 'border-b border-slate-200 bg-gradient-to-b from-orange-50 to-white'
      }
    >
      {conFondo && (
        <div className="absolute inset-0" aria-hidden="true">
          {imagenes.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                i === activa ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-slate-900/60" />
        </div>
      )}

      <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:py-20">
        <div className="mx-auto w-fit rounded-2xl bg-white p-3 shadow-lg">
          <img
            src="/logo.png"
            alt={nombre}
            className="h-14 w-14 rounded-xl object-contain sm:h-16 sm:w-16"
          />
        </div>

        <p
          className={`mt-5 text-xs font-semibold uppercase tracking-widest ${
            conFondo ? 'text-amber-400' : 'text-orange-600'
          }`}
        >
          Quiénes somos
        </p>
        <h1
          className={`mx-auto mt-2 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl ${
            conFondo ? 'text-white' : 'text-slate-900'
          }`}
        >
          {nombre}
        </h1>
        <p
          className={`mx-auto mt-4 max-w-2xl text-base leading-relaxed ${
            conFondo ? 'text-slate-200' : 'text-slate-500'
          }`}
        >
          {texto}
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href="/catalogo"
            className="rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
          >
            Ver catálogo
          </a>
          <a
            href={waConsulta}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-xl px-6 py-3.5 text-sm font-semibold shadow-sm transition ${
              conFondo
                ? 'border border-white/30 bg-white/10 text-white hover:bg-white/20'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
