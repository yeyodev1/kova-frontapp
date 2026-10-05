/**
 * Meta Pixel. El ID es público por diseño (va en el HTML de todas las tiendas),
 * por eso puede vivir en VITE_META_PIXEL_ID. Sin ID, track() no hace nada.
 */
type Fbq = ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] }

declare global {
  interface Window {
    fbq?: Fbq
    _fbq?: Fbq
  }
}

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || ''

export function initPixel(): void {
  if (!PIXEL_ID || window.fbq) return
  const fbq: Fbq = function (...args: unknown[]) {
    if (fbq.callMethod) (fbq.callMethod as (...a: unknown[]) => void)(...args)
    else fbq.queue!.push(args)
  }
  fbq.queue = []
  window.fbq = fbq
  window._fbq = fbq
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)
  fbq('init', PIXEL_ID)
}

/** eventID: el mismo id que manda el servidor por la API de Conversiones, para no contar doble. */
export function track(event: string, data?: Record<string, unknown>, eventID?: string): void {
  if (!PIXEL_ID || !window.fbq) return
  if (eventID) window.fbq('track', event, data, { eventID })
  else window.fbq('track', event, data)
}

function cookie(name: string): string {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1] ?? '') : ''
}

/**
 * Cookies del píxel y la página de origen: el backend las reenvía a Meta con la compra
 * para que la atribuya al clic del anuncio aunque el navegador bloquee el píxel.
 */
export function pixelTracking(): { fbp: string; fbc: string; sourceUrl: string } {
  return { fbp: cookie('_fbp'), fbc: cookie('_fbc'), sourceUrl: window.location.href }
}

export function pageView(): void {
  track('PageView')
}
