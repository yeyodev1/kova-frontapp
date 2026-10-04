# Kova — sistema visual "vitrina de aluminio"

**Sujeto:** gadgets y productos útiles para la casa, el carro y la rutina, vendidos en Ecuador.
**Usuario:** llega desde un anuncio de Meta o TikTok, en el celular, con poca paciencia.
**Trabajo de cada página:** que compre con confianza. Todo lo demás es secundario.

## Idea

El logo es una K de aluminio cepillado sobre verde salvia. Lo llevamos a toda la tienda: los productos se
exhiben como objetos en una vitrina de diseño, sobre **peanas de aluminio** (`@include plinth`), y un
**destello metálico** (`@include glint`) cruza la peana o el botón de compra en momentos puntuales.
Ese destello es la firma: se usa con moderación (entrada del hero, hover/tap de tarjeta, CTA de compra).

## Tokens (ya están en `src/styles/`)

| Rol | Token | Uso |
|---|---|---|
| Fondo | `$paper` #EDF1EC | niebla salvia, fondo de página |
| Superficie | `$surface` #FFF | tarjetas, formularios |
| Marca | `$accent` #4A6E58 | textos de marca, estados activos, links |
| Musgo | `$accent-deep` #1F3329 / `@include moss` | secciones oscuras, footer, hero alterno |
| Aluminio | `$alu-light` `$alu` `$alu-dark` | peanas, bordes metálicos (`@include alu-border`) |
| Cobre | `$cta` #D1622F | **solo** acciones de compra: comprar, agregar, confirmar pedido. Nunca decorativo |
| Texto | `$ink` `$ink-soft` `$ink-muted` | grafito |

**Tipografía**
- Display `Archivo` expandida (`@include display($size, $weight, $width)`), pesos 700-850. Titulares cortos, en
  minúscula de oración. La anchura es la personalidad: no la uses en párrafos.
- Cuerpo `Hanken Grotesk`.
- Utilitaria `JetBrains Mono` (`@include eyebrow` o `$font-mono`) para etiquetas reales: stock ("QUEDAN 7"),
  número de pedido, conteo de vendidos, nombre de sección. Nada de numeraciones decorativas (01/02/03) salvo en
  pasos que de verdad son una secuencia (cómo comprar, línea de tiempo del pedido).
- Precios: `@include price($size)` (Archivo con cifras tabulares).

**Forma:** radios 14-24px, sombras suaves y frías (`$shadow-*`), bordes `$line` de 1px.
**Layout:** mobile first a 360px; solo flexbox (`flex-cards`); nada de `display: grid`.

## Movimiento

- `v-reveal` (directiva global) en bloques y tarjetas al hacer scroll; `v-reveal="i * 70"` para escalonar (máx ~6).
- Clases globales: `.page-*` (transición de rutas), `.slide-right-*` (drawer), `.slide-up-*` (barras/hojas inferiores),
  keyframes `glint`, `pop`, `rise`, `line-up`.
- Easing `$ease-out`, rebote `$ease-spring`, duraciones `$dur-fast` `$dur` `$dur-slow`.
- Solo `transform` y `opacity` (60fps). Todo respeta `prefers-reduced-motion` (las utilidades globales ya lo hacen;
  en animaciones propias usa `@include reduced-motion`).
- Un momento orquestado pesa más que diez efectos sueltos: hero con stagger + destello; el resto, sobrio.

## Copy

Español de Ecuador, tuteo, verbos concretos. Botones dicen lo que pasa ("Comprar ahora", "Confirmar pedido",
"Agregar al carrito"). Nada de prueba social inventada: solo `soldCount`, stock real y garantías verdaderas.
Errores dicen qué pasó y cómo arreglarlo. Todo el copy en `src/config/site.ts`.
