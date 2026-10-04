import { onMounted, reactive, ref, watch } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { Product } from '@/types'
import { errorMessage } from './format'

export function useProductsList() {
  const toast = useToastStore()
  const filters = reactive({ q: '', published: '', page: 1 })
  const items = ref<Product[]>([])
  const total = ref(0)
  const pages = ref(1)
  const loading = ref(false)
  const error = ref('')
  const toggling = ref<string | null>(null)
  let seq = 0

  async function load() {
    const mine = ++seq
    loading.value = true
    error.value = ''
    try {
      const data = await adminService.products({
        q: filters.q.trim() || undefined,
        page: filters.page,
        published: filters.published === '' ? undefined : filters.published === 'true',
      })
      if (mine !== seq) return
      items.value = data.items
      total.value = data.total
      pages.value = data.pages || 1
    } catch (e) {
      if (mine === seq) error.value = errorMessage(e, 'No se pudieron cargar los productos')
    } finally {
      if (mine === seq) loading.value = false
    }
  }

  let timer: ReturnType<typeof setTimeout> | undefined
  watch(
    () => filters.q,
    () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        filters.page = 1
        load()
      }, 350)
    },
  )
  watch(
    () => filters.published,
    () => {
      filters.page = 1
      load()
    },
  )

  function goTo(page: number) {
    filters.page = page
    load()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /** Cambio rápido desde la lista; se actualiza en sitio sin recargar todo. */
  async function toggle(product: Product, field: 'isPublished' | 'isFeatured') {
    toggling.value = `${product._id}:${field}`
    const next = !product[field]
    try {
      const updated = await adminService.updateProduct(product._id, { [field]: next })
      const i = items.value.findIndex((p) => p._id === product._id)
      if (i >= 0) items.value[i] = { ...product, ...updated, [field]: updated?.[field] ?? next }
      if (field === 'isPublished') toast.success(next ? 'Producto publicado' : 'Producto pasado a borrador')
      else toast.success(next ? 'Marcado como destacado' : 'Ya no es destacado')
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      toggling.value = null
    }
  }

  onMounted(load)

  return { filters, items, total, pages, loading, error, toggling, load, goTo, toggle }
}
