import { computed, reactive, ref } from 'vue'
import { authService } from '@/services/auth.service'
import { errorMessage } from './format'

export const MIN_PASSWORD = 10

// Misma lista que valida el backend al cambiarla.
const OBVIOUS = new Set([
  '123456789',
  '1234567890',
  '12345678',
  '123456',
  '0987654321',
  'password',
  'password123',
  'contraseña',
  'contrasena',
  'kova1234',
  'kova12345',
  'kovastore',
  'qwerty123',
  'qwertyuiop',
  'admin1234',
  'administrador',
])

// Solo se guarda que la contraseña era obvia, nunca la contraseña.
const WEAK_KEY = 'kova_weak_password'

export function isObviousPassword(value: string): boolean {
  return OBVIOUS.has(value.trim().toLowerCase())
}

function readFlag(): boolean {
  try {
    return sessionStorage.getItem(WEAK_KEY) === '1'
  } catch {
    return false
  }
}

function writeFlag(value: boolean) {
  try {
    if (value) sessionStorage.setItem(WEAK_KEY, '1')
    else sessionStorage.removeItem(WEAK_KEY)
  } catch {
    // Modo privado: el aviso dura lo que dure la vista.
  }
}

// Estado de módulo: el banner y el menú abren el mismo modal.
const open = ref(false)
const weak = ref(readFlag())

/** Se llama en el login: marca (o limpia) el aviso según lo que escribió. */
export function rememberPasswordStrength(password: string) {
  weak.value = isObviousPassword(password)
  writeFlag(weak.value)
}

export interface Strength {
  score: 0 | 1 | 2 | 3 | 4
  label: string
}

export function passwordStrength(value: string): Strength {
  if (!value) return { score: 0, label: '' }
  if (isObviousPassword(value) || value.length < 8) return { score: 1, label: 'Muy débil' }
  let points = 0
  if (value.length >= MIN_PASSWORD) points++
  if (value.length >= 14) points++
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) points++
  if (/\d/.test(value)) points++
  if (/[^A-Za-z0-9]/.test(value)) points++
  if (points <= 1) return { score: 1, label: 'Débil' }
  if (points === 2) return { score: 2, label: 'Aceptable' }
  if (points === 3) return { score: 3, label: 'Buena' }
  return { score: 4, label: 'Fuerte' }
}

export function usePasswordChange() {
  const form = reactive({ current: '', next: '', confirm: '' })
  const saving = ref(false)
  const done = ref(false)
  const error = ref('')

  const strength = computed(() => passwordStrength(form.next))

  // Mensajes en vivo: solo aparecen cuando el campo ya tiene algo.
  const nextError = computed(() => {
    if (!form.next) return ''
    if (form.next.length < MIN_PASSWORD) {
      return `Faltan ${MIN_PASSWORD - form.next.length} caracteres (mínimo ${MIN_PASSWORD})`
    }
    if (isObviousPassword(form.next)) return 'Es muy fácil de adivinar, elige otra'
    if (form.current && form.next === form.current) return 'Debe ser distinta de la actual'
    return ''
  })

  const confirmError = computed(() =>
    form.confirm && form.confirm !== form.next ? 'No coincide con la nueva' : '',
  )

  const canSubmit = computed(
    () =>
      Boolean(form.current && form.next && form.confirm) &&
      !nextError.value &&
      !confirmError.value &&
      !saving.value,
  )

  function reset() {
    form.current = ''
    form.next = ''
    form.confirm = ''
    error.value = ''
    done.value = false
  }

  function show() {
    reset()
    open.value = true
  }

  function close() {
    open.value = false
  }

  async function submit() {
    if (!canSubmit.value) return
    error.value = ''
    saving.value = true
    try {
      await authService.changePassword(form.current, form.next)
      done.value = true
      weak.value = false
      writeFlag(false)
      form.current = ''
      form.next = ''
      form.confirm = ''
    } catch (e) {
      error.value = errorMessage(e, 'No se pudo cambiar la contraseña')
    } finally {
      saving.value = false
    }
  }

  return {
    open,
    weak,
    form,
    saving,
    done,
    error,
    strength,
    nextError,
    confirmError,
    canSubmit,
    show,
    close,
    submit,
  }
}
