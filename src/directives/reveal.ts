import type { Directive } from 'vue'

/**
 * v-reveal: el elemento entra con fade + subida cuando aparece en pantalla.
 * v-reveal="120" agrega 120ms de retraso (para escalonar tarjetas).
 * Un solo IntersectionObserver para toda la app; cada elemento se observa
 * una vez y se libera al revelarse.
 */
let observer: IntersectionObserver | null = null

function getObserver(): IntersectionObserver {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-visible')
        observer?.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  )
  return observer
}

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    if (prefersReduced() || !('IntersectionObserver' in window)) return
    el.classList.add('reveal')
    if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)
    getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}

declare module 'vue' {
  interface GlobalDirectives {
    vReveal: typeof vReveal
  }
}
