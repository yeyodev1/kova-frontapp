import { onBeforeUnmount, watch, type Ref } from 'vue'

/** Cierra un menú flotante al tocar fuera de `root` o al pulsar Escape. */
export function useDismiss(open: Ref<boolean>, root: Ref<HTMLElement | null>) {
  function onOutside(event: PointerEvent) {
    if (root.value && !root.value.contains(event.target as Node)) open.value = false
  }

  function onKey(event: KeyboardEvent) {
    if (event.key === 'Escape') open.value = false
  }

  function detach() {
    document.removeEventListener('pointerdown', onOutside)
    document.removeEventListener('keydown', onKey)
  }

  // Los listeners viven solo mientras el menú está abierto.
  watch(open, (value) => {
    if (!value) return detach()
    document.addEventListener('pointerdown', onOutside)
    document.addEventListener('keydown', onKey)
  })

  onBeforeUnmount(detach)
}
