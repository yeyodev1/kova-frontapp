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
    const { required, phone, email, idNumber } = checkoutCopy.errors
    const value = form[field]
    switch (field) {
      case 'firstName':
      case 'lastName':
      case 'street':
        return String(value).trim() ? '' : required
      case 'provinceId':
      case 'cityId':
        return value ? '' : required
      case 'phone':
        if (!String(value).trim()) return required
        return isValidPhone(String(value)) ? '' : phone
      case 'email':
        return !form.email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ? '' : email
      case 'idNumber':
        return !form.idNumber.trim() || /^(\d{10}|\d{13})$/.test(form.idNumber.trim()) ? '' : idNumber
      default:
        return ''
    }
  }

  function validateField(field: CheckoutField) {
    touched[field] = true
    errors[field] = check(field)
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

  const normalizedPhone = computed(() => normalizePhone(form.phone))
  const phoneIsValid = computed(() => isValidPhone(form.phone))

  return { form, errors, touched, validateField, validate, normalizedPhone, phoneIsValid }
}
