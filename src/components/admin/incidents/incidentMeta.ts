import type { Tone } from '../orderLabels'
import type {
  IncidentSeverity,
  IncidentStatus,
  IncidentStatusFilter,
  IncidentType,
} from '@/types/incidents'

/** Copy, iconos y colores de la bandeja de incidencias (un solo lugar). */

export const typeMeta: Record<IncidentType, { label: string; icon: string }> = {
  dropi_error: { label: 'Error de Dropi', icon: 'fa-solid fa-truck-ramp-box' },
  payment_mismatch: { label: 'Pago no cuadra', icon: 'fa-solid fa-scale-unbalanced' },
  payment_failed: { label: 'Pago con error', icon: 'fa-solid fa-credit-card' },
  email_failed: { label: 'Correo no enviado', icon: 'fa-solid fa-envelope-circle-check' },
  bot_error: { label: 'Error del bot', icon: 'fa-solid fa-robot' },
  customer_complaint: { label: 'Reclamo', icon: 'fa-solid fa-face-frown' },
  human_request: { label: 'Pide asesor', icon: 'fa-solid fa-headset' },
  receipt_review_stale: { label: 'Comprobante sin revisar', icon: 'fa-solid fa-file-invoice-dollar' },
  order_stuck: { label: 'Pedido sin guía', icon: 'fa-solid fa-hourglass-half' },
  manual: { label: 'Manual', icon: 'fa-solid fa-pen-to-square' },
}

export const typeOptions = [
  { value: '', label: 'Todos los tipos' },
  ...(Object.keys(typeMeta) as IncidentType[]).map((value) => ({ value, label: typeMeta[value].label })),
]

export const severityMeta: Record<IncidentSeverity, { label: string; tone: Tone }> = {
  high: { label: 'Alta', tone: 'danger' },
  medium: { label: 'Media', tone: 'warning' },
  low: { label: 'Baja', tone: 'neutral' },
}

export const severityOptions = [
  { value: '', label: 'Toda severidad' },
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baja' },
]

export const statusMeta: Record<IncidentStatus, { label: string; tone: Tone; icon: string }> = {
  open: { label: 'Abierta', tone: 'danger', icon: 'fa-regular fa-circle' },
  in_progress: { label: 'En curso', tone: 'info', icon: 'fa-solid fa-person-running' },
  resolved: { label: 'Resuelta', tone: 'success', icon: 'fa-solid fa-circle-check' },
  dismissed: { label: 'Descartada', tone: 'neutral', icon: 'fa-solid fa-ban' },
}

export const statusTabs: { value: IncidentStatusFilter; label: string }[] = [
  { value: 'active', label: 'Abiertas' },
  { value: 'in_progress', label: 'En curso' },
  { value: 'resolved', label: 'Resueltas' },
  { value: 'dismissed', label: 'Descartadas' },
  { value: 'all', label: 'Todas' },
]

export const incidentCopy = {
  title: 'Incidencias',
  subtitle: (n: number) => (n === 1 ? '1 problema por atender' : `${n} problemas por atender`),
  newButton: 'Nueva incidencia',
  search: 'Buscar por IN-, KV-, cliente o celular',
  emptyActive: 'Todo en orden',
  emptyActiveText: 'Cuando algo falle (Dropi, un pago, un reclamo por WhatsApp) aparecerá aquí para atenderlo.',
  emptyFiltered: 'Nada con esos filtros',
  emptyFilteredText: 'Prueba con otro estado, tipo o búsqueda.',
  pick: 'Elige una incidencia para ver el detalle.',
  take: 'Tomar',
  resolve: 'Resolver',
  dismiss: 'Descartar',
  reopen: 'Reabrir',
  assignee: 'Responsable',
  nobody: 'Sin responsable',
  severity: 'Severidad',
  order: 'Ver pedido',
  chat: 'Ver conversación',
  notes: 'Seguimiento',
  notePlaceholder: 'Qué hiciste o qué falta (ej. "Le escribí por WhatsApp")',
  addNote: 'Agregar nota',
  times: (n: number) => `×${n} veces`,
  done: {
    in_progress: 'La tomaste: queda a tu cargo',
    resolved: 'Incidencia resuelta',
    dismissed: 'Incidencia descartada',
    open: 'Incidencia reabierta',
    note: 'Nota agregada',
    saved: 'Cambios guardados',
    created: 'Incidencia creada',
  },
  form: {
    title: 'Nueva incidencia',
    what: 'Qué pasó',
    whatHint: 'Ej. Cliente dice que el parlante llegó sin cargador',
    detail: 'Detalle (opcional)',
    order: 'Pedido (opcional)',
    phone: 'Celular del cliente (opcional)',
    submit: 'Crear incidencia',
    cancel: 'Cancelar',
  },
}

const units: [number, string, string][] = [
  [60, 'min', 'min'],
  [24, 'h', 'h'],
  [30, 'día', 'días'],
]

/** "hace 5 min", "hace 3 h", "hace 2 días". */
export function timeAgo(value: string | null | undefined): string {
  if (!value) return ''
  let diff = Math.max(0, (Date.now() - new Date(value).getTime()) / 60000)
  if (diff < 1) return 'hace un momento'
  for (const [size, one, many] of units) {
    if (diff < size) {
      const n = Math.floor(diff)
      return `hace ${n} ${n === 1 ? one : many}`
    }
    diff /= size
  }
  const months = Math.floor(diff)
  return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`
}
