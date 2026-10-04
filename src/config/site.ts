/**
 * El copy es configuración: todos los textos y datos de la marca viven acá.
 * Los componentes solo consumen y pintan.
 *
 * Regla de la casa: nada de prueba social inventada. Ni reseñas, ni contadores
 * de "personas viendo", ni temporizadores. Solo lo que viene real del API
 * (vendidos, stock) y garantías que de verdad cumplimos.
 */
import type { OrderStatus, PaymentMethod } from '@/types'

export const site = {
  name: 'Kova',
  logo: '/logo.jpg',
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

// ─── Confianza ──────────────────────────────────────────────────────────

/** Garantías verdaderas: se repiten en home, producto y checkout. */
export const guarantees = [
  {
    icon: 'fa-solid fa-truck-fast',
    title: 'Envío a todo Ecuador',
    text: 'Llegamos a las 24 provincias con transportadoras nacionales.',
  },
  {
    icon: 'fa-solid fa-hand-holding-dollar',
    title: 'Paga al recibir',
    text: 'Pago contra entrega disponible: pagas cuando el producto llega.',
  },
  {
    icon: 'fa-solid fa-lock',
    title: 'Pago seguro',
    text: 'Tarjetas procesadas por Payphone. Nunca vemos los datos de tu tarjeta.',
  },
  {
    icon: 'fa-brands fa-whatsapp',
    title: 'Atención por WhatsApp',
    text: 'Te respondemos personas reales antes, durante y después de tu compra.',
  },
]

/** Sellos cortos bajo los botones de compra. */
export const trustSeals = [
  { icon: 'fa-solid fa-truck-fast', label: 'Envío a todo Ecuador' },
  { icon: 'fa-solid fa-hand-holding-dollar', label: 'Pago contra entrega' },
  { icon: 'fa-solid fa-shield-halved', label: 'Pago seguro' },
]

export const paymentMethodsInfo = {
  title: 'Paga como prefieras',
  text: 'Con tarjeta pagas el precio más bajo. Contra entrega y transferencia tienen un pequeño recargo que ves claramente en el checkout antes de confirmar.',
  items: [
    {
      icon: 'fa-solid fa-credit-card',
      title: 'Tarjeta de crédito o débito',
      text: 'Visa y Mastercard, procesado por Payphone. Precio más bajo.',
    },
    {
      icon: 'fa-solid fa-building-columns',
      title: 'Transferencia bancaria',
      text: 'Transfieres y nos envías el comprobante. Pequeño recargo.',
    },
    {
      icon: 'fa-solid fa-hand-holding-dollar',
      title: 'Contra entrega',
      text: 'Pagas en efectivo al recibir. Pequeño recargo.',
    },
  ],
}

// ─── Home ───────────────────────────────────────────────────────────────

export const home = {
  hero: {
    eyebrow: 'Envío a todo Ecuador',
    title: 'Gadgets útiles que te resuelven el día',
    // El titular entra línea por línea: cada elemento es una línea en móvil.
    titleLines: ['Gadgets útiles', 'que te resuelven', 'el día.'],
    text: 'Para tu casa, tu carro y tu rutina. Pide en dos minutos y, si prefieres, paga al recibir.',
    cta: 'Ver productos',
    secondary: 'WhatsApp',
  },
  vitrine: {
    label: 'En vitrina',
    view: 'Ver producto',
    prev: 'Producto anterior',
    next: 'Producto siguiente',
    goTo: (n: number) => `Ver destacado ${n}`,
    fallbackTitle: 'La vitrina se está llenando',
    fallbackText: 'Muy pronto verás aquí nuestros destacados.',
  },
  payments: {
    eyebrow: 'Métodos de pago',
  },
  notFound: {
    code: 'Error 404',
    title: 'Aquí no hay nada en vitrina',
    text: 'Puede que el enlace esté mal escrito o que la página se haya movido. Lo bueno está en la tienda.',
    cta: 'Ir a la tienda',
    secondary: 'Escríbenos',
  },
  featured: {
    eyebrow: 'Destacados',
    title: 'Lo que más recomendamos',
  },
  popular: {
    eyebrow: 'Más vendidos',
    title: 'Lo que más se llevan',
  },
  steps: {
    eyebrow: 'Cómo comprar',
    title: 'Tu pedido en 3 pasos',
    items: [
      {
        icon: 'fa-solid fa-hand-pointer',
        title: 'Elige tu producto',
        text: 'Escoge la cantidad. Llevando más unidades suele salir más barato.',
      },
      {
        icon: 'fa-solid fa-pen-to-square',
        title: 'Completa tus datos',
        text: 'Sin crear cuenta: nombre, celular y dirección de entrega.',
      },
      {
        icon: 'fa-solid fa-box-open',
        title: 'Recíbelo en casa',
        text: 'Despachamos a todo Ecuador y te avisamos por WhatsApp.',
      },
    ],
  },
  faqs: {
    eyebrow: 'Preguntas frecuentes',
    title: 'Resolvemos tus dudas',
  },
  finalCta: {
    title: '¿Listo para hacerte la vida más fácil?',
    text: 'Explora la tienda o escríbenos por WhatsApp si necesitas ayuda para elegir.',
    cta: 'Ir a la tienda',
  },
  empty: {
    title: 'Estamos preparando la tienda',
    text: 'Muy pronto verás aquí nuestros productos. Mientras tanto, escríbenos por WhatsApp.',
  },
}

export const generalFaqs = [
  {
    question: '¿Hacen envíos a todo Ecuador?',
    answer:
      'Sí. Enviamos a las 24 provincias a través de transportadoras nacionales. El tiempo de entrega suele ser de 1 a 3 días hábiles en ciudades principales y de 3 a 6 días hábiles en zonas rurales o alejadas.',
  },
  {
    question: '¿Puedo pagar cuando me llegue el producto?',
    answer:
      'Sí, tenemos pago contra entrega. Pagas en efectivo al recibir tu pedido. Este método tiene un pequeño recargo que ves en el checkout antes de confirmar.',
  },
  {
    question: '¿Es seguro pagar con tarjeta?',
    answer:
      'Sí. Los pagos con tarjeta los procesa Payphone, una pasarela ecuatoriana. Kova nunca ve ni guarda los datos de tu tarjeta.',
  },
  {
    question: '¿Cómo sé dónde está mi pedido?',
    answer:
      'Te escribimos por WhatsApp con la confirmación y la guía de envío. También puedes consultarlo en "Rastrear pedido" con tu número de pedido y tu celular.',
  },
  {
    question: '¿Qué pasa si el producto llega dañado?',
    answer:
      'Escríbenos por WhatsApp dentro de las 48 horas de recibirlo, con fotos del producto y el empaque. Lo revisamos y te ofrecemos cambio o devolución según nuestra política.',
  },
  {
    question: '¿Necesito crear una cuenta?',
    answer: 'No. Compras como invitado: solo necesitamos tus datos de entrega y un celular de contacto.',
  },
]

// ─── Catálogo y producto ────────────────────────────────────────────────

export const catalog = {
  eyebrow: 'Tienda Kova',
  title: 'Cosas útiles, bien elegidas',
  subtitle: 'Gadgets para tu casa, tu carro y tu rutina. Envío a todo Ecuador y pago al recibir.',
  count: (n: number) => (n === 1 ? '1 producto' : `${n} productos`),
  resultsFor: (q: string) => `Resultados para “${q}”`,
  searchPlaceholder: 'Buscar productos',
  clearSearch: 'Borrar búsqueda',
  categoriesLabel: 'Categorías',
  allCategories: 'Todo',
  sortLabel: 'Ordenar',
  loadMore: 'Cargar más',
  loadingMore: 'Cargando',
  shown: (n: number, total: number) => `${n} de ${total}`,
  emptyTitle: 'No encontramos productos',
  emptyText: 'Prueba con otra palabra, revisa la ortografía o mira todas las categorías.',
  emptyCta: 'Ver todos los productos',
  retry: 'Reintentar',
  sorts: [
    { value: 'popular', label: 'Más vendidos' },
    { value: 'new', label: 'Más nuevos' },
    { value: 'price_asc', label: 'Precio: menor a mayor' },
    { value: 'price_desc', label: 'Precio: mayor a menor' },
  ],
}

export const productCopy = {
  lowStockThreshold: 10,
  lowStock: 'Quedan pocas unidades',
  lowStockBadge: (n: number) => `Quedan ${n}`,
  lowStockLine: (n: number) => (n === 1 ? 'Queda 1 unidad' : `Quedan ${n} unidades`),
  soldOut: 'Agotado',
  bestSeller: 'Más vendido',
  bestSellerFrom: 20, // vendidos reales a partir de los cuales se muestra el badge
  sold: (n: number) => `+${n} vendidos`,
  youSave: (amount: string) => `Ahorras ${amount}`,
  off: (percent: number) => `-${percent}%`,
  buyNow: 'Comprar ahora',
  addToCart: 'Agregar al carrito',
  added: 'Agregado al carrito',
  quickAdd: 'Agregar',
  chooseOptions: 'Elegir opción',
  offersTitle: 'Elige tu oferta',
  offerTotal: 'Total',
  variantTitle: 'Elige una opción',
  quantityTitle: 'Cantidad',
  unit: (n: number) => (n === 1 ? '1 unidad' : `${n} unidades`),
  perUnit: (amount: string) => `${amount} c/u`,
  paymentsTitle: 'Aceptamos',
  photos: (title: string) => `Fotos de ${title}`,
  photoAlt: (title: string, n: number) => `${title}, foto ${n}`,
  viewPhoto: (n: number) => `Ver foto ${n}`,
  prevPhoto: 'Foto anterior',
  nextPhoto: 'Foto siguiente',
  zoom: 'Ampliar foto',
  closeZoom: 'Cerrar',
  benefitsTitle: 'Por qué te va a gustar',
  descriptionTitle: 'Descripción',
  faqsTitle: 'Preguntas frecuentes',
  relatedEyebrow: 'Sigue mirando',
  relatedTitle: 'También te puede interesar',
  loading: 'Cargando producto',
  notFoundEyebrow: 'Error 404',
  notFoundTitle: 'Este producto no está disponible',
  notFoundText: 'Puede que se haya agotado o que el enlace esté mal escrito. Mira lo que sí tenemos o escríbenos.',
  notFoundCta: 'Ver productos',
  needHelp: '¿Tienes dudas? Escríbenos',
  whatsappMessage: (title: string) => `Hola Kova, tengo una pregunta sobre: ${title}`,
}

export const cartCopy = {
  title: 'Tu carrito',
  empty: 'Tu carrito está vacío',
  emptyText: 'Agrega productos para empezar tu pedido.',
  goShopping: 'Ver productos',
  subtotal: 'Subtotal',
  checkout: 'Finalizar compra',
  note: 'El envío y el método de pago se eligen en el siguiente paso.',
  remove: 'Quitar',
  close: 'Cerrar carrito',
  items: (n: number) => (n === 1 ? '1 producto' : `${n} productos`),
}

// ─── Checkout ───────────────────────────────────────────────────────────

export const checkoutCopy = {
  secure: 'Pago seguro',
  backToStore: 'Volver a la tienda',
  steps: ['Datos', 'Envío', 'Pago'],
  stepsLabel: 'Progreso de tu pedido',
  stepDone: 'completado',
  summary: 'Tu pedido',
  showSummary: 'Ver resumen',
  hideSummary: 'Ocultar resumen',
  itemsCount: (n: number) => (n === 1 ? '1 producto' : `${n} productos`),
  totalNote: 'Precio final en dólares. Sin cobros ocultos.',
  subtotal: 'Subtotal',
  shipping: 'Envío',
  freeShipping: 'Gratis',
  surcharge: 'Recargo por método de pago',
  total: 'Total',
  contactTitle: 'Tus datos',
  addressTitle: 'Dirección de entrega',
  addressNote: 'Lo llevamos hasta tu puerta con una transportadora nacional.',
  paymentTitle: 'Forma de pago',
  paymentNote: 'Eliges ahora y ves el total exacto antes de confirmar.',
  confirm: 'Confirmar pedido',
  processing: 'Confirmando tu pedido...',
  validLabel: 'Correcto',
  emptyTitle: 'Tu carrito está vacío',
  emptyText: 'Elige un producto para hacer tu pedido.',
  emptyCta: 'Ir a la tienda',
  noAccount: 'No necesitas crear cuenta.',
  fields: {
    firstName: 'Nombre',
    lastName: 'Apellido',
    phone: 'Celular',
    phonePlaceholder: '09XXXXXXXX',
    phoneHint: 'Te escribimos por WhatsApp para coordinar la entrega.',
    idNumber: 'Cédula (opcional)',
    email: 'Email (opcional)',
    emailHint: 'Para enviarte la confirmación del pedido.',
    province: 'Provincia',
    city: 'Ciudad',
    street: 'Dirección',
    streetPlaceholder: 'Calle principal, número y calle secundaria',
    reference: 'Referencia',
    referencePlaceholder: 'Ej.: casa blanca de dos pisos, junto a la farmacia',
    selectProvince: 'Selecciona tu provincia',
    selectCity: 'Selecciona tu ciudad',
    loadingCities: 'Cargando ciudades...',
  },
  errors: {
    required: 'Completa este campo',
    firstName: 'Escribe tu nombre',
    lastName: 'Escribe tu apellido',
    phoneRequired: 'Escribe tu celular: por ahí coordinamos la entrega',
    phone: 'Debe tener 10 dígitos y empezar en 09, por ejemplo 0991234567',
    email: 'Revisa el email: debe verse como nombre@correo.com',
    idNumber: 'La cédula tiene 10 dígitos (13 si es RUC)',
    provinceId: 'Elige tu provincia',
    cityId: 'Elige tu ciudad',
    street: 'Escribe la calle principal y el número de tu casa',
    form: 'Te falta completar algunos datos: te llevamos al primero.',
  },
  methods: {
    card: {
      icon: 'fa-solid fa-credit-card',
      title: 'Tarjeta',
      text: 'Crédito o débito, procesado por Payphone.',
      badge: 'Precio más bajo',
      logos: ['fa-brands fa-cc-visa', 'fa-brands fa-cc-mastercard', 'fa-brands fa-cc-diners-club'],
    },
    transfer: {
      icon: 'fa-solid fa-building-columns',
      title: 'Transferencia',
      text: 'Te damos los datos bancarios al confirmar.',
      badge: '',
      logos: ['fa-solid fa-building-columns'],
    },
    cod: {
      icon: 'fa-solid fa-hand-holding-dollar',
      title: 'Contra entrega',
      text: 'Pagas en efectivo cuando llega tu pedido.',
      badge: 'Pagas al recibir',
      logos: ['fa-solid fa-money-bill-wave'],
    },
  } as Record<PaymentMethod, { icon: string; title: string; text: string; badge: string; logos: string[] }>,
  surchargeLabel: (amount: string) => `+${amount}`,
  surchargeHint: 'recargo',
  noSurcharge: 'Sin recargo',
  payphoneTitle: 'Paga con tu tarjeta',
  payphoneText: 'Formulario seguro de Payphone. Kova nunca ve los datos de tu tarjeta.',
  payphoneAmount: 'Total a pagar',
  payphoneOrder: 'Pedido',
  payphoneLoading: 'Cargando formulario seguro...',
  payphoneError: 'No pudimos cargar el formulario de pago. Revisa tu conexión e inténtalo otra vez, o elige otro método.',
  payphoneRetry: 'Reintentar',
  payphoneChange: 'Cambiar método de pago',
}

export const paymentResponseCopy = {
  loadingTitle: 'Confirmando tu pago',
  loadingText: 'No cierres esta página, tarda unos segundos.',
  approvedTitle: '¡Pago aprobado!',
  approvedText: 'Te llevamos a tu pedido...',
  rejectedTitle: 'El pago no se completó',
  rejectedText: 'Tu tarjeta no fue cobrada o el pago fue rechazado. Puedes intentar de nuevo o elegir otro método de pago.',
  rejectedNote: 'Tu carrito sigue guardado: no tienes que elegir los productos otra vez.',
  retry: 'Intentar de nuevo',
  otherMethod: 'Pagar contra entrega o por transferencia',
  help: 'Pedir ayuda por WhatsApp',
  backHome: 'Volver a la tienda',
  invalid: 'No encontramos los datos del pago.',
  whatsappMessage: 'Hola Kova, tuve un problema al pagar mi pedido con tarjeta.',
}

export const orderCopy = {
  thanks: 'Gracias por tu compra',
  received: (n: string) => `Pedido ${n} recibido`,
  receivedLabel: 'Pedido recibido',
  lead: {
    card: 'Tu pago fue aprobado. Ya estamos preparando tu pedido.',
    cod: 'Te escribimos por WhatsApp para confirmar la entrega. Pagas al recibir.',
    transfer: 'Solo falta tu transferencia. Abajo tienes los datos y el monto exacto.',
  } as Record<PaymentMethod, string>,
  loadingOrder: 'Cargando tu pedido...',
  orderError: 'No pudimos cargar el detalle del pedido, pero quedó registrado. Escríbenos por WhatsApp si necesitas algo.',
  summary: 'Resumen',
  nextSteps: 'Próximos pasos',
  stepDone: 'Hecho',
  stepNow: 'Ahora',
  steps: {
    card: [
      'Tu pago fue aprobado.',
      'Preparamos tu pedido y lo entregamos a la transportadora.',
      'Te enviamos la guía por WhatsApp para que sigas el envío.',
    ],
    cod: [
      'Te contactaremos por WhatsApp para confirmar tu pedido.',
      'Lo despachamos a tu dirección.',
      'Pagas en efectivo al recibirlo.',
    ],
    transfer: [
      'Transfiere el monto exacto a una de nuestras cuentas.',
      'Sube el comprobante aquí o envíalo por WhatsApp.',
      'Confirmamos el pago y despachamos tu pedido.',
    ],
  } as Record<PaymentMethod, string[]>,
  bankTitle: 'Datos para la transferencia',
  bankText: 'Transfiere a cualquiera de estas cuentas. Usa el monto exacto para confirmarlo más rápido.',
  bankEmpty: 'Escríbenos por WhatsApp y te enviamos los datos bancarios al instante.',
  amountToPay: 'Monto exacto a transferir',
  copy: 'Copiar',
  copied: 'Copiado',
  holder: 'Titular',
  idNumber: 'Cédula/RUC',
  accountNumber: 'Número de cuenta',
  uploadTitle: 'Sube tu comprobante',
  uploadText: 'Foto o captura de la transferencia (JPG, PNG o PDF).',
  uploadCta: 'Elegir archivo',
  uploadDrop: 'Toca para elegir o arrastra el archivo aquí',
  uploadDropActive: 'Suéltalo aquí',
  uploadChange: 'Cambiar archivo',
  uploadSend: 'Enviar comprobante',
  uploadInvalid: 'Ese archivo no sirve: sube una foto (JPG o PNG) o un PDF.',
  uploading: 'Subiendo comprobante...',
  uploaded: 'Recibimos tu comprobante. Lo revisaremos y te avisaremos por WhatsApp.',
  sendReceiptWhatsapp: 'Enviar comprobante por WhatsApp',
  whatsappCta: 'Escríbenos por WhatsApp',
  whatsappMessage: (n: string) => `Hola Kova, tengo una consulta sobre mi pedido ${n}`,
  whatsappReceipt: (n: string) => `Hola Kova, te envío el comprobante de transferencia de mi pedido ${n}`,
  continueShopping: 'Seguir comprando',
  notFound: 'No encontramos este pedido. Revisa el número o escríbenos por WhatsApp.',
  trackTitle: 'Rastrea tu pedido',
  trackText: 'Ingresa tu número de pedido y el celular con el que compraste.',
  trackNumber: 'Número de pedido',
  trackNumberPlaceholder: 'KV-1001',
  trackPhone: 'Celular',
  trackCta: 'Consultar',
  trackLoading: 'Buscando tu pedido...',
  trackNumberError: 'Escribe tu número de pedido, por ejemplo KV-1001',
  trackStatus: 'Estado actual',
  trackShipTitle: 'Envío',
  trackNoGuide: 'Cuando despachemos tu pedido verás aquí la guía de la transportadora.',
  trackHelp: '¿No lo encuentras? Escríbenos por WhatsApp',
  guide: 'Guía',
  carrier: 'Transportadora',
  method: 'Método de pago',
}

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  card: 'Tarjeta',
  cod: 'Contra entrega',
  transfer: 'Transferencia',
}

export const orderStatusLabel: Record<OrderStatus, string> = {
  pending_payment: 'Esperando pago',
  awaiting_transfer: 'Esperando transferencia',
  transfer_review: 'Revisando comprobante',
  confirmed: 'Confirmado',
  sent_to_dropi: 'En preparación',
  shipped: 'Enviado',
  delivered: 'Entregado',
  returned: 'Devuelto',
  cancelled: 'Cancelado',
  failed: 'Con problemas',
}

/** Línea de tiempo simple para el rastreo: cada paso agrupa estados. */
export const orderTimeline: { label: string; statuses: OrderStatus[] }[] = [
  { label: 'Pedido recibido', statuses: ['pending_payment', 'awaiting_transfer', 'transfer_review'] },
  { label: 'Confirmado', statuses: ['confirmed'] },
  { label: 'En preparación', statuses: ['sent_to_dropi'] },
  { label: 'Enviado', statuses: ['shipped'] },
  { label: 'Entregado', statuses: ['delivered'] },
]

// ─── Layout ─────────────────────────────────────────────────────────────

export const layoutCopy = {
  search: 'Buscar',
  cart: 'Carrito',
  openMenu: 'Abrir menú',
  closeMenu: 'Cerrar menú',
  whatsappFloat: 'Escríbenos por WhatsApp',
  home: 'Kova, inicio',
  menu: 'Menú',
  closeSearch: 'Cerrar buscador',
  footer: {
    help: 'Ayuda',
    policies: 'Políticas',
    payments: 'Métodos de pago',
    contact: 'Contacto',
    whatsappTitle: '¿Dudas antes de comprar?',
    whatsappText: 'Te responde una persona real, antes y después de tu compra.',
    country: 'Ecuador',
    credit: 'Hecho por',
  },
}

// ─── Políticas ──────────────────────────────────────────────────────────

export interface Policy {
  slug: string
  title: string
  updated: string
  sections: { heading: string; body: string[] }[]
}

export const policies: Policy[] = [
  {
    slug: 'envios',
    title: 'Política de envíos',
    updated: 'Octubre 2026',
    sections: [
      {
        heading: 'Cobertura',
        body: [
          'Enviamos a las 24 provincias del Ecuador mediante transportadoras nacionales aliadas.',
          'Algunas zonas rurales o de difícil acceso pueden tener tiempos mayores o requerir retiro en la oficina de la transportadora más cercana. Si es tu caso, te avisamos por WhatsApp antes de despachar.',
        ],
      },
      {
        heading: 'Tiempos de entrega',
        body: [
          'Ciudades principales: de 1 a 3 días hábiles desde la confirmación del pedido.',
          'Zonas rurales y alejadas: de 3 a 6 días hábiles.',
          'Los pedidos pagados con tarjeta o contra entrega se procesan el mismo día o el siguiente día hábil. Los pagados por transferencia se procesan cuando confirmamos el pago.',
        ],
      },
      {
        heading: 'Costo de envío',
        body: [
          'El costo de envío, si aplica, se muestra en el checkout antes de confirmar el pedido. No hay cobros ocultos.',
        ],
      },
      {
        heading: 'Seguimiento',
        body: [
          'Cuando tu pedido sale, te enviamos la guía por WhatsApp. También puedes consultarlo en la sección "Rastrear pedido".',
          'Mantén tu celular disponible: la transportadora puede llamarte para coordinar la entrega.',
        ],
      },
    ],
  },
  {
    slug: 'devoluciones',
    title: 'Cambios y devoluciones',
    updated: 'Octubre 2026',
    sections: [
      {
        heading: 'Producto dañado o incorrecto',
        body: [
          'Si tu producto llega dañado, incompleto o no corresponde a lo que pediste, escríbenos por WhatsApp dentro de las 48 horas siguientes a recibirlo, con fotos del producto y del empaque.',
          'Revisamos tu caso y te ofrecemos el cambio del producto o la devolución de tu dinero. En estos casos el envío corre por nuestra cuenta.',
        ],
      },
      {
        heading: 'Derecho de devolución',
        body: [
          'Conforme a la Ley Orgánica de Defensa del Consumidor, en compras a distancia tienes derecho a devolver el producto dentro de los 15 días posteriores a recibirlo, siempre que esté sin uso, completo y en su empaque original.',
          'En devoluciones que no se deben a un defecto, el costo del envío de retorno lo asume el cliente.',
        ],
      },
      {
        heading: 'Reembolsos',
        body: [
          'Pagos con tarjeta: se reversan a la misma tarjeta a través de Payphone. El tiempo en que se refleja depende de tu banco.',
          'Pagos por transferencia o contra entrega: se reembolsan por transferencia bancaria a la cuenta que nos indiques.',
          'Los recargos por método de pago y el envío original no son reembolsables, salvo que el producto haya llegado dañado o incorrecto.',
        ],
      },
      {
        heading: 'Pedidos contra entrega',
        body: [
          'Si eliges contra entrega, te pedimos estar disponible para recibir el pedido. Los pedidos rechazados sin motivo generan costos de envío y retorno que afectan a todos nuestros clientes.',
        ],
      },
    ],
  },
  {
    slug: 'privacidad',
    title: 'Política de privacidad',
    updated: 'Octubre 2026',
    sections: [
      {
        heading: 'Qué datos recopilamos',
        body: [
          'Nombre, apellido, celular, dirección de entrega y, si nos los das, email y cédula. Solo pedimos lo necesario para entregarte tu pedido.',
          'No guardamos datos de tarjetas: los pagos con tarjeta los procesa directamente Payphone.',
        ],
      },
      {
        heading: 'Para qué los usamos',
        body: [
          'Para procesar y entregar tu pedido, coordinar la entrega con la transportadora, contactarte por WhatsApp sobre tu compra y, si dejas un pedido a medias, recordarte que puedes terminarlo.',
          'Usamos herramientas de medición de publicidad (como el píxel de Meta) para saber qué anuncios funcionan. Estas herramientas no reciben tus datos de pago.',
        ],
      },
      {
        heading: 'Con quién los compartimos',
        body: [
          'Solo con quienes participan en tu compra: la plataforma logística y la transportadora que entrega tu pedido, y la pasarela de pago. No vendemos tus datos.',
        ],
      },
      {
        heading: 'Tus derechos',
        body: [
          'Conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador, puedes pedir acceso, corrección o eliminación de tus datos escribiéndonos por WhatsApp o al email de contacto.',
        ],
      },
    ],
  },
  {
    slug: 'terminos',
    title: 'Términos y condiciones',
    updated: 'Octubre 2026',
    sections: [
      {
        heading: 'Sobre Kova',
        body: [
          'Kova es una tienda en línea que vende productos con entrega en Ecuador. Al hacer un pedido aceptas estos términos.',
        ],
      },
      {
        heading: 'Precios y pagos',
        body: [
          'Los precios están en dólares estadounidenses (USD). El precio final, incluidos envío y recargos por método de pago, se muestra en el checkout antes de confirmar.',
          'Los pagos contra entrega y por transferencia tienen un recargo que cubre su costo operativo. El pago con tarjeta no tiene recargo.',
        ],
      },
      {
        heading: 'Disponibilidad',
        body: [
          'Todos los pedidos están sujetos a disponibilidad. Si un producto se agota después de tu compra, te contactamos para ofrecerte un cambio o la devolución total de tu dinero.',
        ],
      },
      {
        heading: 'Imágenes y descripciones',
        body: [
          'Hacemos lo posible para que las fotos y descripciones sean fieles al producto. Pueden existir pequeñas variaciones de color o empaque.',
        ],
      },
      {
        heading: 'Contacto',
        body: ['Para cualquier consulta escríbenos por WhatsApp o al email de contacto publicado en esta página.'],
      },
    ],
  },
]

export const policyLinks = policies.map((p) => ({ label: p.title, to: `/politicas/${p.slug}` }))

export const policyCopy = {
  eyebrow: 'Políticas',
  updated: (date: string) => `Actualizado: ${date}`,
  toc: 'En esta página',
  others: 'Otras políticas',
  notFoundTitle: 'No encontramos esta política',
  notFoundText: 'Puede que el enlace esté mal escrito. Elige una de la lista.',
  help: '¿Te quedó alguna duda? Escríbenos por WhatsApp',
  whatsappMessage: (title: string) => `Hola Kova, tengo una pregunta sobre: ${title}`,
}
