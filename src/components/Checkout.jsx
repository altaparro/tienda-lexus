import { useEffect, useState } from 'react'
import { useCarrito } from '../lib/carrito'
import { fmtPrecio } from '../lib/format'
import { NEGOCIO, linkWhatsApp } from '../lib/negocio'

const claseInput =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
const claseLabel = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500'

export default function Checkout() {
  const { items, total, cantidadTotal, vaciar } = useCarrito()
  const [montado, setMontado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [pedido, setPedido] = useState(null)

  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    notas: ''
  })

  useEffect(() => {
    setMontado(true)
  }, [])

  function actualizar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }))
  }

  async function enviar(e) {
    e.preventDefault()
    if (enviando) return
    setError('')

    if (!form.nombre.trim() || !form.telefono.trim()) {
      setError('Completá tu nombre y teléfono para continuar.')
      return
    }

    if (items.length === 0) {
      setError('Tu carrito está vacío.')
      return
    }

    try {
      setEnviando(true)

      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          telefono: form.telefono.trim(),
          email: form.email.trim(),
          direccion: form.direccion.trim(),
          notas: form.notas.trim(),
          items: items.map((i) => ({ producto_id: i.producto_id, cantidad: i.cantidad }))
        })
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data?.error || 'No pudimos registrar el pedido. Probá de nuevo.')
      }

      vaciar()
      setPedido({ ...data, ...form, items, total })
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  if (pedido) {
    return <Confirmacion pedido={pedido} />
  }

  if (!montado) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]" aria-hidden="true">
        <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <p className="text-lg font-semibold text-slate-700">No hay nada para comprar</p>
        <a
          href="/catalogo"
          className="mt-6 inline-block rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          Ver catálogo
        </a>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <form onSubmit={enviar} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-bold text-slate-900">Tus datos</h1>
        <p className="mt-1 text-sm text-slate-500">
          Te contactamos por WhatsApp para confirmar el pedido.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={claseLabel} htmlFor="nombre">Nombre *</label>
            <input
              id="nombre"
              className={claseInput}
              type="text"
              required
              placeholder="Tu nombre y apellido"
              value={form.nombre}
              onChange={(e) => actualizar('nombre', e.target.value)}
            />
          </div>
          <div>
            <label className={claseLabel} htmlFor="telefono">Teléfono *</label>
            <input
              id="telefono"
              className={claseInput}
              type="tel"
              required
              placeholder="221 123 4567"
              value={form.telefono}
              onChange={(e) => actualizar('telefono', e.target.value)}
            />
          </div>
          <div>
            <label className={claseLabel} htmlFor="email">Email (opcional)</label>
            <input
              id="email"
              className={claseInput}
              type="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={(e) => actualizar('email', e.target.value)}
            />
          </div>
          <div>
            <label className={claseLabel} htmlFor="direccion">Dirección (opcional)</label>
            <input
              id="direccion"
              className={claseInput}
              type="text"
              placeholder="Calle, número, localidad"
              value={form.direccion}
              onChange={(e) => actualizar('direccion', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={claseLabel} htmlFor="notas">Comentario (opcional)</label>
            <textarea
              id="notas"
              className={claseInput}
              rows="3"
              placeholder="Ej: retiro el sábado a la mañana, prefiero transferencia..."
              value={form.notas}
              onChange={(e) => actualizar('notas', e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="mt-6 w-full rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {enviando ? 'Enviando pedido...' : 'Confirmar pedido'}
        </button>
      </form>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">
          Tu pedido ({cantidadTotal})
        </h2>
        <ul className="mt-4 space-y-3">
          {items.map((i) => (
            <li key={i.producto_id} className="flex justify-between gap-3 text-sm">
              <span className="text-slate-600">
                <span className="font-semibold text-slate-800">{i.cantidad}×</span> {i.nombre}
              </span>
              <span className="shrink-0 tabular-nums text-slate-800">
                {fmtPrecio.format(i.precio * i.cantidad)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-sm font-bold text-slate-900">
          <span>Total</span>
          <span className="tabular-nums">{fmtPrecio.format(total)}</span>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-slate-400">
          El stock se reserva al confirmar con {NEGOCIO.nombre}. Sin pago online: coordinamos todo
          por WhatsApp.
        </p>
      </aside>
    </div>
  )
}

function Confirmacion({ pedido }) {
  const lineas = (pedido.items || [])
    .map((i) => `• ${i.cantidad}x ${i.nombre} — ${fmtPrecio.format(i.precio * i.cantidad)}`)
    .join('\n')

  const mensaje = [
    `Hola ${NEGOCIO.nombre}! Acabo de hacer el pedido #${pedido.pedido_id} desde la tienda.`,
    '',
    lineas,
    '',
    `Total: ${fmtPrecio.format(pedido.total)}`,
    `Nombre: ${pedido.nombre}`,
    `Tel: ${pedido.telefono}`,
    pedido.direccion ? `Dirección: ${pedido.direccion}` : null,
    pedido.notas ? `Comentario: ${pedido.notas}` : null
  ]
    .filter((l) => l !== null)
    .join('\n')

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
        ✓
      </div>
      <h1 className="mt-4 text-xl font-bold text-slate-900">¡Pedido recibido!</h1>
      <p className="mt-2 text-sm text-slate-500">
        Tu pedido <span className="font-semibold text-slate-700">#{pedido.pedido_id}</span> quedó
        registrado. El total es de{' '}
        <span className="font-semibold text-slate-700">{fmtPrecio.format(pedido.total)}</span>.
      </p>

      <a
        href={linkWhatsApp(mensaje)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
        Continuar en WhatsApp
      </a>

      <a
        href="/catalogo"
        className="mt-3 block text-sm font-medium text-slate-500 transition hover:text-slate-700"
      >
        Seguir comprando
      </a>
    </div>
  )
}
