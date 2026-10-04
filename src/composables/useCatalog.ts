import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeService, type ProductQuery } from '@/services/store.service'
import type { ApiError, Product } from '@/types'

type Sort = NonNullable<ProductQuery['sort']>
const SORTS: Sort[] = ['popular', 'new', 'price_asc', 'price_desc']
const LIMIT = 12

/**
 * Catálogo con filtros en la URL: un link compartido por WhatsApp abre
 * exactamente la misma búsqueda.
 */
export function useCatalog() {
  const route = useRoute()
  const router = useRouter()

  const items = ref<Product[]>([])
  const categories = ref<string[]>([])
  const page = ref(1)
  const pages = ref(1)
  const total = ref(0)
  const loading = ref(false)
  const loadingMore = ref(false)
  const error = ref('')

  const q = computed(() => String(route.query.q || ''))
  const category = computed(() => String(route.query.categoria || ''))
  const sort = computed<Sort>(() => {
    const value = String(route.query.orden || '') as Sort
    return SORTS.includes(value) ? value : 'popular'
  })
  const hasMore = computed(() => page.value < pages.value)

  async function fetchPage(target: number) {
    return storeService.products({
      page: target,
      limit: LIMIT,
      q: q.value || undefined,
      category: category.value || undefined,
      sort: sort.value,
    })
  }

  async function reload() {
    loading.value = true
    error.value = ''
    try {
      const data = await fetchPage(1)
      items.value = data.items
      page.value = data.page
      pages.value = data.pages
      total.value = data.total
    } catch (e) {
      error.value = (e as ApiError).message
      items.value = []
    } finally {
      loading.value = false
    }
  }

  async function loadMore() {
    if (loadingMore.value || !hasMore.value) return
    loadingMore.value = true
    try {
      const data = await fetchPage(page.value + 1)
      items.value.push(...data.items)
      page.value = data.page
      pages.value = data.pages
    } catch (e) {
      error.value = (e as ApiError).message
    } finally {
      loadingMore.value = false
    }
  }

  async function loadCategories() {
    try {
      categories.value = await storeService.categories()
    } catch {
      categories.value = []
    }
  }

  function setFilter(patch: { q?: string; categoria?: string; orden?: string }) {
    const query: Record<string, string> = {
      q: q.value,
      categoria: category.value,
      orden: sort.value === 'popular' ? '' : sort.value,
      ...patch,
    }
    for (const key of Object.keys(query)) if (!query[key]) delete query[key]
    router.replace({ query })
  }

  watch(() => [q.value, category.value, sort.value], reload, { immediate: true })
  loadCategories()

  return {
    items,
    categories,
    total,
    loading,
    loadingMore,
    error,
    q,
    category,
    sort,
    hasMore,
    loadMore,
    setFilter,
    reload,
  }
}
