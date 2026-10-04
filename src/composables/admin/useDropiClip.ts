import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type {
  DropiClipMessage,
  DropiClipProduct,
  DropiClipResult,
  DropiLinkedProduct,
} from '@/types'
import { isDropiOrigin } from '@/utils/dropiClipper'
import { centsToDollars, dollarsToCents } from '@/utils/money'
import { errorMessage } from './format'
import { salePriceFrom } from './pricing'

const MAX_PER_CALL = 60
const MAX_ITEMS = 300

/** Un producto recibido, en dólares y texto para editarlo en el formulario. */
export interface ClipDraft {
  key: string
  selected: boolean
  dropiId: string
  title: string
  images: string[]
  cost: number | null
  suggested: number | null
  // Solo cuando no hay costo: el dueño escribe el precio de venta directo.
  price: number | null
  stock: number | null
  description: string
  category: string
  supplier: string
  sourceUrl: string
  linked: DropiLinkedProduct | null
  result: DropiClipResult | null
}

let seq = 0

function positive(value: unknown): number | null {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : null
}

function toDraft(p: DropiClipProduct): ClipDraft {
  const cost = positive(p.costPrice)
  const suggested = positive(p.suggestedPrice)
  const id = positive(p.dropiId)
  return {
    key: `clip-${++seq}`,
    // Llegan sin marcar: el dueño elige cuáles quiere en su tienda.
    selected: false,
    dropiId: id && Number.isInteger(id) ? String(id) : '',
    title: String(p.title ?? '')
      .trim()
      .slice(0, 200),
    images: Array.isArray(p.images)
      ? p.images.filter((u) => typeof u === 'string').slice(0, 12)
      : [],
    cost: cost ? centsToDollars(cost) : null,
    suggested: suggested ? centsToDollars(suggested) : null,
    price: null,
    stock: Number.isInteger(p.stock) && Number(p.stock) >= 0 ? Number(p.stock) : null,
    description: typeof p.description === 'string' ? p.description : '',
    category: typeof p.category === 'string' ? p.category : '',
    supplier: typeof p.supplier === 'string' ? p.supplier : '',
    sourceUrl: typeof p.sourceUrl === 'string' ? p.sourceUrl : '',
    linked: null,
    result: null,
  }
}

/** El mensaje viene de otra ventana: se revisa la forma antes de tocar nada. */
function isClipMessage(data: unknown): data is DropiClipMessage {
  if (!data || typeof data !== 'object') return false
  const msg = data as Partial<DropiClipMessage>
  return (
    msg.type === 'kova-clip' &&
    Array.isArray(msg.products) &&
    msg.products.every((p) => p && typeof p === 'object' && typeof p.title === 'string')
  )
}

export function idError(item: ClipDraft): string {
  if (!/^\d+$/.test(item.dropiId.trim()) || Number(item.dropiId) <= 0) return 'Falta el ID de Dropi'
  return ''
}

/** Escribir un costo o un precio es señal de que lo quiere: se marca solo. */
export function pickOnPrice(item: ClipDraft) {
  if ((item.cost ?? 0) > 0 || (item.price ?? 0) > 0) item.selected = true
}

export function titleError(item: ClipDraft): string {
  const length = item.title.trim().length
  return length < 2 || length > 200 ? 'El nombre debe tener entre 2 y 200 caracteres' : ''
}

export function useDropiClip() {
  const toast = useToastStore()

  const items = ref<ClipDraft[]>([])
  const markup = ref(40)
  const importing = ref(false)
  const source = reactive({ url: '', pageType: '' as '' | 'detail' | 'list' })

  const selected = computed(() => items.value.filter((i) => i.selected))
  const blocked = computed(() => selected.value.filter((i) => idError(i) || titleError(i)))
  const done = computed(() => items.value.filter((i) => i.result && i.result.status !== 'error'))

  /** Precio de venta en centavos: con costo se calcula con el margen; sin costo, el manual. */
  function salePrice(item: ClipDraft): number {
    const cost = dollarsToCents(item.cost ?? 0)
    const suggested = dollarsToCents(item.suggested ?? 0)
    if (cost > 0) return salePriceFrom(cost, suggested, markup.value || 0)
    if (item.price && item.price > 0) return dollarsToCents(item.price)
    return salePriceFrom(0, suggested, markup.value || 0)
  }

  async function markLinked(list: ClipDraft[]) {
    const ids = Array.from(new Set(list.map((i) => Number(i.dropiId)).filter((n) => n > 0)))
    try {
      for (let i = 0; i < ids.length; i += MAX_PER_CALL) {
        const found = await adminService.dropiLinked(ids.slice(i, i + MAX_PER_CALL))
        for (const item of list) {
          const match = found.find((f) => String(f.dropiId) === item.dropiId)
          if (match) item.linked = match
        }
      }
    } catch {
      // Solo es una marca visual: si falla, el import igual actualiza en vez de duplicar.
    }
  }

  function load(products: DropiClipProduct[], meta?: { url?: string; pageType?: string }) {
    const fresh = products.slice(0, MAX_ITEMS).map(toDraft)
    // Si vuelven a mandar el mismo producto (otra página del catálogo), no se duplica.
    const known = new Set(items.value.map((i) => i.dropiId).filter(Boolean))
    const added = fresh.filter((d) => !d.dropiId || !known.has(d.dropiId))
    items.value = [...added, ...items.value].slice(0, MAX_ITEMS)
    source.url = meta?.url ?? ''
    source.pageType =
      meta?.pageType === 'detail' ? 'detail' : meta?.pageType === 'list' ? 'list' : ''
    markLinked(added)
    if (added.length) {
      toast.success(`Llegaron ${added.length} productos de Dropi: marca los que quieras importar`)
    } else toast.info('Esos productos ya estaban en la lista')
  }

  function onMessage(event: MessageEvent) {
    if (!isDropiOrigin(event.origin)) return
    const data = event.data as { type?: string } | null
    if (data?.type === 'kova-clip-ping') {
      ;(event.source as Window | null)?.postMessage({ type: 'kova-clip-ready' }, event.origin)
      return
    }
    if (!isClipMessage(data)) return
    load(data.products, { url: data.sourceUrl, pageType: data.pageType })
  }

  /** Pegado manual (avanzado): `{ products: [...] }` o directamente la lista. */
  function paste(text: string): string {
    try {
      const parsed = JSON.parse(text)
      const list = Array.isArray(parsed) ? parsed : parsed?.products
      if (!Array.isArray(list) || !list.length) return 'El JSON no trae una lista de productos'
      if (!list.every((p) => p && typeof p === 'object' && typeof p.title === 'string')) {
        return 'Cada producto necesita al menos "title"'
      }
      load(list, { pageType: 'list' })
      return ''
    } catch {
      return 'Eso no es JSON válido'
    }
  }

  function selectAll(value: boolean) {
    for (const item of items.value) item.selected = value
  }

  function remove(key: string) {
    items.value = items.value.filter((i) => i.key !== key)
  }

  function payload(item: ClipDraft): DropiClipProduct {
    const cost = dollarsToCents(item.cost ?? 0)
    const suggested = dollarsToCents(item.suggested ?? 0)
    return {
      dropiId: Number(item.dropiId),
      title: item.title.trim(),
      images: item.images,
      costPrice: cost || undefined,
      suggestedPrice: suggested || undefined,
      // Sin costo el backend no puede calcular: se manda el precio que escribió el dueño.
      price: !cost && item.price ? dollarsToCents(item.price) : undefined,
      stock: item.stock ?? undefined,
      description: item.description || undefined,
      category: item.category || undefined,
      sourceUrl: item.sourceUrl.startsWith('https://') ? item.sourceUrl : undefined,
    }
  }

  async function importSelected() {
    if (!selected.value.length) {
      toast.error('Marca al menos un producto')
      return
    }
    if (blocked.value.length) {
      toast.error(
        `Completa el ID de Dropi y el nombre de ${blocked.value.length} productos marcados`,
      )
      return
    }
    importing.value = true
    const batch = [...selected.value]
    try {
      for (let i = 0; i < batch.length; i += MAX_PER_CALL) {
        const chunk = batch.slice(i, i + MAX_PER_CALL)
        const { results } = await adminService.dropiClip(chunk.map(payload), markup.value)
        // El backend responde en el mismo orden en que recibe.
        chunk.forEach((item, index) => {
          const result = results[index] ?? null
          item.result = result
          if (result && result.status !== 'error') {
            item.selected = false
            if (result.productId) {
              item.linked = {
                dropiId: Number(item.dropiId),
                productId: result.productId,
                title: result.title,
                isPublished: item.linked?.isPublished ?? false,
              }
            }
          }
        })
      }
      const failed = batch.filter((i) => i.result?.status === 'error').length
      const ok = batch.length - failed
      if (ok) toast.success(`${ok} productos guardados como borrador`)
      if (failed) toast.error(`${failed} no se pudieron importar: revisa el motivo en cada uno`)
    } catch (e) {
      toast.error(errorMessage(e, 'No se pudo importar'))
    } finally {
      importing.value = false
    }
  }

  async function loadMarkup() {
    try {
      const s = await adminService.settings()
      if (typeof s.defaultMarkupPercent === 'number') markup.value = s.defaultMarkupPercent
    } catch {
      // Sin ajustes queda el 40%; no bloquea la importación.
    }
  }

  onMounted(() => {
    window.addEventListener('message', onMessage)
    loadMarkup()
    // Avisa a la pestaña de Dropi que el panel ya escucha. No lleva datos, por eso el '*'.
    try {
      window.opener?.postMessage({ type: 'kova-clip-ready' }, '*')
    } catch {
      // Sin opener (se abrió a mano): se espera el ping del favorito.
    }
  })
  onBeforeUnmount(() => window.removeEventListener('message', onMessage))

  return {
    items,
    markup,
    importing,
    source,
    selected,
    blocked,
    done,
    salePrice,
    paste,
    selectAll,
    remove,
    importSelected,
  }
}
