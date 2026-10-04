import type { Order, OrderStatus, PaymentMethod } from '@/types'

export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent'

export const statusLabels: Record<OrderStatus, string> = {
  pending_payment: 'Esperando pago',
  awaiting_transfer: 'Esperando transferencia',
  transfer_review: 'Revisar transferencia',
  confirmed: 'Confirmado',
  sent_to_dropi: 'En Dropi',
  shipped: 'Enviado',
  delivered: 'Entregado',
  returned: 'Devuelto',
  cancelled: 'Cancelado',
  failed: 'Fallido',
}

export const statusTones: Record<OrderStatus, Tone> = {
  pending_payment: 'neutral',
  awaiting_transfer: 'warning',
  transfer_review: 'warning',
  confirmed: 'accent',
  sent_to_dropi: 'info',
  shipped: 'info',
  delivered: 'success',
  returned: 'danger',
  cancelled: 'neutral',
  failed: 'danger',
}

export const statusOrder: OrderStatus[] = [
  'transfer_review',
  'awaiting_transfer',
  'confirmed',
  'sent_to_dropi',
  'shipped',
  'delivered',
  'pending_payment',
  'returned',
  'cancelled',
  'failed',
]

export const methodLabels: Record<PaymentMethod, string> = {
  card: 'Tarjeta',
  cod: 'Contra entrega',
  transfer: 'Transferencia',
}

export const methodIcons: Record<PaymentMethod, string> = {
  card: 'fa-solid fa-credit-card',
  cod: 'fa-solid fa-hand-holding-dollar',
  transfer: 'fa-solid fa-building-columns',
}

export const paymentStatusLabels: Record<Order['paymentStatus'], string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  cod: 'Se cobra al entregar',
  failed: 'Fallido',
  refunded: 'Reembolsado',
}

export function statusLabel(status: string): string {
  return statusLabels[status as OrderStatus] ?? status
}

export function statusTone(status: string): Tone {
  return statusTones[status as OrderStatus] ?? 'neutral'
}
