import { computed, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { incidentService } from '@/services/incident.service'
import type { DashboardStats } from '@/types'
import type { IncidentSummary } from '@/types/incidents'

// Estado de módulo: el layout y el panel comparten las mismas cifras sin pedirlas dos veces.
const stats = ref<DashboardStats | null>(null)
const incidents = ref<IncidentSummary | null>(null)
const loading = ref(false)
const error = ref('')
let inflight: Promise<void> | null = null

async function refresh() {
  if (inflight) return inflight
  loading.value = true
  error.value = ''
  inflight = Promise.all([
    adminService
      .dashboard()
      .then((data) => {
        stats.value = data
      })
      .catch((e: { message?: string }) => {
        error.value = e?.message || 'No se pudo cargar el panel'
      }),
    // Las incidencias no bloquean el panel: si fallan, solo no hay badge.
    incidentService
      .summary()
      .then((data) => {
        incidents.value = data
      })
      .catch(() => {}),
  ])
    .then(() => undefined)
    .finally(() => {
      loading.value = false
      inflight = null
    })
  return inflight
}

export type AdminBadgeKey = 'orders' | 'incidents'

export function useAdminBadges() {
  // Lo que el equipo tiene que mover; sin `todoCount` (API anterior) cae a la suma de antes.
  const ordersBadge = computed(() => {
    if (!stats.value) return 0
    return stats.value.todoCount ?? stats.value.pendingTransfers + stats.value.dropiErrors
  })
  // Incidencias abiertas de severidad alta y media.
  const incidentsBadge = computed(() => incidents.value?.badge ?? 0)
  const badges = computed<Record<AdminBadgeKey, number>>(() => ({
    orders: ordersBadge.value,
    incidents: incidentsBadge.value,
  }))
  return { stats, incidents, loading, error, refresh, ordersBadge, incidentsBadge, badges }
}
