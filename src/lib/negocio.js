export const NEGOCIO = {
  nombre: 'Lexus Autoradio',
  whatsapp: '542212028667',
  telefono: '221-202-8667',
  direccion: 'Calle 10 1745, B1904 La Plata, Provincia de Buenos Aires, Argentina',
  ciudad: 'La Plata',
  horarios: 'Lun a vie 9 a 18 hs · Sáb 9 a 13 hs'
}

export function linkWhatsApp(mensaje) {
  return `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(mensaje)}`
}
