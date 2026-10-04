const dateTime = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

const shortDay = new Intl.DateTimeFormat('es-EC', { weekday: 'short' })

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '' : dateTime.format(d)
}

/** "2026-10-03" → "vie". Se fuerza mediodía para que la zona horaria no cambie el día. */
export function formatWeekday(isoDate: string): string {
  const d = new Date(isoDate.length <= 10 ? `${isoDate}T12:00:00` : isoDate)
  return Number.isNaN(d.getTime()) ? isoDate : shortDay.format(d).replace('.', '')
}

export function errorMessage(e: unknown, fallback = 'Algo salió mal'): string {
  if (e && typeof e === 'object' && 'message' in e) return String((e as { message: string }).message)
  return fallback
}

export function errorStatus(e: unknown): number {
  if (e && typeof e === 'object' && 'status' in e) return Number((e as { status: number }).status)
  return 0
}
