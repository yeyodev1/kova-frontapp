import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminService } from '@/services/admin.service'
import type { Order } from '@/types'
import { errorMessage } from './format'

/** `status` además de los estados reales: "por gestionar" (por defecto) y "todos". */
export const TODO = 'todo'
export const ALL = 'all'

/**
 * Lista de pedidos con filtros reflejados en la URL: el "atrás" del celular vuelve al mismo filtro.
 * Sin estado en la URL se abre en "Por gestionar"; "Todos" queda como `?status=all`.
 */
export function useOrdersList() {
  const route = useRoute()
  const router = useRouter()

  const q = (key: string) =>
    typeof route.query[key] === 'string' ? (route.query[key] as string) : ''

  const dropiErrorLink = q('dropiError') === '1'
  const filters = reactive({
    // El atajo de errores de Dropi muestra esos pedidos sin cruzarlos con "por gestionar".
    status: q('status') || (dropiErrorLink ? ALL : TODO),
    paymentMethod: q('paymentMethod'),
    q: q('q'),
    page: Number(q('page')) || 1,
    dropiError: dropiErrorLink,
  })

  const isTodo = computed(() => filters.status === TODO)
  /** El estado real para el API y la exportación: vacío en "por gestionar" y "todos". */
  const apiStatus = computed(() =>
    filters.status === TODO || filters.status === ALL ? '' : filters.status,
  )

  const items = ref<Order[]>([])
  const total = ref(0)
  const pages = ref(1)
  const loading = ref(false)
  const error = ref('')
  let seq = 0

  async function load() {
    const mine = ++seq
    loading.value = true
    error.value = ''
    try {
      const data = await adminService.orders({
        status: apiStatus.value || undefined,
        todo: isTodo.value ? 1 : undefined,
        paymentMethod: filters.paymentMethod || undefined,
        q: filters.q.trim() || undefined,
        page: filters.page,
        dropiError: filters.dropiError ? 1 : undefined,
      })
      if (mine !== seq) return
      items.value = data.items
      total.value = data.total
      pages.value = data.pages || 1
    } catch (e) {
      if (mine === seq) error.value = errorMessage(e, 'No se pudieron cargar los pedidos')
    } finally {
      if (mine === seq) loading.value = false
    }
  }

  function syncUrl() {
    const query: Record<string, string> = {}
    if (filters.status && filters.status !== TODO) query.status = filters.status
    if (filters.paymentMethod) query.paymentMethod = filters.paymentMethod
    if (filters.q.trim()) query.q = filters.q.trim()
    if (filters.dropiError) query.dropiError = '1'
    if (filters.page > 1) query.page = String(filters.page)
    router.replace({ query })
  }

  let searchTimer: ReturnType<typeof setTimeout> | undefined
  watch(
    () => filters.q,
    () => {
      clearTimeout(searchTimer)
      searchTimer = setTimeout(() => {
        filters.page = 1
        syncUrl()
        load()
      }, 350)
    },
  )

  watch(
    () => [filters.status, filters.paymentMethod],
    () => {
      // Elegir otro filtro saca del atajo de errores de Dropi.
      filters.dropiError = false
      filters.page = 1
      syncUrl()
      load()
    },
  )

  function goTo(page: number) {
    filters.page = page
    syncUrl()
    load()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  onMounted(load)

  return { filters, isTodo, apiStatus, items, total, pages, loading, error, load, goTo }
}
