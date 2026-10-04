import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { botService } from '@/services/bot.service'
import { botAdminCopy } from '@/config/site'
import { errorMessage } from '@/composables/admin/format'
import type { BotEvent } from '@/types'

const POLL_MS = 15000

const time = new Intl.DateTimeFormat('es-EC', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
const day = new Intl.DateTimeFormat('es-EC', { day: 'numeric', month: 'short' })

/** "14:32:05" si es de hoy; "3 oct · 14:32:05" si no. */
export function formatEventTime(value: string): string {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const sameDay = d.toDateString() === new Date().toDateString()
  return sameDay ? time.format(d) : `${day.format(d)} · ${time.format(d)}`
}

/**
 * Bitácora del bot en vivo: se refresca cada 15 s mientras la pestaña está visible
 * y el panel abierto. Al ocultar la pestaña se pausa para no gastar consultas.
 */
export function useBotAdminEvents() {
  const items = shallowRef<BotEvent[]>([])
  const page = ref(1)
  const pages = ref(1)
  const total = ref(0)
  const phone = ref('')
  const onlyErrors = ref(false)
  const live = ref(true)
  const loading = ref(false)
  const error = ref('')
  const syncedAt = ref<Date | null>(null)
  let timer: ReturnType<typeof setInterval> | undefined
  let filterTimer: ReturnType<typeof setTimeout> | undefined
  let requestId = 0

  async function load(target = page.value, silent = false) {
    const id = ++requestId
    if (!silent) loading.value = true
    try {
      const data = await botService.events({ phone: phone.value.trim(), page: target, errors: onlyErrors.value })
      if (id !== requestId) return
      items.value = data.items
      page.value = data.page
      pages.value = data.pages
      total.value = data.total
      syncedAt.value = new Date()
      error.value = ''
    } catch (e) {
      if (id === requestId) error.value = errorMessage(e, botAdminCopy.loadError)
    } finally {
      if (id === requestId) loading.value = false
    }
  }

  function stop() {
    if (timer) clearInterval(timer)
    timer = undefined
  }

  function start() {
    stop()
    if (!live.value || document.visibilityState !== 'visible') return
    timer = setInterval(() => load(page.value, true), POLL_MS)
  }

  // Al volver a la pestaña se trae lo nuevo de inmediato, sin esperar el siguiente ciclo.
  function onVisibility() {
    if (document.visibilityState === 'visible' && live.value) load(page.value, true)
    start()
  }

  watch(live, (on) => {
    if (on) load(page.value, true)
    start()
  })
  watch(onlyErrors, () => load(1))
  watch(phone, () => {
    clearTimeout(filterTimer)
    filterTimer = setTimeout(() => load(1), 400)
  })

  onMounted(() => {
    load(1)
    start()
    document.addEventListener('visibilitychange', onVisibility)
  })
  onBeforeUnmount(() => {
    stop()
    clearTimeout(filterTimer)
    document.removeEventListener('visibilitychange', onVisibility)
  })

  return { items, page, pages, total, phone, onlyErrors, live, loading, error, syncedAt, load }
}
