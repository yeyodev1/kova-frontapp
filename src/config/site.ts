/**
 * El copy es configuración: todos los textos y datos de la marca viven acá.
 * Los componentes solo consumen y pintan.
 */
export const site = {
  name: 'Kova',
  tagline: 'Productos que te facilitan la vida.',
  description: 'Gadgets y productos útiles con envío a todo Ecuador.',
  url: 'https://kovashopper.com',
  email: 'hola@kovashopper.com',
  // Solo dígitos con código de país
  whatsapp: '593997011366',
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
  },
  nav: [
    { label: 'Inicio', to: '/' },
    { label: 'Tienda', to: '/tienda' },
    { label: 'Rastrear pedido', to: '/rastrear' },
  ],
} as const

export function whatsappLink(message = 'Hola Kova, quiero más información'): string {
  if (!site.whatsapp) return '#'
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
}
