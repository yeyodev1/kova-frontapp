import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { storeService } from '@/services/store.service'
import { track } from '@/utils/pixel'
import { checkoutCopy } from '@/config/site'
import { useCheckoutForm } from './useCheckoutForm'
import { useLocations } from './useLocations'
import { useQuote } from './useQuote'
import { getUtm } from './useUtm'
import { trackPurchase } from './usePurchaseTracking'
import type { ApiError, Order, PaymentMethod, PayphoneConfig } from '@/types'

// Un lead por celular y por sesión: es para recuperar carritos, no para spamear el API.
const leadsSent = new Set<string>()

/** Orquesta el checkout: datos, ubicación, cotización, método de pago y envío del pedido. */
export function useCheckout() {
  const router = useRouter()
  const cart = useCartStore()
  const toast = useToastStore()

  const { form, errors, validateField, liveValidate, isValid, validate, contactDone, addressDone, normalizedPhone, phoneIsValid } =
    useCheckoutForm()
  const locations = useLocations()
  const method = ref<PaymentMethod>('card')
  const { quote, loading: quoting, error: quoteError } = useQuote(method)

  const processing = ref(false)
  const payphone = ref<PayphoneConfig | null>(null)
  const pendingOrder = ref<Order | null>(null)
  let checkoutTracked = false

  const total = computed(() => quote.value?.total || 0)

  // Indicador de pasos: Datos → Envío → Pago, según lo que ya está completo.
  const stepsDone = computed(() => [contactDone.value, addressDone.value, !!payphone.value])
  const currentStep = computed(() => {
    const index = stepsDone.value.findIndex((done) => !done)
    return index === -1 ? 2 : index
  })

  // InitiateCheckout con el valor real, apenas llega la primera cotización.
  watch(quote, (value) => {
    if (!value || checkoutTracked) return
    checkoutTracked = true
    track('InitiateCheckout', {
      value: value.total / 100,
      currency: 'USD',
      num_items: value.items.reduce((sum, item) => sum + item.quantity, 0),
      content_ids: value.items.map((item) => item.product),
    })
  })

  watch(quoteError, (message) => message && toast.error(message))

  function selectMethod(value: PaymentMethod) {
    if (method.value === value) return
    method.value = value
    track('AddPaymentInfo', { payment_type: value, currency: 'USD', value: total.value / 100 })
  }

  watch(
    () => form.provinceId,
    async (id, previous) => {
      if (previous !== undefined && id !== previous) form.cityId = 0
      try {
        await locations.loadCities(id)
      } catch (e) {
        toast.error((e as ApiError).message)
      }
    },
    { immediate: true },
  )

  // Carrito abandonado: con un celular válido ya se puede recuperar la venta.
  watch(phoneIsValid, (valid) => {
    const phone = normalizedPhone.value
    if (!valid || cart.isEmpty || leadsSent.has(phone)) return
    leadsSent.add(phone)
    storeService.lead(phone, form.firstName.trim(), cart.lines).catch(() => leadsSent.delete(phone))
  }, { immediate: true })

  function buildAddress() {
    const province = locations.provinces.value.find((p) => p.id === form.provinceId)
    const city = locations.cities.value.find((c) => c.id === form.cityId)
    return {
      provinceId: form.provinceId,
      province: province?.name || '',
      cityId: form.cityId,
      city: city?.name || '',
      street: form.street.trim(),
      reference: form.reference.trim(),
    }
  }

  async function focusField(field: string) {
    await nextTick()
    const el = document.getElementById(`checkout-${field}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el?.focus({ preventScroll: true })
  }

  async function submit() {
    if (processing.value || cart.isEmpty) return
    const invalid = validate()
    if (invalid) {
      toast.error(checkoutCopy.errors.form)
      focusField(invalid)
      return
    }
    processing.value = true
    try {
      const { order, payphone: config } = await storeService.createOrder({
        items: cart.lines,
        paymentMethod: method.value,
        customer: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: normalizedPhone.value,
          email: form.email.trim(),
          idNumber: form.idNumber.trim(),
        },
        address: buildAddress(),
        utm: getUtm(),
      })

      if (method.value === 'card' && config) {
        pendingOrder.value = order
        payphone.value = config
        return
      }

      // cod y transfer quedan registrados al crearse: es la conversión.
      trackPurchase(order)
      // Primero se navega y luego se vacía: así no parpadea el "carrito vacío".
      await router.push({ name: 'OrderSuccess', params: { number: order.number }, query: { phone: order.customer.phone } })
      cart.clear()
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      processing.value = false
    }
  }

  /** Vuelve del formulario de Payphone a elegir otro método. */
  function cancelCard() {
    payphone.value = null
    pendingOrder.value = null
  }

  if (!cart.isEmpty) locations.loadProvinces().catch((e) => toast.error((e as ApiError).message))

  return {
    cart,
    form,
    errors,
    validateField,
    liveValidate,
    isValid,
    stepsDone,
    currentStep,
    provinces: locations.provinces,
    cities: locations.cities,
    loadingCities: locations.loadingCities,
    method,
    selectMethod,
    quote,
    quoting,
    total,
    processing,
    payphone,
    pendingOrder,
    submit,
    cancelCard,
  }
}
