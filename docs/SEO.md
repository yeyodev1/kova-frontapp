# SEO y vista previa al compartir

Los robots de WhatsApp, Facebook/Instagram y TikTok no ejecutan JavaScript: leen el `<head>`
del HTML que reciben. Como esto es una SPA, sin ayuda todos los links mostrarían la tarjeta
de la marca.

## `/producto/:slug` — Routing Middleware

- `middleware.ts` (raíz) es una Routing Middleware de Vercel: funciona con cualquier
  framework, sin dependencias (`next()` se reemplaza por la cabecera `x-middleware-next`).
  `config.matcher = '/producto/:path*'`, así que el resto del sitio no la toca.
- Corre en todas las peticiones de producto, no solo de bots. Pide en paralelo
  `GET https://api.kovashopper.com/api/products/<slug>` (timeout 1,5 s) y el `/index.html`
  del mismo deployment, y devuelve el index con las metas del producto.
- Cache: `public, s-maxage=300, stale-while-revalidate=600`. Un cambio de precio o foto
  tarda hasta 5 minutos en verse en la vista previa (y Facebook guarda su propia copia:
  ver abajo).
- Si el API falla, tarda o el producto no existe/no está publicado, la middleware deja pasar
  la petición y el rewrite SPA de `vercel.json` sirve el index de siempre.
- El navegador recibe el mismo index (mismos `/assets/*`): la SPA arranca igual que siempre
  y `useProduct` vuelve a poner `document.title`.

### Qué se inyecta (`seo/injectMeta.ts`, función pura)

`<title>`, `description`, `canonical`, `og:type=product`, `og:title` (nombre — precio),
`og:description` (`shortDescription`, una línea, máx. 160), `og:url`, `og:image` (+ ancho/alto
y alt), `product:price:amount/currency=USD`, `product:availability`, `twitter:*` con
`summary_large_image` y JSON-LD `schema.org/Product` con `Offer`.

- Imagen: la primera `https://`. Si es de Cloudinary se pide como
  `c_pad,b_white,w_1200,h_630,f_jpg,q_auto` (foto completa, sin recorte, en JPG que WhatsApp
  siempre muestra). Si no hay imagen https se usa `/og.jpg`.
- Todo el texto pasa por `escapeHtml`; el JSON-LD escapa `<` para que nada cierre el `<script>`.
- Prueba: `node --experimental-strip-types seo/injectMeta.test.ts`.

## Resto del sitio

- `index.html` trae las metas de la marca; `public/og.jpg` (1200x630) es la imagen por defecto.
  Se generó desde `public/logo.jpg` con `sips` (logo a 540 px, relleno `#1f3329`).
- `public/robots.txt` bloquea `/admin`, `/checkout`, `/pedido/`, `/pago/` y apunta al sitemap.
- `/sitemap.xml` es un rewrite (en `vercel.json`, antes del rewrite SPA) a
  `https://api.kovashopper.com/api/seo/sitemap.xml`, que lista las páginas fijas y los
  productos publicados.

## Verificar en producción

```sh
curl -s -A "facebookexternalhit/1.1" https://kovashopper.com/producto/<slug> | grep -E 'og:|<title>'
curl -sI https://kovashopper.com/producto/<slug> | grep -i x-kova-meta   # "product" si se inyectó
curl -s https://kovashopper.com/sitemap.xml | head
```

- Facebook / Instagram / WhatsApp: <https://developers.facebook.com/tools/debug/> → pegar el
  link → "Scrape Again" para forzar a Meta a releer (WhatsApp usa la misma caché de Meta en
  muchos casos; un link ya compartido en un chat puede seguir mostrando la vista vieja).
- Datos estructurados: <https://search.google.com/test/rich-results>.
