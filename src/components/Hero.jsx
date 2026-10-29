import { useEffect, useState } from 'react'

export default function Hero({ imagenes }) {
  const [activa, setActiva] = useState(0)

  useEffect(() => {
    if (imagenes.length < 2) return
    const t = setInterval(() => setActiva((a) => (a + 1) % imagenes.length), 5000)
    return () => clearInterval(t)
  }, [imagenes.length])

  if (!imagenes.length) return null

  return (
    <section className="bg-neutral-900">
      <div className="mx-auto grid max-w-6xl px-4 py-6 sm:py-8">
        {imagenes.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden={i !== activa}
            className={`mx-auto max-h-[420px] w-auto max-w-full object-contain transition-opacity duration-1000 [grid-area:1/1] ${
              i === activa ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
