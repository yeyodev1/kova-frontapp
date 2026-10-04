import type { BotChatSystemKind } from '@/services/bot.service'

/*
 * Copy del chat del bot. Vive aquí y no en site.ts mientras ese archivo está en
 * edición por otro frente; el resto (paso, carrito, acciones) reutiliza botAdminCopy.
 */
export const botChatCopy = {
  title: 'Conversación',
  back: 'Volver al bot',
  open: 'Ver conversación',
  decisions: 'Mostrar decisiones del bot',
  live: 'En vivo',
  paused: 'En pausa',
  updated: (when: string) => `actualizado ${when}`,
  older: 'Cargar anteriores',
  newMessages: (n: number) => (n === 1 ? '1 mensaje nuevo' : `${n} mensajes nuevos`),
  emptyTitle: 'Sin mensajes',
  emptyText: 'Esta conversación no tiene mensajes en los últimos 30 días.',
  notFound: 'No hay conversación con ese número',
  expired: 'La sesión ya expiró: se muestra solo la bitácora.',
  noSession: 'Sin sesión activa',
  fromHistory: 'Del historial',
  file: 'Archivo adjunto',
  openFile: 'Abrir archivo en otra pestaña',
  today: 'Hoy',
  yesterday: 'Ayer',
  brain: 'brain',
  noReply: '(sin texto)',
  paymentLink: 'Abrir link de pago',
}

/** Icono Font Awesome de cada aviso de sistema. */
export const systemIcons: Record<BotChatSystemKind, string> = {
  order_created: 'fa-solid fa-receipt',
  payment_link: 'fa-solid fa-link',
  receipt: 'fa-solid fa-file-invoice-dollar',
  payment_confirmed: 'fa-solid fa-circle-check',
  human_request: 'fa-solid fa-headset',
  silenced: 'fa-solid fa-volume-xmark',
  duplicated: 'fa-solid fa-clone',
  error: 'fa-solid fa-triangle-exclamation',
}

/** Icono del flujo que respondió, para la franja de decisión. */
export function endpointIcon(endpoint: string): string {
  const icons: Record<string, string> = {
    brain: 'fa-solid fa-brain',
    conversation: 'fa-solid fa-comments',
    catalog: 'fa-solid fa-book-open',
    checkout: 'fa-solid fa-credit-card',
    human: 'fa-solid fa-headset',
    'search-order': 'fa-solid fa-magnifying-glass',
    media: 'fa-solid fa-image',
    'transfer-receipt': 'fa-solid fa-file-invoice-dollar',
  }
  return icons[endpoint.replace(/^\//, '')] || 'fa-solid fa-robot'
}
