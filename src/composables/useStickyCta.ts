import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

/**
 * La barra de compra fija aparece solo cuando el CTA principal ya quedó
 * arriba (el usuario lo pasó haciendo scroll), no mientras aún no lo ve.
 */
export function useStickyCta(target: Ref<HTMLElement | null>) {
  const visible = ref(false)
  let observer: IntersectionObserver | null = null

  function stop() {
    observer?.disconnect()
    observer = null
  }

  watch(
    target,
    (el) => {
      stop()
      visible.value = false
      if (!el || typeof IntersectionObserver === 'undefined') return
      observer = new IntersectionObserver(([entry]) => {
        if (!entry) return
        visible.value = !entry.isIntersecting && entry.boundingClientRect.top < 0
      })
      observer.observe(el)
    },
    { immediate: true, flush: 'post' },
  )

  onBeforeUnmount(stop)

  return { visible }
}
