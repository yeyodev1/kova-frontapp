/**
 * Prueba de la inyección de meta, sin dependencias:
 *   node --experimental-strip-types seo/injectMeta.test.ts
 * (en Node 23.6+ basta `node seo/injectMeta.test.ts`).
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { injectMeta, plainText, shareImage, type MetaProduct } from './injectMeta.ts'

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')

const product: MetaProduct = {
  _id: '66f0c0ffee0000000000abcd',
  slug: 'masajeador-cuello',
  title: 'Masajeador de cuello "Pro" <b>',
  shortDescription:
    'Alivia la tensión del cuello en 10 minutos.\nCalor y 3 intensidades. </script><script>alert(1)</script> Recargable por USB-C, ideal para oficina, viaje y casa, con garantía de 30 días.',
  images: [
    'http://insegura.com/a.jpg',
    'https://res.cloudinary.com/kova/image/upload/v1712/productos/masajeador.webp',
  ],
  price: 2499,
  stock: 0,
  variants: [
    { price: 2499, stock: 0, sku: '' },
    { price: 2999, stock: 4, sku: 'MAS-AZ' },
  ],
}

const out = injectMeta(html, product)

const count = (re: RegExp) => (out.match(re) || []).length

// Un solo título y una sola meta de cada clave: la de marca se reemplaza.
assert.equal(count(/<title>/g), 1)
assert.equal(count(/property="og:title"/g), 1)
assert.equal(count(/property="og:image"/g), 1)
assert.equal(count(/name="description"/g), 1)
assert.equal(count(/name="twitter:card"/g), 1)
assert.ok(
  out.includes('<title>Masajeador de cuello &quot;Pro&quot; &lt;b&gt; — $24.99 | Kova</title>'),
)
assert.ok(out.includes('<meta property="og:type" content="product" />'))
assert.ok(
  out.includes(
    '<meta property="og:url" content="https://kovashopper.com/producto/masajeador-cuello" />',
  ),
)
assert.ok(
  out.includes(
    '<link rel="canonical" href="https://kovashopper.com/producto/masajeador-cuello" />',
  ),
)
assert.ok(
  out.includes(
    'content="https://res.cloudinary.com/kova/image/upload/c_pad,b_white,w_1200,h_630,f_jpg,q_auto/v1712/productos/masajeador.webp"',
  ),
)
assert.ok(out.includes('<meta property="og:image:width" content="1200" />'))
assert.ok(out.includes('<meta property="product:price:amount" content="24.99" />'))
assert.ok(out.includes('<meta property="product:price:currency" content="USD" />'))
assert.ok(out.includes('<meta name="twitter:card" content="summary_large_image" />'))

// Nada del texto del producto abre etiquetas: lo único "<script" es el JSON-LD.
assert.equal(count(/<script type="application\/ld\+json">/g), 1)
assert.ok(!out.includes('<script>alert'))
assert.ok(!out.includes('<b>'))

// JSON-LD válido y con disponibilidad por variantes.
const ld = JSON.parse(out.match(/<script type="application\/ld\+json">(.*?)<\/script>/)![1])
assert.equal(ld['@type'], 'Product')
assert.equal(ld.sku, 'MAS-AZ')
assert.equal(ld.offers.price, '24.99')
assert.equal(ld.offers.priceCurrency, 'USD')
assert.equal(ld.offers.availability, 'https://schema.org/InStock')
assert.deepEqual(ld.image, [product.images![1]])

// Descripción en una línea y de máximo 160 caracteres.
const description = out.match(/<meta name="description" content="([^"]*)"/)![1]
assert.ok(description.length <= 200, 'escapada puede crecer, el texto no')
assert.ok(plainText(product.shortDescription!).length <= 160)
assert.ok(!description.includes('\n'))

// El resto del index sigue igual: fuentes, app y script de Vite.
assert.ok(out.includes('<div id="app"></div>'))
assert.ok(out.includes('fonts.googleapis.com'))
assert.ok(out.includes('<meta name="viewport"'))
assert.ok(out.includes('<meta name="theme-color"'))
assert.ok(out.includes('<meta property="og:site_name" content="Kova" />'))

// Sin imagen https: la de la marca. Imagen ajena a Cloudinary: tal cual, sin medidas.
assert.deepEqual(shareImage([]), {
  url: 'https://kovashopper.com/og.jpg',
  width: 1200,
  height: 630,
})
assert.deepEqual(shareImage(['https://cdn.dropi.co/x.png']), { url: 'https://cdn.dropi.co/x.png' })

// Agotado y sin precio: OutOfStock y sin metas de precio.
const soldOut = injectMeta(html, { ...product, price: 0, variants: [], stock: 0, images: [] })
assert.ok(soldOut.includes('https://schema.org/OutOfStock'))
assert.ok(!soldOut.includes('product:price:amount'))
assert.ok(soldOut.includes('content="https://kovashopper.com/og.jpg"'))

console.log(out.slice(out.indexOf('<title>'), out.indexOf('</head>')))
console.log('\ninjectMeta: todas las pruebas pasaron')
