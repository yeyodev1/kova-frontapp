import { computed, onMounted, reactive, ref, watch } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { Product } from '@/types'
import { dollarsToCents } from '@/utils/money'
import { errorMessage } from './format'
import { marginOf } from './margin'
import { roundTo90, salePriceFrom } from './pricing'
import { useUploadPhotos } from './useUploadPhotos'

export interface UploadForm {
  title: string
  cost: number | null // dólares
  price: string // dólares tal cual los escribe; solo cuenta si `priceTouched`
  priceTouched: boolean
  compareAt: string // dólares tal cual los escribe; solo cuenta si `compareTouched`
  compareTouched: boolean
  stock: number
  category: string
  dropi: string // id o link de Dropi, tal cual lo pega el dueño
  shortDescription: string
  description: string
  benefits: string[]
  isFeatured: boolean
}

export type UploadField = 'photos' | 'title' | 'price' | 'dropi' | 'compareAt'

const DRAFT_KEY = 'kova:subir-producto'
const DEFAULT_STOCK = 50 // mismo UNKNOWN_STOCK del backend

function emptyForm(category = ''): UploadForm {
  return {
    title: '',
    cost: null,
    price: '',
    priceTouched: false,
    compareAt: '',
    compareTouched: false,
    stock: DEFAULT_STOCK,
    category,
    dropi: '',
    shortDescription: '',
    description: '',
    benefits: [],
    isFeatured: false,
  }
}

/** Espejo de `compareAtFor` del backend: +40% a .90 para mostrar el ahorro. */
export function compareAtFor(cents: number): number {
  return roundTo90(Math.round(cents * 1.4))
}

/** Espejo de `parseDropiReference`: el id suelto o el último número de 3+ dígitos del link. */
export function dropiIdFrom(text: string): number | null {
  const clean = text.trim()
  if (!clean) return null
  if (/^\d+$/.test(clean)) return Number(clean) || null
  let haystack = clean
  try {
    const url = new URL(/^https?:\/\//i.test(clean) ? clean : `https://${clean}`)
    haystack = `${url.pathname} ${url.search} ${url.hash}`
  } catch {
    // No es link: se busca en el texto tal cual.
  }
  const matches = haystack.match(/\d{3,}/g)
  return matches ? Number(matches[matches.length - 1]) : null
}

/** Texto plano del textarea a párrafos HTML (la ficha pinta `description` como HTML saneado). */
function toHtml(text: string): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`)
    .join('')
}

function readDraft(): (UploadForm & { images: string[] }) | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function useProductUpload() {
  const toast = useToastStore()
  const form = reactive<UploadForm>(emptyForm())
  const photos = useUploadPhotos((message) => toast.error(message))

  const markup = ref(60)
  const categories = ref<string[]>([])
  const errors = ref<Partial<Record<UploadField, string>>>({})
  const saving = ref<'' | 'publish' | 'draft'>('')
  const created = ref<Product | null>(null)
  const restored = ref(false)

  const costCents = computed(() => dollarsToCents(form.cost ?? 0))
  const autoPrice = computed(() => salePriceFrom(costCents.value, 0, markup.value))
  const priceCents = computed(() =>
    form.priceTouched ? dollarsToCents(form.price || 0) : autoPrice.value,
  )
  const autoCompare = computed(() => (priceCents.value ? compareAtFor(priceCents.value) : 0))
  const compareCents = computed(() =>
    form.compareTouched ? dollarsToCents(form.compareAt || 0) : autoCompare.value,
  )
  const margin = computed(() => marginOf(priceCents.value, costCents.value))
  const dropiId = computed(() => dropiIdFrom(form.dropi))

  function validate(publish: boolean) {
    const list: Partial<Record<UploadField, string>> = {}
    if (!form.title.trim()) list.title = 'Escribe el nombre del producto'
    if (publish && !photos.urls.value.length) list.photos = 'Agrega al menos una foto'
    if (publish && !(priceCents.value > 0))
      list.price = 'Escribe el costo del proveedor o el precio de venta'
    if (form.dropi.trim() && !dropiId.value) list.dropi = 'No encontré el número del producto en ese link'
    if (compareCents.value && compareCents.value <= priceCents.value)
      list.compareAt = 'El precio tachado debe ser mayor al de venta'
    errors.value = list
    return list
  }

  async function submit(publish: boolean) {
    if (saving.value) return false
    if (photos.uploading.value) {
      toast.info('Espera un momento: las fotos aún se están subiendo')
      return false
    }
    const list = validate(publish)
    const first = Object.values(list)[0]
    if (first) {
      toast.error(first)
      return false
    }
    saving.value = publish ? 'publish' : 'draft'
    try {
      created.value = await adminService.createProduct({
        title: form.title.trim(),
        ...(costCents.value ? { costPrice: costCents.value } : {}),
        ...(priceCents.value ? { price: priceCents.value } : {}),
        compareAtPrice: compareCents.value,
        stock: Math.max(0, Math.round(form.stock || 0)),
        category: form.category.trim(),
        shortDescription: form.shortDescription.trim(),
        description: toHtml(form.description),
        benefits: form.benefits.map((b) => b.trim()).filter(Boolean),
        images: photos.urls.value,
        dropiId: dropiId.value,
        isPublished: publish,
        isFeatured: form.isFeatured,
      })
      clearDraft()
      if (form.category && !categories.value.includes(form.category))
        categories.value = [...categories.value, form.category]
      return true
    } catch (e) {
      // El formulario queda intacto para corregir y reintentar.
      toast.error(errorMessage(e, 'No se pudo guardar el producto'))
      return false
    } finally {
      saving.value = ''
    }
  }

  /** "Subir otro": limpia todo menos la categoría, que suele repetirse en tanda. */
  function reset() {
    Object.assign(form, emptyForm(form.category))
    photos.clear()
    errors.value = {}
    created.value = null
    clearDraft()
  }

  function clearDraft() {
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      // Sin almacenamiento no hay borrador que limpiar.
    }
    restored.value = false
  }

  function discardDraft() {
    reset()
    form.category = ''
  }

  let timer: ReturnType<typeof setTimeout> | undefined
  watch(
    [form, photos.urls],
    () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const empty = !form.title && !form.cost && !photos.urls.value.length
        try {
          if (empty) localStorage.removeItem(DRAFT_KEY)
          else localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...form, images: photos.urls.value }))
        } catch {
          // Modo privado o sin espacio: el formulario sigue funcionando sin borrador.
        }
      }, 400)
    },
    { deep: true },
  )

  // Si el dueño escribe un error, se borra al corregir el campo.
  watch(
    () => [form.title, form.cost, form.price, form.dropi, form.compareAt, photos.urls.value.length],
    () => {
      if (Object.keys(errors.value).length) errors.value = {}
    },
  )

  onMounted(async () => {
    const draft = readDraft()
    if (draft) {
      const { images, ...rest } = draft
      Object.assign(form, { ...emptyForm(), ...rest })
      photos.restore(images || [])
      restored.value = true
    }
    const [settings, cats] = await Promise.allSettled([
      adminService.settings(),
      adminService.productCategories(),
    ])
    if (settings.status === 'fulfilled' && settings.value.defaultMarkupPercent !== undefined)
      markup.value = settings.value.defaultMarkupPercent
    if (cats.status === 'fulfilled') categories.value = cats.value
  })

  return {
    form,
    photos,
    markup,
    categories,
    errors,
    saving,
    created,
    restored,
    costCents,
    autoPrice,
    priceCents,
    autoCompare,
    compareCents,
    margin,
    dropiId,
    submit,
    reset,
    discardDraft,
  }
}

export type ProductUpload = ReturnType<typeof useProductUpload>
