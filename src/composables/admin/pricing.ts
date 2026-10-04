// Espejo de kova-backapp/src/utils/pricing.ts para mostrar el precio antes de importar.
// La fuente de verdad es el backend: si cambia allá, cambia aquí.

/** Redondea centavos al .90 más cercano (24.90, 19.90...). */
export function roundTo90(cents: number): number {
  const rounded = Math.round((cents - 90) / 100) * 100 + 90
  return Math.max(rounded, 90)
}

/** Sugerido si deja margen; si no, costo × (1 + margen) a .90. Nunca por debajo del costo. */
export function salePriceFrom(cost: number, suggested: number, markupPercent: number): number {
  if (cost <= 0 && suggested <= 0) return 0
  let price = suggested > cost ? suggested : cost * (1 + markupPercent / 100)
  price = roundTo90(Math.round(price))
  while (cost > 0 && price <= cost) price += 100
  return price
}
