import { computed, reactive, watch } from 'vue'
import { checkoutCopy } from '@/config/site'

const STORAGE_KEY = 'kova_checkout_form'

export interface CheckoutForm {
  firstName: string
  lastName: string
  phone: string
  idNumber: string
  email: string
  provinceId: number
  cityId: number
  street: string
  reference: string
}

export type CheckoutField = keyof CheckoutForm

const CONTACT_FIELDS: CheckoutField[] = ['firstName', 'lastName', 'phone', 'idNumber', 'email']
const ADDRESS_FIELDS: CheckoutField[] = ['provinceId', 'cityId', 'street']

/** "+593 99 123 4567", "0991234567", "991234567" → "0991234567". */
export function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, '')
  if (digits.startsWith('593')) digits = '0' + digits.slice(3)
  if (digits.length === 9 && digits.startsWith('9')) digits = '0' + digits
  return digits
}

export function isValidPhone(raw: string): boolean {
  return /^09\d{8}$/.test(normalizePhone(raw))
}

function empty(): CheckoutForm {
  return {
    firstName: '',
    lastName: '',
    phone: '',
    idNumber: '',
    email: '',
    provinceId: 0,
    cityId: 0,
    street: '',
    reference: '',
  }
}

function restore(): CheckoutForm {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...empty(), ...(JSON.parse(raw) as Partial<CheckoutForm>) } : empty()
  } catch {
    return empty()
  }
}

/**
 * Formulario del checkout. Se guarda en el navegador para que quien vuelve
 * (o recarga) no tenga que escribir todo otra vez.
 */
export function useCheckoutForm() {
  const form = reactive<CheckoutForm>(restore())
  const errors = reactive<Partial<Record<CheckoutField, string>>>({})
  const touched = reactive<Partial<Record<CheckoutField, boolean>>>({})
  // Lo que vino guardado de una visita anterior ya cuenta como tocado: se ve el check.
  for (const field of Object.keys(form) as CheckoutField[]) if (form[field]) touched[field] = true

  watch(
    form,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch {
        /* modo privado */
      }
    },
    { deep: true },
  )

  function check(field: CheckoutField): string {
    const e = checkoutCopy.errors
    const value = form[field]
    switch (field) {
      case 'firstName':
      case 'lastName':
      case 'street':
        return String(value).trim() ? '' : e[field]
      case 'provinceId':
      case 'cityId':
        return value ? '' : e[field]
      case 'phone':
        if (!String(value).trim()) return e.phoneRequired
        return isValidPhone(String(value)) ? '' : e.phone
      case 'email':
        return !form.email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ? '' : e.email
      case 'idNumber':
        return !form.idNumber.trim() || /^(\d{10}|\d{13})$/.test(form.idNumber.trim()) ? '' : e.idNumber
      default:
        return ''
    }
  }

  function validateField(field: CheckoutField) {
    touched[field] = true
    errors[field] = check(field)
  }

  /**
   * Validación en vivo amable: mientras escribe no lo regañamos; solo se
   * re-evalúa si el campo ya se tocó (para que el error desaparezca apenas
   * lo corrige y el check aparezca sin esperar al blur).
   */
  function liveValidate(field: CheckoutField) {
    if (!touched[field]) return
    const message = check(field)
    // Un error nuevo espera al blur; uno que se corrige se limpia al instante.
    if (!message || errors[field]) errors[field] = message
  }

  /** Campo con dato y sin error: muestra el check verde. */
  function isValid(field: CheckoutField): boolean {
    return !!touched[field] && !!form[field] && !check(field)
  }

  /** Valida todo y devuelve el primer campo con error (para llevar el foco ahí). */
  function validate(): CheckoutField | null {
    let first: CheckoutField | null = null
    for (const field of Object.keys(form) as CheckoutField[]) {
      validateField(field)
      if (errors[field] && !first) first = field
    }
    return first
  }

  // Progreso real para el indicador de pasos del encabezado.
  const contactDone = computed(() => CONTACT_FIELDS.every((field) => !check(field)))
  const addressDone = computed(() => ADDRESS_FIELDS.every((field) => !check(field)))

  const normalizedPhone = computed(() => normalizePhone(form.phone))
  const phoneIsValid = computed(() => isValidPhone(form.phone))

  return {
    form,
    errors,
    touched,
    validateField,
    liveValidate,
    isValid,
    validate,
    contactDone,
    addressDone,
    normalizedPhone,
    phoneIsValid,
  }
}
