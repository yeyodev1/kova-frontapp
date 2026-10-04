const usd = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

/** El API maneja centavos enteros; esto los pinta como dólares. */
export function formatCents(cents: number): string {
  return usd.format((Number(cents) || 0) / 100)
}

/** Para inputs en dólares: 1999 → 19.99 */
export function centsToDollars(cents: number): number {
  return Math.round(Number(cents) || 0) / 100
}

/** Lo que escribe el admin en dólares, de vuelta a centavos sin errores de coma flotante. */
export function dollarsToCents(dollars: number | string): number {
  const value = typeof dollars === 'string' ? parseFloat(dollars.replace(',', '.')) : dollars
  if (!Number.isFinite(value)) return 0
  return Math.round(value * 100)
}
