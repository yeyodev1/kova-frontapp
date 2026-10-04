const money = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export function formatMoney(value: number): string {
  return money.format(value)
}

const date = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export function formatDate(value: string | Date): string {
  return date.format(typeof value === 'string' ? new Date(value) : value)
}

/** Los montos del API vienen en centavos USD: 1990 → "$19,90". */
export function formatCents(cents: number): string {
  return money.format((cents || 0) / 100)
}

/** Porcentaje de ahorro redondeado; 0 si no hay precio tachado válido. */
export function savingsPercent(price: number, compareAt: number): number {
  if (!compareAt || compareAt <= price) return 0
  return Math.round(((compareAt - price) / compareAt) * 100)
}
