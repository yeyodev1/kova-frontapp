import { computed, onBeforeUnmount, ref, shallowRef } from 'vue'
import { storeService } from '@/services/store.service'
import { track } from '@/utils/pixel'
import { payOrderCopy } from '@/config/site'
import type { Order, PayphoneConfig } from '@/types'

export type PayOrderStatus = 'loading' | 'ready' | 'paid' | 'expired' | 'error'

// La Cajita de Payphone deja de aceptar pagos a los 10 minutos de creada.
const BOX_TTL_MS = 10 * 60 * 1000
const TICK_MS = 15 * 1000

// Pedidos ya contados en el Pixel durante esta visita: regenerar la Cajita no duplica eventos.
const tracked = new Set<string>()

function trackCheckout(order: Order) {
  if (tracked.has(order.number)) return
  tracked.add(order.number)
  const data = {
    value: order.total / 100,
    currency: 'USD',
    num_items: order.items.reduce((sum, item) => sum + item.quantity, 0),
    content_ids: order.items.map((item) => item.product),
  }
  track('InitiateCheckout', data)
  track('AddPaymentInfo', { payment_type: 'card', currency: 'USD', value: data.value })
}

/**
 * Estado del link de pago que manda el bot. Cada llamada al API crea un intento
 * nuevo en Payphone, por eso solo se pide al entrar y cuando el cliente toca
 * "Generar nuevo formulario": nunca en bucle ni al volver a la pestaña.
 */
export function usePayOrder(token: string) {
  const status = ref<PayOrderStatus>('loading')
  const order = shallowRef<Order | null>(null)
  const payphone = shallowRef<PayphoneConfig | null>(null)
  const error = ref('')
  const now = ref(Date.now())
  let deadline = 0
  let timer: ReturnType<typeof setInterval> | undefined
  let inflight = false

  const minutesLeft = computed(() => Math.max(0, Math.ceil((deadline - now.value) / 60000)))

  function stopTimer() {
    if (timer) clearInterval(timer)
    timer = undefined
  }

  // Se compara contra la hora real: con la pestaña en segundo plano el intervalo se atrasa.
  function checkExpiry() {
    now.value = Date.now()
    if (status.value === 'ready' && now.value >= deadline) {
      status.value = 'expired'
      stopTimer()
    }
  }

  function startTimer() {
    stopTimer()
    deadline = Date.now() + BOX_TTL_MS
    now.value = Date.now()
    timer = setInterval(checkExpiry, TICK_MS)
  }

  async function load() {
    if (inflight) return
    inflight = true
    status.value = 'loading'
    error.value = ''
    try {
      const data = await storeService.payOrder(token)
      order.value = data.order
      if (data.paid) {
        payphone.value = null
        status.value = 'paid'
        stopTimer()
        return
      }
      if (!data.payphone) throw { message: payOrderCopy.errorFallback }
      payphone.value = data.payphone
      status.value = 'ready'
      startTimer()
      trackCheckout(data.order)
    } catch (e) {
      error.value = (e as { message?: string })?.message || payOrderCopy.errorFallback
      status.value = 'error'
      stopTimer()
    } finally {
      inflight = false
    }
  }

  function onVisible() {
    if (document.visibilityState === 'visible') checkExpiry()
  }

  document.addEventListener('visibilitychange', onVisible)
  onBeforeUnmount(() => {
    stopTimer()
    document.removeEventListener('visibilitychange', onVisible)
  })

  return { status, order, payphone, error, minutesLeft, load }
}
