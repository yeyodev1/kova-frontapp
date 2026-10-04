import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { Faq, Product } from '@/types'
import { centsToDollars, dollarsToCents } from '@/utils/money'
import { errorMessage } from './format'
import { marginOf } from './margin'

export interface OfferForm {
  quantity: number
  unitPrice: number // dólares
  label: string
  isDefault: boolean
}

export interface VariantForm {
  _id: string
  name: string
  price: number // dólares
  compareAtPrice: number // dólares
  stock: number
  dropiVariationId: string // texto: vacío = sin enlazar
  costPrice: number // dólares
}

export interface ProductForm {
  title: string
  slug: string
  shortDescription: string
  description: string
  category: string
  price: number
  compareAtPrice: number
  stock: number // solo productos sin variantes; con variantes es la suma
  variants: VariantForm[]
  offers: OfferForm[]
  benefits: string[]
  faqs: Faq[]
  images: string[]
  isPublished: boolean
  isFeatured: boolean
  dropiId: string // texto: vacío = sin enlazar
  costPrice: number // dólares
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toForm(p: Product): ProductForm {
  return {
    title: p.title,
    slug: p.slug,
    shortDescription: p.shortDescription || '',
    description: p.description || '',
    category: p.category || '',
    price: centsToDollars(p.price),
    compareAtPrice: centsToDollars(p.compareAtPrice),
    stock: p.stock ?? 0,
    variants: (p.variants || []).map((v) => ({
      _id: v._id,
      name: v.name,
      price: centsToDollars(v.price),
      compareAtPrice: centsToDollars(v.compareAtPrice),
      stock: v.stock,
      dropiVariationId: v.dropiVariationId ? String(v.dropiVariationId) : '',
      costPrice: centsToDollars(v.costPrice ?? 0),
    })),
    offers: (p.offers || []).map((o) => ({ ...o, unitPrice: centsToDollars(o.unitPrice) })),
    benefits: [...(p.benefits || [])],
    faqs: (p.faqs || []).map((f) => ({ ...f })),
    images: [...(p.images || [])],
    isPublished: p.isPublished,
    isFeatured: p.isFeatured,
    dropiId: p.dropiId ? String(p.dropiId) : '',
    costPrice: centsToDollars(p.costPrice ?? 0),
  }
}

const ID = /^\d{1,12}$/

function units(value: number): number {
  return Math.max(0, Math.round(Number(value) || 0))
}

function idOrNull(text: string): number | null {
  const clean = text.trim()
  return clean ? Number(clean) : null
}

export function useProductEditor() {
  const route = useRoute()
  const toast = useToastStore()

  const product = ref<Product | null>(null)
  const form = reactive<ProductForm>(
    toForm({ variants: [], offers: [], images: [] } as unknown as Product),
  )
  const loading = ref(true)
  const loadError = ref('')
  const saving = ref(false)
  const uploading = ref(false)
  const errors = ref<string[]>([])
  // Feedback visible del guardado: el toast se pierde si el admin está mirando la barra.
  const justSaved = ref(false)
  let savedTimer: ReturnType<typeof setTimeout> | undefined

  async function load() {
    loading.value = true
    loadError.value = ''
    try {
      product.value = await adminService.product(String(route.params.id))
      Object.assign(form, toForm(product.value))
    } catch (e) {
      loadError.value = errorMessage(e, 'No se pudo cargar el producto')
    } finally {
      loading.value = false
    }
  }

  const cost = computed(() => dollarsToCents(form.costPrice))
  const margin = computed(() => marginOf(dollarsToCents(form.price), cost.value))
  const belowCost = computed(() => {
    if (!cost.value) return false
    const prices = [
      form.price,
      ...form.variants.map((v) => v.price),
      ...form.offers.map((o) => o.unitPrice),
    ]
    return prices.some((p) => p > 0 && dollarsToCents(p) < cost.value)
  })

  function validate(): string[] {
    const list: string[] = []
    if (!form.title.trim()) list.push('El título es obligatorio')
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug))
      list.push('El slug solo admite minúsculas, números y guiones')
    if (!(form.price > 0)) list.push('El precio debe ser mayor a 0')
    if (form.compareAtPrice > 0 && form.compareAtPrice <= form.price)
      list.push('El precio tachado debe ser mayor al precio de venta')
    if (form.dropiId.trim() && !ID.test(form.dropiId.trim()))
      list.push('El ID de Dropi solo lleva números')
    form.variants.forEach((v) => {
      if (!(v.price > 0)) list.push(`La variante "${v.name}" necesita precio`)
      if (v.dropiVariationId.trim() && !ID.test(v.dropiVariationId.trim()))
        list.push(`El ID de variación de "${v.name}" solo lleva números`)
    })
    const qtys = new Set<number>()
    form.offers.forEach((o, i) => {
      if (!Number.isInteger(o.quantity) || o.quantity < 1)
        list.push(`Oferta ${i + 1}: cantidad inválida`)
      if (qtys.has(o.quantity)) list.push(`Hay dos ofertas para ${o.quantity} unidades`)
      qtys.add(o.quantity)
      if (!(o.unitPrice > 0)) list.push(`Oferta ${i + 1}: precio unitario inválido`)
    })
    if (form.offers.length && form.offers.filter((o) => o.isDefault).length !== 1)
      list.push('Marca exactamente una oferta como predeterminada')
    form.faqs.forEach((f, i) => {
      if (!f.question.trim() || !f.answer.trim())
        list.push(`La pregunta frecuente ${i + 1} está incompleta`)
    })
    return list
  }

  function toPatch(): Partial<Product> {
    const variants = (product.value?.variants || []).map((v) => {
      const edited = form.variants.find((f) => f._id === v._id)
      return edited
        ? {
            ...v,
            price: dollarsToCents(edited.price),
            compareAtPrice: dollarsToCents(edited.compareAtPrice),
            dropiVariationId: idOrNull(edited.dropiVariationId),
            costPrice: dollarsToCents(edited.costPrice),
            stock: units(edited.stock),
          }
        : v
    })
    return {
      title: form.title.trim(),
      slug: form.slug,
      shortDescription: form.shortDescription.trim(),
      description: form.description,
      category: form.category.trim(),
      price: dollarsToCents(form.price),
      compareAtPrice: dollarsToCents(form.compareAtPrice),
      ...(form.variants.length ? {} : { stock: units(form.stock) }),
      variants,
      offers: [...form.offers]
        .sort((a, b) => a.quantity - b.quantity)
        .map((o) => ({ ...o, label: o.label.trim(), unitPrice: dollarsToCents(o.unitPrice) })),
      benefits: form.benefits.map((b) => b.trim()).filter(Boolean),
      faqs: form.faqs.map((f) => ({ question: f.question.trim(), answer: f.answer.trim() })),
      images: form.images,
      isPublished: form.isPublished,
      isFeatured: form.isFeatured,
      dropiId: idOrNull(form.dropiId),
      costPrice: dollarsToCents(form.costPrice),
    }
  }

  async function save() {
    errors.value = validate()
    if (errors.value.length) {
      toast.error(errors.value[0] ?? 'Revisa el formulario')
      return
    }
    if (!product.value) return
    saving.value = true
    try {
      product.value = await adminService.updateProduct(product.value._id, toPatch())
      Object.assign(form, toForm(product.value))
      toast.success('Producto guardado')
      justSaved.value = true
      clearTimeout(savedTimer)
      savedTimer = setTimeout(() => (justSaved.value = false), 2600)
    } catch (e) {
      toast.error(errorMessage(e, 'No se pudo guardar'))
    } finally {
      saving.value = false
    }
  }

  async function uploadImage(file: File) {
    if (!product.value) return
    uploading.value = true
    try {
      const updated = await adminService.uploadProductImage(product.value._id, file)
      // Se respeta el orden local (aún sin guardar) y se agrega solo lo nuevo.
      const fresh = (updated.images || []).filter((url) => !form.images.includes(url))
      form.images.push(...fresh)
      toast.success('Imagen subida')
    } catch (e) {
      toast.error(errorMessage(e, 'No se pudo subir la imagen'))
    } finally {
      uploading.value = false
    }
  }

  const syncing = ref(false)

  /**
   * Refresca desde Dropi sin perder lo que el admin está editando: solo se tocan
   * los datos que manda Dropi (costo y variantes nuevas); stock y fecha vienen en `product`.
   */
  async function syncFromDropi() {
    if (!product.value?.dropiId) return
    syncing.value = true
    try {
      const updated = await adminService.syncProductFromDropi(product.value._id)
      const fresh = toForm(updated)
      form.costPrice = fresh.costPrice
      if (!fresh.variants.length) form.stock = fresh.stock
      fresh.variants.forEach((v) => {
        const current = form.variants.find((f) => f._id === v._id)
        if (current) {
          current.costPrice = v.costPrice
          current.stock = v.stock
        } else form.variants.push(v)
      })
      const added = updated.variants.length - (product.value.variants?.length ?? 0)
      product.value = updated
      toast.success(
        added > 0 ? `Sincronizado: ${added} variante(s) nueva(s)` : 'Sincronizado con Dropi',
      )
    } catch (e) {
      toast.error(errorMessage(e, 'No se pudo sincronizar con Dropi'))
    } finally {
      syncing.value = false
    }
  }

  onMounted(load)

  return {
    product,
    form,
    loading,
    loadError,
    saving,
    justSaved,
    uploading,
    errors,
    cost,
    margin,
    belowCost,
    load,
    save,
    uploadImage,
    syncing,
    syncFromDropi,
  }
}
