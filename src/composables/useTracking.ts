import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { trackingCopy, whatsappLink } from '@/config/site'
import { storeService } from '@/services/store.service'
import { isValidPhone, normalizePhone } from '@/composables/useCheckoutForm'
import { formatDate } from '@/utils/format'
import type { ApiError, Order, OrderItem, OrderStatus } from '@/types'

/** Lo que devuelve GET /orders/track: una versión recortada y pública del pedido. */
export type TrackedOrder = Pick<
  Order,
  '_id' | 'number' | 'status' | 'paymentMethod' | 'paymentStatus' | 'subtotal' | 'shippingFee' | 'surcharge' | 'total' | 'createdAt'
> & {
  items: Pick<OrderItem, 'title' | 'variantName' | 'image' | 'quantity' | 'unitPrice' | 'total'>[]
  customer: { firstName: string }
  address: { province: string; city: string }
  transfer: { uploadedAt: string | null; confirmedAt: string | null }
  guide?: string
  carrier?: string
  dropi?: { status: string; guide: string; carrier: string }
}

export type StepState = 'done' | 'current' | 'todo'
export interface TrackStep {
  key: string
  label: string
  icon: string
  hint: string
  state: StepState
}

// Cuántos pasos de la línea de tiempo están completos en cada estado.
// Los estados finales negativos no usan la línea: muestran un aviso.
const DONE_STEPS: Record<OrderStatus, number> = {
  pending_payment: 1,
  awaiting_transfer: 1,
  transfer_review: 1,
  confirmed: 2,
  sent_to_dropi: 2,
  shipped: 3,
  delivered: 5,
  returned: 0,
  cancelled: 0,
  failed: 0,
}

const NEGATIVE: OrderStatus[] = ['returned', 'cancelled', 'failed']

/** "1001", "kv-1001", "KV 1001", "kv1001" → "KV-1001". Si no tiene esa forma, se devuelve en mayúsculas. */
export function normalizeOrderNumber(raw: string): string {
  const compact = raw.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const match = compact.match(/^(?:KV)?(\d{1,8})$/)
  return match ? `KV-${match[1]}` : raw.trim().toUpperCase()
}

const isOrderNumber = (value: string) => /^KV-\d{1,8}$/.test(value)

// Estado de módulo: la vista y sus piezas (formulario, boleto, ayuda) leen lo mismo sin pasar props en cadena.
const form = reactive({ number: '', phone: '' })
const errors = reactive({ number: '', phone: '' })
const order = ref<TrackedOrder | null>(null)
const loading = ref(false)
const notFound = ref(false)
const error = ref('')
const searchedPhone = ref('')

export function useTracking() {
  const router = useRouter()

  function check(field: 'number' | 'phone') {
    const e = trackingCopy.errors
    if (field === 'number') {
      const value = normalizeOrderNumber(form.number)
      errors.number = !form.number.trim() ? e.numberRequired : isOrderNumber(value) ? '' : e.number
    } else {
      errors.phone = !form.phone.trim() ? e.phoneRequired : isValidPhone(form.phone) ? '' : e.phone
    }
  }

  /** Al salir del campo dejamos el número ya escrito como KV-1001: así el cliente ve que lo entendimos. */
  function tidyNumber() {
    if (!form.number.trim()) return
    form.number = normalizeOrderNumber(form.number)
    if (errors.number) check('number')
  }

  async function search() {
    if (loading.value) return
    check('number')
    check('phone')
    if (errors.number || errors.phone) return

    const number = normalizeOrderNumber(form.number)
    const phone = normalizePhone(form.phone)
    form.number = number
    loading.value = true
    notFound.value = false
    error.value = ''
    try {
      order.value = (await storeService.track(number, phone)) as unknown as TrackedOrder
      searchedPhone.value = phone
      // La URL queda con el pedido: recargar o compartir el link muestra lo mismo.
      router.replace({ query: { number, phone } })
    } catch (e) {
      const err = e as ApiError
      order.value = null
      if (err.status === 404) notFound.value = true
      else error.value = err.message || trackingCopy.errorTitle
    } finally {
      loading.value = false
    }
  }

  /** Llega desde el correo o WhatsApp: /rastrear?number=KV-1001&phone=09... */
  function fromQuery(query: Record<string, unknown>) {
    const number = String(query.number || query.numero || '')
    const phone = String(query.phone || '')
    if (!number || !phone) return false
    if (order.value?.number === normalizeOrderNumber(number) && searchedPhone.value === normalizePhone(phone)) return true
    form.number = number
    form.phone = phone
    search()
    return true
  }

  function clear() {
    order.value = null
    notFound.value = false
    error.value = ''
    errors.number = ''
    errors.phone = ''
  }

  /** "Rastrear otro pedido": conserva el celular, que casi siempre es el mismo. */
  function another() {
    clear()
    form.number = ''
    router.replace({ query: {} })
  }

  const isNegative = computed(() => !!order.value && NEGATIVE.includes(order.value.status))

  const status = computed(() => {
    if (!order.value) return null
    const base = trackingCopy.status[order.value.status]
    const cod = order.value.paymentMethod === 'cod' && order.value.status === 'shipped'
    return { ...base, text: cod ? `${base.text} ${trackingCopy.codShipped}` : base.text }
  })

  const steps = computed<TrackStep[]>(() => {
    const o = order.value
    if (!o || isNegative.value) return []
    const s = trackingCopy.steps
    const h = trackingCopy.hints
    const done = DONE_STEPS[o.status]
    const pay = s.payment[o.paymentMethod]
    const review = o.status === 'transfer_review'
    const raw = [
      { key: 'received', ...s.received, hint: formatDate(o.createdAt) },
      {
        key: 'payment',
        label: review ? s.review : done > 1 ? pay.label : s.paymentPending[o.paymentMethod],
        icon: pay.icon,
        hint:
          done > 1
            ? o.transfer.confirmedAt ? formatDate(o.transfer.confirmedAt) : ''
            : review && o.transfer.uploadedAt ? h.receiptUploaded(formatDate(o.transfer.uploadedAt)) : h.paymentWait[o.paymentMethod],
      },
      { key: 'preparing', ...s.preparing, hint: '' },
      { key: 'shipped', ...s.shipped, hint: carrier.value },
      { key: 'delivered', ...s.delivered, hint: o.paymentMethod === 'cod' && done < 5 ? h.codPay : '' },
    ]
    return raw.map((step, i) => ({ ...step, state: i < done ? 'done' : i === done ? 'current' : 'todo' }))
  })

  const carrier = computed(() => order.value?.carrier || order.value?.dropi?.carrier || '')
  const guide = computed(() => order.value?.guide || order.value?.dropi?.guide || '')
  const whatsapp = computed(() => whatsappLink(trackingCopy.whatsappMessage(order.value?.number || normalizeOrderNumber(form.number))))
  const uploadLink = computed(() =>
    order.value?.status === 'awaiting_transfer'
      ? { path: `/pedido/${order.value.number}`, query: { phone: searchedPhone.value } }
      : null,
  )

  return {
    form,
    errors,
    order,
    loading,
    notFound,
    error,
    check,
    tidyNumber,
    search,
    fromQuery,
    clear,
    another,
    isNegative,
    status,
    steps,
    carrier,
    guide,
    whatsapp,
    uploadLink,
  }
}
