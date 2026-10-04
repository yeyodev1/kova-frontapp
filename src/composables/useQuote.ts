import { ref, watch, type Ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { storeService } from '@/services/store.service'
import type { ApiError, OrderItem, PaymentMethod, Quote } from '@/types'

/**
 * Cotización del carrito contra el backend: el único que conoce precios,
 * recargos y envío reales. Se recalcula al cambiar el carrito o el método.
 */
export function useQuote(method: Ref<PaymentMethod>, enabled: Ref<boolean> = ref(true)) {
  const cart = useCartStore()
  const quote = ref<Quote | null>(null)
  const loading = ref(false)
  const error = ref('')
  let requestId = 0
  let timer: ReturnType<typeof setTimeout> | undefined

  async function refresh() {
    if (!enabled.value) return
    if (cart.isEmpty) {
      quote.value = null
      return
    }
    const id = ++requestId
    loading.value = true
    error.value = ''
    try {
      const data = await storeService.quote(cart.lines, method.value)
      // Si el usuario cambió algo mientras esperábamos, gana la última respuesta.
      if (id === requestId) quote.value = data
    } catch (e) {
      if (id === requestId) error.value = (e as ApiError).message
    } finally {
      if (id === requestId) loading.value = false
    }
  }

  // Debounce corto: los +/- de cantidad no disparan una petición por clic.
  function schedule() {
    clearTimeout(timer)
    timer = setTimeout(refresh, 250)
  }

  watch(() => cart.lines, schedule, { deep: true })
  watch(method, refresh)
  watch(enabled, (on) => on && refresh(), { immediate: true })

  /** Línea cotizada que corresponde a una línea del carrito. */
  function itemFor(productId: string, variantId: string | null): OrderItem | undefined {
    return quote.value?.items.find(
      (item) => item.product === productId && (item.variantId || null) === (variantId || null),
    )
  }

  return { quote, loading, error, refresh, itemFor }
}
