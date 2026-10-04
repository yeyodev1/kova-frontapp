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

export function track(event: string, data?: Record<string, unknown>): void {
  if (!PIXEL_ID || !window.fbq) return
  window.fbq('track', event, data)
}

export function pageView(): void {
  track('PageView')
}
