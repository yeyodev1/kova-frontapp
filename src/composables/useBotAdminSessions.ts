import { computed, ref, shallowRef } from 'vue'
import { botService } from '@/services/bot.service'
import { botAdminCopy } from '@/config/site'
import { useToastStore } from '@/stores/toast'
import { errorMessage } from '@/composables/admin/format'
import { normalizeSession } from './useBotAdminShape'
import type { BotSession } from '@/types'

export type BotSessionAction = 'reset' | 'silence' | 'unsilence'

// Estado de módulo: al cambiar de pestaña y volver no se pierde la lista ni la búsqueda.
const items = shallowRef<BotSession[]>([])
const page = ref(1)
const pages = ref(1)
const total = ref(0)
const q = ref('')
const loading = ref(false)
const error = ref('')
const busy = ref('')
let searchTimer: ReturnType<typeof setTimeout> | undefined
let requestId = 0

export function isSilenced(session: BotSession, now = Date.now()): boolean {
  return !!session.silencedUntil && new Date(session.silencedUntil).getTime() > now
}

/** Conversaciones del bot: lista paginada y acciones de soporte (silenciar, reiniciar). */
export function useBotAdminSessions() {
  const toast = useToastStore()

  async function load(target = page.value) {
    const id = ++requestId
    loading.value = true
    error.value = ''
    try {
      const data = await botService.sessions({ page: target, q: q.value.trim() })
      // Una búsqueda más nueva ya está en camino: esta respuesta llega tarde.
      if (id !== requestId) return
      items.value = data.items.map(normalizeSession)
      page.value = data.page
      pages.value = data.pages
      total.value = data.total
    } catch (e) {
      if (id === requestId) error.value = errorMessage(e, botAdminCopy.loadError)
    } finally {
      if (id === requestId) loading.value = false
    }
  }

  function search(value: string) {
    q.value = value
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => load(1), 350)
  }

  async function run(action: BotSessionAction, phone: string) {
    if (busy.value) return
    busy.value = `${action}:${phone}`
    try {
      if (action === 'reset') await botService.reset(phone)
      else if (action === 'silence') await botService.silence(phone, 60)
      else await botService.unsilence(phone)
      toast.success(botAdminCopy.sessions.done[action])
      await load()
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      busy.value = ''
    }
  }

  // El flujo de asesor silencia al bot solo, así que el silencio no indica que alguien ya respondió:
  // cuenta todo "Pidió asesor" hasta que se reinicie la conversación.
  const humanPending = computed(() => items.value.filter((s) => s.humanRequested).length)

  return { items, page, pages, total, q, loading, error, busy, humanPending, load, search, run }
}
