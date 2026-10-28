export function coincideBusqueda(consulta, campos) {
  const tokens = consulta.toLowerCase().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return true

  const texto = campos.filter(Boolean).join(' ').toLowerCase()
  return tokens.every((token) => texto.includes(token))
}
