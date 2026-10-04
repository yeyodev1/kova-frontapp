/**
 * Routing Middleware de Vercel (sirve para cualquier framework, no solo Next).
 *
 * Los robots de WhatsApp, Facebook/Instagram y TikTok no ejecutan JavaScript,
 * así que al compartir /producto/:slug solo verían las metas de la marca. Acá se
 * entrega el mismo index.html del deployment con el <head> del producto: foto,
 * nombre, precio y descripción. Corre para todas las peticiones, no solo bots,
 * para no depender de adivinar user agents; el navegador recibe la misma SPA.
 *
 * Ante cualquier falla (API caída, lenta o producto inexistente) se deja pasar
 * la petición: el rewrite SPA de vercel.json sirve el index de siempre.
 */
// Con extensión .js: en el runtime Node la middleware se carga como ESM sin empaquetar.
import { injectMeta, type MetaProduct } from './seo/injectMeta.js'

export const config = {
  matcher: '/producto/:path*',
}

const API_URL = 'https://api.kovashopper.com/api'
const API_TIMEOUT_MS = 1500

/** Lo mismo que `next()` de `@vercel/functions`, sin agregar la dependencia. */
function passThrough(): Response {
  return new Response(null, { headers: { 'x-middleware-next': '1' } })
}

async function fetchProduct(slug: string): Promise<MetaProduct | null> {
  const res = await fetch(`${API_URL}/products/${encodeURIComponent(slug)}`, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  })
  if (!res.ok) return null
  const data = (await res.json()) as MetaProduct
  return data && data.slug && data.title ? data : null
}

async function fetchIndex(request: Request): Promise<string | null> {
  // /index.html no entra en el matcher: esta petición no vuelve a pasar por acá.
  // Cookie y bypass van para que funcione también en previews con protección.
  const headers: Record<string, string> = {}
  for (const name of ['cookie', 'x-vercel-protection-bypass']) {
    const value = request.headers.get(name)
    if (value) headers[name] = value
  }
  const res = await fetch(new URL('/index.html', request.url), {
    headers,
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  })
  if (!res.ok) return null
  const html = await res.text()
  // Con protección de Vercel llega su página de login con 200: solo se toca el index de la SPA.
  return html.includes('<div id="app">') ? html : null
}

export default async function middleware(request: Request): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') return passThrough()

  const { pathname } = new URL(request.url)
  const match = pathname.match(/^\/producto\/([^/]+)\/?$/)
  if (!match) return passThrough()

  let slug: string
  try {
    slug = decodeURIComponent(match[1]).toLowerCase()
  } catch {
    return passThrough()
  }

  try {
    const [product, html] = await Promise.all([fetchProduct(slug), fetchIndex(request)])
    if (!product || !html) return passThrough()

    return new Response(request.method === 'HEAD' ? null : injectMeta(html, product), {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, s-maxage=300, stale-while-revalidate=600',
        'referrer-policy': 'origin-when-cross-origin',
        'x-kova-meta': 'product',
      },
    })
  } catch (error) {
    console.error('[middleware] meta de producto:', slug, error)
    return passThrough()
  }
}
