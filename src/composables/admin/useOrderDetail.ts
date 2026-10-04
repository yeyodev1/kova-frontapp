import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { Order } from '@/types'
import { errorMessage, formatDateTime } from './format'
import { statusLabel } from '@/components/admin/orderLabels'
import { formatCents } from '@/utils/money'
import { useAdminBadges } from './useAdminBadges'

type Action = 'confirm-transfer' | 'send-to-dropi' | 'cancel'

const successText: Record<Action, string> = {
  'confirm-transfer': 'Transferencia confirmada',
  'send-to-dropi': 'Pedido enviado a Dropi',
  cancel: 'Pedido cancelado',
}

export interface TimelineEvent {
  label: string
  at: string
  icon: string
  note?: string
}

type OrderWithHistory = Order & { history?: { status?: string; at?: string; date?: string; note?: string }[] }

export function useOrderDetail() {
  const route = useRoute()
  const toast = useToastStore()
  const { refresh: refreshBadges } = useAdminBadges()

  const order = ref<OrderWithHistory | null>(null)
  const loading = ref(true)
  const error = ref('')
  const busy = ref<Action | null>(null)
  const confirmCancel = ref(false)

  async function load() {
    loading.value = true
    error.value = ''
    try {
      order.value = await adminService.order(String(route.params.id))
    } catch (e) {
      error.value = errorMessage(e, 'No se pudo cargar el pedido')
    } finally {
      loading.value = false
    }
  }

  async function run(action: Action) {
    if (!order.value || busy.value) return
    busy.value = action
    try {
      order.value = await adminService.orderAction(order.value._id, action)
      toast.success(successText[action])
      refreshBadges()
    } catch (e) {
      toast.error(errorMessage(e))
      // El pedido pudo cambiar a medias (p. ej. pagado pero Dropi falló): se recarga.
      load()
    } finally {
      busy.value = null
    }
  }

  async function cancelOrder() {
    confirmCancel.value = false
    await run('cancel')
  }

  const canConfirmTransfer = computed(
    () => !!order.value && ['transfer_review', 'awaiting_transfer'].includes(order.value.status),
  )
  const canSendToDropi = computed(
    () => !!order.value && order.value.status === 'confirmed' && !order.value.dropi?.orderId,
  )
  const canCancel = computed(
    () => !!order.value && !['cancelled', 'delivered', 'returned', 'failed'].includes(order.value.status),
  )

  const whatsappMessage = computed(() => {
    const o = order.value
    if (!o) return ''
    const lines = o.items.map((i) => `- ${i.quantity} x ${i.title}${i.variantName ? ` (${i.variantName})` : ''}`)
    return [
      `Hola ${o.customer.firstName}, te escribimos de Kova.`,
      `Recibimos tu pedido ${o.number}:`,
      ...lines,
      `Total: ${formatCents(o.total)}`,
      `Envío a: ${o.address.street}, ${o.address.city}, ${o.address.province}.`,
      '¿Nos confirmas que los datos están correctos para despacharlo?',
    ].join('\n')
  })

  const timeline = computed<TimelineEvent[]>(() => {
    const o = order.value
    if (!o) return []
    const events: TimelineEvent[] = [{ label: 'Pedido creado', at: o.createdAt, icon: 'fa-solid fa-plus' }]
    if (o.transfer?.uploadedAt)
      events.push({ label: 'Comprobante subido', at: o.transfer.uploadedAt, icon: 'fa-solid fa-file-arrow-up' })
    if (o.transfer?.confirmedAt)
      events.push({ label: 'Transferencia confirmada', at: o.transfer.confirmedAt, icon: 'fa-solid fa-check' })
    for (const h of o.history ?? []) {
      const at = h.at || h.date
      if (at) events.push({ label: statusLabel(h.status || ''), at, icon: 'fa-solid fa-circle', note: h.note })
    }
    if (o.dropi?.lastSyncAt)
      events.push({
        label: `Sincronizado con Dropi${o.dropi.status ? `: ${o.dropi.status}` : ''}`,
        at: o.dropi.lastSyncAt,
        icon: 'fa-solid fa-truck',
      })
    return events
      .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
      .map((e) => ({ ...e, at: formatDateTime(e.at) }))
  })

  onMounted(load)

  return {
    order,
    loading,
    error,
    busy,
    confirmCancel,
    load,
    run,
    cancelOrder,
    canConfirmTransfer,
    canSendToDropi,
    canCancel,
    whatsappMessage,
    timeline,
  }
}
