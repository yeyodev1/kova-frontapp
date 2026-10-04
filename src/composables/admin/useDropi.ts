import { onMounted, reactive, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { DropiCatalogItem } from '@/types'
import { errorMessage, errorStatus } from './format'

export type SyncKind = 'products' | 'locations' | 'orders'

const LIMIT = 24

export function useDropi() {
  const toast = useToastStore()

  const q = ref('')
  const page = ref(1)
  const items = ref<DropiCatalogItem[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref('')
  // 503 = el backend no tiene DROPI_INTEGRATION_KEY; se avisa en vez de mostrar un error genérico.
  const missingToken = ref(false)
  const markup = ref(40)
  const importing = ref<number | null>(null)
  const importedIds = reactive<Record<number, string>>({})

  const syncing = ref<SyncKind | null>(null)
  const syncResults = reactive<Partial<Record<SyncKind, Record<string, unknown> | string>>>({})

  function handleError(e: unknown, fallback: string): string {
    if (errorStatus(e) === 503) missingToken.value = true
    return errorMessage(e, fallback)
  }

  async function search(p = 1) {
    page.value = p
    loading.value = true
    error.value = ''
    try {
      const data = await adminService.dropiCatalog({ q: q.value.trim() || undefined, page: p, limit: LIMIT })
      items.value = data.items
      total.value = data.total
      missingToken.value = false
    } catch (e) {
      error.value = handleError(e, 'No se pudo consultar el catálogo de Dropi')
      items.value = []
    } finally {
      loading.value = false
    }
  }

  async function importItem(item: DropiCatalogItem) {
    importing.value = item.dropiId
    try {
      const product = await adminService.importFromDropi(item.dropiId, markup.value)
      importedIds[item.dropiId] = product._id
      item.imported = true
      toast.success(`${product.title || item.name} quedó como borrador`)
    } catch (e) {
      toast.error(handleError(e, 'No se pudo importar'))
    } finally {
      importing.value = null
    }
  }

  async function sync(kind: SyncKind) {
    syncing.value = kind
    try {
      syncResults[kind] = await adminService.syncDropi(kind)
      toast.success('Sincronización terminada')
    } catch (e) {
      const msg = handleError(e, 'No se pudo sincronizar')
      syncResults[kind] = msg
      toast.error(msg)
    } finally {
      syncing.value = null
    }
  }

  async function loadMarkup() {
    try {
      const s = await adminService.settings()
      if (typeof s.defaultMarkupPercent === 'number') markup.value = s.defaultMarkupPercent
    } catch {
      // Sin ajustes se usa el 40% por defecto; no bloquea la importación.
    }
  }

  const pages = () => Math.max(1, Math.ceil(total.value / LIMIT))

  onMounted(() => {
    loadMarkup()
    search(1)
  })

  return {
    q,
    page,
    pages,
    items,
    total,
    loading,
    error,
    missingToken,
    markup,
    importing,
    importedIds,
    syncing,
    syncResults,
    search,
    importItem,
    sync,
  }
}
