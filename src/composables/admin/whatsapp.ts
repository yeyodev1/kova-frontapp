/**
 * Celular ecuatoriano a formato internacional para wa.me:
 * 0991234567 → 593991234567; +593 99... se respeta.
 */
export function toWhatsappNumber(phone: string): string {
  const digits = (phone || '').replace(/\D/g, '')
  if (digits.startsWith('593')) return digits
  if (digits.startsWith('09')) return `593${digits.slice(1)}`
  if (digits.startsWith('9') && digits.length === 9) return `593${digits}`
  return digits
}

export function waLink(phone: string, message: string): string {
  return `https://wa.me/${toWhatsappNumber(phone)}?text=${encodeURIComponent(message)}`
}

export function telLink(phone: string): string {
  return `tel:${(phone || '').replace(/[^\d+]/g, '')}`
}
