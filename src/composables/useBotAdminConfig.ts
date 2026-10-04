import { ref, shallowRef } from 'vue'
import { botService } from '@/services/bot.service'
import { botAdminCopy } from '@/config/site'
import { useToastStore } from '@/stores/toast'
import { errorMessage } from '@/composables/admin/format'
import { normalizeConfig } from './useBotAdminShape'
import type { BotConfig } from '@/types'

// La configuración no cambia mientras el panel está abierto: se pide una vez por visita.
const config = shallowRef<BotConfig | null>(null)
const loading = ref(false)
const error = ref('')

/** Configuración del bot para armar BuilderBot Cloud: endpoints, flujos y rules. */
export function useBotAdminConfig() {
  const toast = useToastStore()

  async function load(force = false) {
    if (config.value && !force) return
    loading.value = true
    error.value = ''
    try {
      config.value = normalizeConfig(await botService.config())
    } catch (e) {
      error.value = errorMessage(e, botAdminCopy.loadError)
    } finally {
      loading.value = false
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(botAdminCopy.config.copied)
    } catch {
      toast.error(text)
    }
  }

  return { config, loading, error, load, copy }
}
