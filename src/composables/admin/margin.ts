export interface Margin {
  amount: number // centavos
  percent: number // sobre el precio de venta
  known: boolean // sin costo de Dropi no hay margen que mostrar
}

export function marginOf(price: number, cost?: number | null): Margin {
  if (!cost || cost <= 0) return { amount: 0, percent: 0, known: false }
  const amount = price - cost
  const percent = price > 0 ? Math.round((amount / price) * 1000) / 10 : 0
  return { amount, percent, known: true }
}

export function marginTone(m: Margin): 'success' | 'warning' | 'danger' | 'neutral' {
  if (!m.known) return 'neutral'
  if (m.amount <= 0) return 'danger'
  if (m.percent < 25) return 'warning'
  return 'success'
}
