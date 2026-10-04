const KEY = 'kova_utm'
const TRACKED = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'ttclid']

/**
 * Guarda los UTM de la URL de entrada (la del anuncio) para mandarlos con el
 * pedido aunque el cliente navegue varias páginas antes de comprar.
 * Solo sobreescribe si la URL trae parámetros nuevos.
 */
export function captureUtm(search = window.location.search): void {
  const params = new URLSearchParams(search)
  const found: Record<string, string> = {}
  for (const key of TRACKED) {
    const value = params.get(key)
    if (value) found[key] = value.slice(0, 200)
  }
  if (!Object.keys(found).length) return
  try {
    sessionStorage.setItem(KEY, JSON.stringify(found))
  } catch {
    /* modo privado */
  }
}

export function getUtm(): Record<string, string> | undefined {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Record<string, string>) : undefined
  } catch {
    return undefined
  }
}
