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
      <div className="relative mx-auto h-[320px] w-full max-w-6xl overflow-hidden sm:h-[420px]">
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
      </div>
    </section>
  )
}
