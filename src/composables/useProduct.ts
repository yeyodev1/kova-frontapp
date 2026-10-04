import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeService } from '@/services/store.service'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { track } from '@/utils/pixel'
import { site, productCopy } from '@/config/site'
import type { ApiError, ProductDetail, ProductOffer } from '@/types'

export interface OfferOption extends ProductOffer {
  total: number
  compareTotal: number
  savings: number
}

/** Estado de la página de producto: carga, variante, oferta por cantidad y compra. */
export function useProduct() {
  const route = useRoute()
  const router = useRouter()
  const cart = useCartStore()
  const toast = useToastStore()

  const product = ref<ProductDetail | null>(null)
  const loading = ref(true)
  const notFound = ref(false)
  const variantId = ref<string | null>(null)
  const quantity = ref(1)

  const variant = computed(
    () => product.value?.variants.find((v) => v._id === variantId.value) || null,
  )
  const isVariable = computed(
    () => product.value?.type === 'VARIABLE' && (product.value?.variants.length || 0) > 0,
  )
  const price = computed(() => variant.value?.price || product.value?.price || 0)
  const compareAt = computed(() => {
    const value = variant.value ? variant.value.compareAtPrice : product.value?.compareAtPrice || 0
    return value > price.value ? value : 0
  })
  const stock = computed(() => (variant.value ? variant.value.stock : product.value?.stock || 0))
  const inStock = computed(() => stock.value > 0)
  const lowStock = computed(() => inStock.value && stock.value <= productCopy.lowStockThreshold)

  /** Ofertas por cantidad con totales calculados; sin ofertas, una de 1 unidad. */
  const offers = computed<OfferOption[]>(() => {
    const p = product.value
    if (!p) return []
    const base = price.value
    const reference = compareAt.value || base
    const list: ProductOffer[] = p.offers.length
      ? [...p.offers].sort((a, b) => a.quantity - b.quantity)
      : [{ quantity: 1, unitPrice: base, label: '', isDefault: true }]
    return list.map((offer) => {
      // La oferta de 1 unidad sigue el precio de la variante elegida.
      const unit = offer.quantity === 1 ? base : offer.unitPrice
      const total = unit * offer.quantity
      const compareTotal = reference * offer.quantity
      return {
        ...offer,
        unitPrice: unit,
        total,
        compareTotal,
        savings: Math.max(0, compareTotal - total),
      }
    })
  })
  const selectedOffer = computed(
    () => offers.value.find((o) => o.quantity === quantity.value) || offers.value[0] || null,
  )
  const total = computed(() => selectedOffer.value?.total || price.value * quantity.value)

  function pickDefaults(p: ProductDetail) {
    const firstInStock = p.variants.find((v) => v.stock > 0) || p.variants[0]
    variantId.value = p.type === 'VARIABLE' && firstInStock ? firstInStock._id : null
    const defaultOffer = p.offers.find((o) => o.isDefault) || p.offers[0]
    quantity.value = defaultOffer?.quantity || 1
  }

  async function load(slug: string) {
    loading.value = true
    notFound.value = false
    product.value = null
    try {
      const data = await storeService.product(slug)
      product.value = data
      pickDefaults(data)
      document.title = `${data.title} — ${site.name}`
      track('ViewContent', {
        content_ids: [data._id],
        content_name: data.title,
        content_type: 'product',
        value: data.price / 100,
        currency: 'USD',
      })
    } catch (e) {
      const err = e as ApiError
      notFound.value = true
      if (err.status !== 404) toast.error(err.message)
    } finally {
      loading.value = false
    }
  }

  function canBuy(): boolean {
    if (!product.value) return false
    if (isVariable.value && !variant.value) {
      toast.info(productCopy.variantTitle)
      return false
    }
    if (!inStock.value) {
      toast.info(productCopy.soldOut)
      return false
    }
    return true
  }

  function buyNow() {
    if (!canBuy() || !product.value) return
    cart.buyNow(product.value, variantId.value, quantity.value)
    router.push('/checkout')
  }

  function addToCart() {
    if (!canBuy() || !product.value) return
    cart.add(product.value, variantId.value, quantity.value)
  }

  watch(
    () => route.params.slug,
    (slug) => {
      if (typeof slug === 'string' && slug) load(slug)
    },
    { immediate: true },
  )

  return {
    product,
    loading,
    notFound,
    variantId,
    quantity,
    variant,
    isVariable,
    price,
    compareAt,
    stock,
    inStock,
    lowStock,
    offers,
    selectedOffer,
    total,
    buyNow,
    addToCart,
  }
}
