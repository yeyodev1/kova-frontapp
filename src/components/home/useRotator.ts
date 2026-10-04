import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

/**
 * Rotación automática de la vitrina del hero.
 * Se pausa con hover, foco o toque (la persona está mirando) y cuando la
 * pestaña no está visible. Con reduced-motion no avanza sola.
 */
export function useRotator(count: Ref<number>, interval = 4500) {
  const index = ref(0)
  const paused = ref(false)
  let timer: ReturnType<typeof setInterval> | undefined
  let resumeTimer: ReturnType<typeof setTimeout> | undefined

  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function go(i: number) {
    if (!count.value) return
    index.value = (i + count.value) % count.value
    restart()
  }

  const next = () => go(index.value + 1)
  const prev = () => go(index.value - 1)

  function stop() {
    clearInterval(timer)
    timer = undefined
  }

  function restart() {
    stop()
    if (paused.value || count.value < 2 || reduced() || document.hidden) return
    timer = setInterval(() => {
      index.value = (index.value + 1) % count.value
    }, interval)
  }

  function pause() {
    clearTimeout(resumeTimer)
    paused.value = true
    stop()
  }

  function resume(delay = 0) {
    clearTimeout(resumeTimer)
    resumeTimer = setTimeout(() => {
      paused.value = false
      restart()
    }, delay)
  }

  watch(count, (n) => {
    if (index.value >= n) index.value = 0
    restart()
  })

  const onVisibility = () => (document.hidden ? stop() : restart())

  onMounted(() => {
    document.addEventListener('visibilitychange', onVisibility)
    restart()
  })

  onBeforeUnmount(() => {
    stop()
    clearTimeout(resumeTimer)
    document.removeEventListener('visibilitychange', onVisibility)
  })

  return { index, paused, go, next, prev, pause, resume }
}
