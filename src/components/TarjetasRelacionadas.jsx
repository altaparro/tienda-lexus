import TarjetaProducto from './TarjetaProducto'

export default function TarjetasRelacionadas({ productos }) {
  const lista = productos || []

  if (!lista.length) return null

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {lista.map((p) => (
        <TarjetaProducto key={p.id} producto={p} />
      ))}
    </div>
  )
}
