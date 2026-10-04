import { computed, ref } from 'vue'
import { storeService } from '@/services/store.service'
import type { StoreSettings } from '@/types'

// Estado de módulo: los ajustes se piden una sola vez por carga y los comparte toda la app.
const settings = ref<StoreSettings | null>(null)
let pending: Promise<StoreSettings | null> | null = null

export function useStoreSettings() {
  function load(): Promise<StoreSettings | null> {
    if (!pending) {
      pending = storeService
        .settings()
        .then((data) => (settings.value = data))
        .catch(() => {
          // Sin ajustes la tienda igual funciona; se reintenta en la próxima llamada.
          pending = null
          return null
        })
    }
    return pending
  }

  const announcement = computed(() => settings.value?.announcement?.trim() || '')
  const bankAccounts = computed(() => settings.value?.bankAccounts || [])

  return { settings, load, announcement, bankAccounts }
}
