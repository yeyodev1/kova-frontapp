/**
 * Meta de producto para la vista previa al compartir.
 *
 * Los robots de WhatsApp, Facebook/Instagram y TikTok no ejecutan JavaScript:
 * leen el <head> tal como llega. `middleware.ts` usa esta función para escribir
 * en el index.html los datos del producto antes de entregarlo.
 *
 * Es una función pura y sin dependencias para poder probarla con
 * `node --experimental-strip-types seo/injectMeta.test.ts`.
 */

export const SITE_URL = 'https://kovashopper.com'
export const SITE_NAME = 'Kova'
export const DEFAULT_IMAGE = `${SITE_URL}/og.jpg`
const DESCRIPTION_MAX = 160

/** Lo que el middleware necesita del producto público (`GET /api/products/:slug`). */
export interface MetaProduct {
  _id: string
  slug: string
  title: string
  shortDescription?: string
  description?: string
  images?: string[]
  /** En centavos. */
  price: number
  stock?: number
  variants?: { price?: number; stock?: number; sku?: string }[]
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Texto plano de una línea: sin etiquetas ni saltos, recortado en palabra completa. */
export function plainText(value: string, max = DESCRIPTION_MAX): string {
  const text = value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:]+$/, '')}…`
}

/**
 * Imagen para compartir. Si es de Cloudinary se pide en 1200x630 con relleno
 * blanco (la foto completa, sin recortar el producto) y en JPG, que WhatsApp
 * muestra siempre; WebP/AVIF a veces no.
 */
export function shareImage(images: string[] | undefined): {
  url: string
  width?: number
  height?: number
} {
  const first = (images || []).find((src) => /^https:\/\//i.test(src))
  if (!first) return { url: DEFAULT_IMAGE, width: 1200, height: 630 }
  const cloudinary = first.match(/^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/i)
  if (cloudinary) {
    return {
      url: `${cloudinary[1]}c_pad,b_white,w_1200,h_630,f_jpg,q_auto/${cloudinary[2]}`,
      width: 1200,
      height: 630,
    }
  }
  return { url: first }
}

/** Precio a mostrar en dólares; un producto con variantes sin precio base usa la más barata. */
export function priceCents(product: MetaProduct): number {
  if (product.price > 0) return product.price
  const prices = (product.variants || []).map((v) => v.price || 0).filter((p) => p > 0)
  return prices.length ? Math.min(...prices) : 0
}

export function inStock(product: MetaProduct): boolean {
  if (product.variants && product.variants.length) {
    return product.variants.some((v) => (v.stock || 0) > 0)
  }
  return (product.stock || 0) > 0
}

const OVERRIDDEN = [
  'description',
  'og:type',
  'og:title',
  'og:description',
  'og:url',
  'og:image',
  'og:image:alt',
  'og:image:width',
  'og:image:height',
  'twitter:card',
  'twitter:title',
  'twitter:description',
  'twitter:image',
]

/** Devuelve el index.html con el <head> del producto. */
export function injectMeta(html: string, product: MetaProduct): string {
  const url = `${SITE_URL}/producto/${encodeURIComponent(product.slug)}`
  const cents = priceCents(product)
  const amount = (cents / 100).toFixed(2)
  const priceLabel = cents > 0 ? ` — $${amount}` : ''
  const description = plainText(
    product.shortDescription || product.description || `${product.title} en ${SITE_NAME}.`,
  )
  const image = shareImage(product.images)
  const available = inStock(product)
  const sku = product.variants?.find((v) => v.sku)?.sku || product._id

  const e = escapeHtml
  const pageTitle = `${product.title}${priceLabel} | ${SITE_NAME}`
  const shareTitle = `${product.title}${priceLabel}`

  const tags = [
    `<title>${e(pageTitle)}</title>`,
    `<meta name="description" content="${e(description)}" />`,
    `<link rel="canonical" href="${e(url)}" />`,
    `<meta property="og:type" content="product" />`,
    `<meta property="og:title" content="${e(shareTitle)}" />`,
    `<meta property="og:description" content="${e(description)}" />`,
    `<meta property="og:url" content="${e(url)}" />`,
    `<meta property="og:image" content="${e(image.url)}" />`,
    `<meta property="og:image:alt" content="${e(product.title)}" />`,
  ]
  if (image.width && image.height) {
    tags.push(
      `<meta property="og:image:width" content="${image.width}" />`,
      `<meta property="og:image:height" content="${image.height}" />`,
    )
  }
  if (cents > 0) {
    tags.push(
      `<meta property="product:price:amount" content="${amount}" />`,
      `<meta property="product:price:currency" content="USD" />`,
    )
  }
  tags.push(
    `<meta property="product:availability" content="${available ? 'in stock' : 'out of stock'}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${e(shareTitle)}" />`,
    `<meta name="twitter:description" content="${e(description)}" />`,
    `<meta name="twitter:image" content="${e(image.url)}" />`,
  )

  const photos = (product.images || []).filter((src) => /^https:\/\//i.test(src)).slice(0, 5)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: photos.length ? photos : [image.url],
    description,
    sku,
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      url,
      price: amount,
      priceCurrency: 'USD',
      availability: available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }
  // "<" escapado: un texto con "</script>" no puede cerrar el bloque.
  const ld = JSON.stringify(jsonLd).replace(/</g, '\\u003c')
  tags.push(`<script type="application/ld+json">${ld}</script>`)

  const cleaned = html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<meta\s+(?:name|property)="([^"]+)"[^>]*>\s*/gi, (tag, key: string) =>
      OVERRIDDEN.includes(key) ? '' : tag,
    )

  return cleaned.replace(/<\/head>/i, `    ${tags.join('\n    ')}\n  </head>`)
}
