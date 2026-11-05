import { useEffect, useState } from 'react'
import { NEGOCIO } from '../lib/negocio'

export default function Hero({ imagenes, whatsapp }) {
  const [activa, setActiva] = useState(0)
  const [pausado, setPausado] = useState(false)

  useEffect(() => {
    if (imagenes.length < 2 || pausado) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    const t = setInterval(() => setActiva((a) => (a + 1) % imagenes.length), 5000)
    return () => clearInterval(t)
  }, [imagenes.length, pausado])

  if (!imagenes.length) return null

  return (
    <section className="relative overflow-hidden bg-neutral-900">
      <div className="relative h-[320px] w-full overflow-hidden sm:h-[420px]">
        {imagenes.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${NEGOCIO.nombre}: foto ${i + 1} del local`}
            aria-hidden={i !== activa}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'auto'}
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              i === activa ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {imagenes.length > 1 && (
          <button
            type="button"
            onClick={() => setPausado((p) => !p)}
            aria-label={pausado ? 'Reanudar presentación de fotos' : 'Pausar presentación de fotos'}
            aria-pressed={pausado}
            className="absolute bottom-6 left-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950/60 text-neutral-100 backdrop-blur transition hover:bg-neutral-950/80 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {pausado ? (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 0 1 0 1.971l-11.54 6.347a1.125 1.125 0 0 1-1.667-.985V5.653Z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 4.5A1.5 1.5 0 0 1 8.5 3h1A1.5 1.5 0 0 1 11 4.5v15A1.5 1.5 0 0 1 9.5 21h-1A1.5 1.5 0 0 1 7 19.5v-15Zm6 0A1.5 1.5 0 0 1 14.5 3h1A1.5 1.5 0 0 1 17 4.5v15A1.5 1.5 0 0 1 15.5 21h-1A1.5 1.5 0 0 1 13 19.5v-15Z" />
              </svg>
            )}
          </button>
        )}

        {whatsapp && (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Consultar por WhatsApp"
            className="group absolute bottom-6 right-6 z-10 flex items-center gap-2 rounded-full bg-emerald-500 p-4 text-neutral-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 hover:shadow-emerald-500/40"
          >
            <svg className="h-6 w-6 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[160px] group-hover:pr-1">
              Consultar
            </span>
          </a>
        )}
      </div>
    </section>
  )
}
