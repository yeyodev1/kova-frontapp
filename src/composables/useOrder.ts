import { ref } from 'vue'
import { storeService } from '@/services/store.service'
import type { ApiError, Order } from '@/types'

/** Consulta pública de un pedido (número + celular). */
export function useOrder() {
  const order = ref<Order | null>(null)
  const loading = ref(false)
  const error = ref('')

  async function fetch(number: string, phone: string) {
    loading.value = true
    error.value = ''
    try {
      order.value = await storeService.track(number.trim().toUpperCase(), phone)
    } catch (e) {
      order.value = null
      error.value = (e as ApiError).message
    } finally {
      loading.value = false
    }
  }

  return { order, loading, error, fetch }
}
