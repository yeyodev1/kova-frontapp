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
}

export interface ProductForm {
  title: string
  slug: string
  shortDescription: string
  description: string
  category: string
  price: number
  compareAtPrice: number
  variants: VariantForm[]
  offers: OfferForm[]
  benefits: string[]
  faqs: Faq[]
  images: string[]
  isPublished: boolean
  isFeatured: boolean
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
    variants: (p.variants || []).map((v) => ({
      _id: v._id,
      name: v.name,
      price: centsToDollars(v.price),
      compareAtPrice: centsToDollars(v.compareAtPrice),
      stock: v.stock,
    })),
    offers: (p.offers || []).map((o) => ({ ...o, unitPrice: centsToDollars(o.unitPrice) })),
    benefits: [...(p.benefits || [])],
    faqs: (p.faqs || []).map((f) => ({ ...f })),
    images: [...(p.images || [])],
    isPublished: p.isPublished,
    isFeatured: p.isFeatured,
  }
}

export function useProductEditor() {
  const route = useRoute()
  const toast = useToastStore()

  const product = ref<Product | null>(null)
  const form = reactive<ProductForm>(toForm({ variants: [], offers: [], images: [] } as unknown as Product))
  const loading = ref(true)
  const loadError = ref('')
  const saving = ref(false)
  const uploading = ref(false)
  const errors = ref<string[]>([])

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

  const cost = computed(() => product.value?.costPrice ?? 0)
  const margin = computed(() => marginOf(dollarsToCents(form.price), cost.value))
  const belowCost = computed(() => {
    if (!cost.value) return false
    const prices = [form.price, ...form.variants.map((v) => v.price), ...form.offers.map((o) => o.unitPrice)]
    return prices.some((p) => p > 0 && dollarsToCents(p) < cost.value)
  })

  function validate(): string[] {
    const list: string[] = []
    if (!form.title.trim()) list.push('El título es obligatorio')
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) list.push('El slug solo admite minúsculas, números y guiones')
    if (!(form.price > 0)) list.push('El precio debe ser mayor a 0')
    if (form.compareAtPrice > 0 && form.compareAtPrice <= form.price)
      list.push('El precio tachado debe ser mayor al precio de venta')
    form.variants.forEach((v) => {
      if (!(v.price > 0)) list.push(`La variante "${v.name}" necesita precio`)
    })
    const qtys = new Set<number>()
    form.offers.forEach((o, i) => {
      if (!Number.isInteger(o.quantity) || o.quantity < 1) list.push(`Oferta ${i + 1}: cantidad inválida`)
      if (qtys.has(o.quantity)) list.push(`Hay dos ofertas para ${o.quantity} unidades`)
      qtys.add(o.quantity)
      if (!(o.unitPrice > 0)) list.push(`Oferta ${i + 1}: precio unitario inválido`)
    })
    if (form.offers.length && form.offers.filter((o) => o.isDefault).length !== 1)
      list.push('Marca exactamente una oferta como predeterminada')
    form.faqs.forEach((f, i) => {
      if (!f.question.trim() || !f.answer.trim()) list.push(`La pregunta frecuente ${i + 1} está incompleta`)
    })
    return list
  }

  function toPatch(): Partial<Product> {
    const variants = (product.value?.variants || []).map((v) => {
      const edited = form.variants.find((f) => f._id === v._id)
      return edited
        ? { ...v, price: dollarsToCents(edited.price), compareAtPrice: dollarsToCents(edited.compareAtPrice) }
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
      variants,
      offers: [...form.offers]
        .sort((a, b) => a.quantity - b.quantity)
        .map((o) => ({ ...o, label: o.label.trim(), unitPrice: dollarsToCents(o.unitPrice) })),
      benefits: form.benefits.map((b) => b.trim()).filter(Boolean),
      faqs: form.faqs.map((f) => ({ question: f.question.trim(), answer: f.answer.trim() })),
      images: form.images,
      isPublished: form.isPublished,
      isFeatured: form.isFeatured,
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

  onMounted(load)

  return { product, form, loading, loadError, saving, uploading, errors, cost, margin, belowCost, load, save, uploadImage }
}
