import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  type Ref,
} from 'vue'
import { botService, type BotChatMessage } from '@/services/bot.service'
import { useToastStore } from '@/stores/toast'
import { errorMessage, errorStatus } from '@/composables/admin/format'
import { botAdminCopy } from '@/config/site'
import { botChatCopy } from '@/components/bot/chat/chatCopy'
import { normalizeSession } from './useBotAdminShape'
import type { BotSessionAction } from './useBotAdminSessions'
import type { BotSession } from '@/types'

const POLL_MS = 8_000
const PAGE = 50
// Margen para considerar que el dueño "ya estaba abajo" (el teclado o la barra inferior lo mueven un poco).
const BOTTOM_SLACK = 140
const SHOW_KEY = 'kova:bot-chat:decisions'

function readShow(): boolean {
  try {
    return localStorage.getItem(SHOW_KEY) !== '0'
  } catch {
    return true
  }
}

// Preferencia de módulo: se mantiene al pasar de una conversación a otra.
const showDecisions = ref(readShow())
watch(showDecisions, (value) => {
  try {
    localStorage.setItem(SHOW_KEY, value ? '1' : '0')
  } catch {
    /* sin almacenamiento: queda solo en memoria */
  }
})

const pageHeight = () => document.documentElement.scrollHeight
const isAtBottom = () => window.innerHeight + window.scrollY >= pageHeight() - BOTTOM_SLACK
const time = (m: BotChatMessage) => new Date(m.at).getTime()

/**
 * Chat de un cliente con el bot, en vivo: refresca cada 8 s mientras la pestaña
 * está visible, agrega solo lo nuevo y baja al final si el dueño ya estaba abajo.
 */
export function useBotConversation(phone: Ref<string>) {
  const toast = useToastStore()
  const messages = shallowRef<BotChatMessage[]>([])
  const session = shallowRef<BotSession | null>(null)
  const loading = ref(false)
  const loadingOlder = ref(false)
  const error = ref('')
  const notFound = ref(false)
  const hasMore = ref(false)
  const nextBefore = ref<string | null>(null)
  const syncedAt = ref<Date | null>(null)
  const unseen = ref(0)
  const busy = ref('')
  let timer: ReturnType<typeof setInterval> | undefined
  let requestId = 0

  function scrollToBottom(smooth = false) {
    nextTick(() => window.scrollTo({ top: pageHeight(), behavior: smooth ? 'smooth' : 'auto' }))
    unseen.value = 0
  }

  /*
   * La página más reciente reemplaza todo lo que cubre: un /brain que estaba solo
   * puede haber recibido su respuesta, y un evento cambia de forma. Lo anterior a
   * esa página (cargado con "anteriores") se conserva.
   */
  function merge(fresh: BotChatMessage[], freshHasMore: boolean) {
    const before = messages.value
    const known = new Set(before.map((m) => m.id))
    const cutoff = fresh[0] ? time(fresh[0]) : Infinity
    const kept = freshHasMore
      ? before.filter((m) => time(m) < cutoff && !fresh.some((f) => f.id === m.id))
      : []
    messages.value = [...kept, ...fresh]
    return fresh.filter((m) => !known.has(m.id)).length
  }

  async function load(silent = false) {
    const id = ++requestId
    const target = phone.value
    if (!silent) loading.value = true
    try {
      const data = await botService.conversation(target, { limit: PAGE })
      if (id !== requestId || target !== phone.value) return
      const first = !messages.value.length
      const stick = first || isAtBottom()
      const added = merge(data.messages, data.hasMore)
      session.value = data.session ? normalizeSession(data.session) : null
      if (first) {
        hasMore.value = data.hasMore
        nextBefore.value = data.nextBefore
      }
      error.value = ''
      notFound.value = false
      syncedAt.value = new Date()
      if (added && stick) scrollToBottom(!first)
      else if (added) unseen.value += added
    } catch (e) {
      if (id !== requestId) return
      notFound.value = errorStatus(e) === 404
      error.value = notFound.value ? botChatCopy.notFound : errorMessage(e, botAdminCopy.loadError)
    } finally {
      if (id === requestId) loading.value = false
    }
  }

  async function loadOlder() {
    if (!nextBefore.value || loadingOlder.value) return
    loadingOlder.value = true
    try {
      const data = await botService.conversation(phone.value, {
        before: nextBefore.value,
        limit: PAGE,
      })
      const known = new Set(messages.value.map((m) => m.id))
      const heightBefore = pageHeight()
      const scrollBefore = window.scrollY
      messages.value = [...data.messages.filter((m) => !known.has(m.id)), ...messages.value]
      hasMore.value = data.hasMore
      nextBefore.value = data.nextBefore
      // Lo que se agrega arriba no debe mover lo que el dueño estaba leyendo.
      await nextTick()
      window.scrollTo({ top: scrollBefore + pageHeight() - heightBefore })
    } catch (e) {
      toast.error(errorMessage(e, botAdminCopy.loadError))
    } finally {
      loadingOlder.value = false
    }
  }

  async function run(action: BotSessionAction) {
    if (busy.value) return
    busy.value = action
    try {
      if (action === 'reset') await botService.reset(phone.value)
      else if (action === 'silence') await botService.silence(phone.value, 60)
      else await botService.unsilence(phone.value)
      toast.success(botAdminCopy.sessions.done[action])
      await load(true)
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      busy.value = ''
    }
  }

  const live = ref(true)

  function stop() {
    clearInterval(timer)
    timer = undefined
  }

  function start() {
    stop()
    if (document.visibilityState !== 'visible') {
      live.value = false
      return
    }
    live.value = true
    timer = setInterval(() => load(true), POLL_MS)
  }

  // Pestaña oculta = sin peticiones; al volver se pone al día de inmediato.
  function onVisibility() {
    if (document.visibilityState === 'visible') {
      load(true)
      start()
    } else {
      stop()
      live.value = false
    }
  }

  function onScroll() {
    if (unseen.value && isAtBottom()) unseen.value = 0
  }

  function reset() {
    messages.value = []
    session.value = null
    hasMore.value = false
    nextBefore.value = null
    unseen.value = 0
    error.value = ''
  }

  watch(phone, () => {
    reset()
    load()
  })

  onMounted(() => {
    load()
    start()
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    stop()
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('scroll', onScroll)
  })

  const empty = computed(() => !loading.value && !error.value && !messages.value.length)

  return {
    messages,
    session,
    loading,
    loadingOlder,
    error,
    notFound,
    hasMore,
    syncedAt,
    unseen,
    busy,
    live,
    empty,
    showDecisions,
    load,
    loadOlder,
    run,
    scrollToBottom,
  }
}
