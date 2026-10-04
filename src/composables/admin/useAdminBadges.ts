import { computed, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import type { DashboardStats } from '@/types'

// Estado de módulo: el layout y el panel comparten las mismas cifras sin pedirlas dos veces.
const stats = ref<DashboardStats | null>(null)
const loading = ref(false)
const error = ref('')
let inflight: Promise<void> | null = null

async function refresh() {
  if (inflight) return inflight
  loading.value = true
  error.value = ''
  inflight = adminService
    .dashboard()
    .then((data) => {
      stats.value = data
    })
    .catch((e: { message?: string }) => {
      error.value = e?.message || 'No se pudo cargar el panel'
    })
    .finally(() => {
      loading.value = false
      inflight = null
    })
  return inflight
}

export function useAdminBadges() {
  const ordersBadge = computed(() => (stats.value ? stats.value.pendingTransfers + stats.value.dropiErrors : 0))
  return { stats, loading, error, refresh, ordersBadge }
}
