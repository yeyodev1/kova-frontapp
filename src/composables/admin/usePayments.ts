import { computed, onMounted, reactive, ref } from 'vue'
import { paymentsCopy as copy } from '@/config/paymentsAdmin'
import {
  paymentsService,
  type AdminBankAccount,
  type BankAccountType,
  type PaymentsState,
} from '@/services/payments.service'
import { useToastStore } from '@/stores/toast'
import { centsToDollars, dollarsToCents } from '@/utils/money'
import { errorMessage } from './format'

export interface AccountDraft {
  bankCode: string
  bank: string
  type: BankAccountType
  number: string
  holder: string
  idNumber: string
}

const OTHER = 'otro'
const digits = (value: string) => value.replace(/\D/g, '')
const emptyDraft = (): AccountDraft => ({ bankCode: '', bank: '', type: 'Ahorros', number: '', holder: '', idNumber: '' })

/** Errores en vivo del formulario de cuenta (mismas reglas que el backapp). */
export function draftErrors(d: AccountDraft): Partial<Record<keyof AccountDraft, string>> {
  const e: Partial<Record<keyof AccountDraft, string>> = {}
  if (!d.bankCode) e.bankCode = copy.errors.bank
  if (d.bankCode === OTHER && !d.bank.trim()) e.bank = copy.errors.otherName
  if (!/^\d{5,20}$/.test(d.number.replace(/[\s-]/g, ''))) e.number = copy.errors.number
  if (d.holder.trim().length < 3) e.holder = copy.errors.holder
  const id = digits(d.idNumber)
  if (id.length !== 10 && id.length !== 13) e.idNumber = copy.errors.idNumber
  return e
}

/** Estado y acciones de /admin/pagos: interruptor, recargo, cuentas y formulario. */
export function usePayments() {
  const toast = useToastStore()
  const state = ref<PaymentsState | null>(null)
  const loading = ref(true)
  const loadError = ref('')
  const switching = ref(false)
  const busyId = ref('')

  const surcharge = ref(0)
  const savingSurcharge = ref(false)

  const formOpen = ref(false)
  const formNotice = ref('')
  const editing = ref<AdminBankAccount | null>(null)
  const draft = reactive<AccountDraft>(emptyDraft())
  const touched = ref(false)
  const saving = ref(false)
  // El admin intentó encender sin cuentas: al guardar la primera, se enciende solo.
  let activateAfterSave = false

  const toDelete = ref<AdminBankAccount | null>(null)
  const deleting = ref(false)

  const accounts = computed(() => state.value?.accounts || [])
  const activeAccounts = computed(() => accounts.value.filter((a) => a.active))
  const errors = computed(() => draftErrors(draft))
  // En vivo: el error aparece apenas el campo tiene algo; los vacíos, al intentar guardar.
  const visibleErrors = computed(() => {
    if (touched.value) return errors.value
    const typed = Object.entries(errors.value).filter(([key]) => String(draft[key as keyof AccountDraft]).trim())
    return Object.fromEntries(typed) as Partial<Record<keyof AccountDraft, string>>
  })

  function apply(next: PaymentsState) {
    state.value = next
    surcharge.value = centsToDollars(next.transferSurcharge)
  }

  async function load() {
    loading.value = true
    loadError.value = ''
    try {
      apply(await paymentsService.load())
    } catch (e) {
      loadError.value = errorMessage(e, 'No se pudieron cargar los pagos')
    } finally {
      loading.value = false
    }
  }

  async function setTransfers(on: boolean) {
    if (on && !activeAccounts.value.length) {
      activateAfterSave = true
      openForm(null, copy.needsAccount)
      return
    }
    switching.value = true
    try {
      apply(await paymentsService.update({ acceptTransfers: on }))
      toast.success(on ? copy.activated : copy.deactivated)
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      switching.value = false
    }
  }

  async function saveSurcharge() {
    if (!(surcharge.value >= 0)) return toast.error('El recargo no puede ser negativo')
    savingSurcharge.value = true
    try {
      apply(await paymentsService.update({ transferSurcharge: dollarsToCents(surcharge.value) }))
      toast.success(copy.surchargeSaved)
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      savingSurcharge.value = false
    }
  }

  function openForm(account: AdminBankAccount | null, notice = '') {
    editing.value = account
    formNotice.value = notice
    touched.value = false
    const { bankCode, bank, type, number, holder, idNumber } = account || emptyDraft()
    Object.assign(draft, { bankCode, bank, type, number, holder, idNumber })
    if (!notice) activateAfterSave = false
    formOpen.value = true
  }

  function closeForm() {
    formOpen.value = false
    activateAfterSave = false
  }

  async function saveAccount() {
    touched.value = true
    if (Object.keys(errors.value).length) return
    saving.value = true
    const payload = {
      bankCode: draft.bankCode,
      bank: draft.bank.trim(),
      type: draft.type,
      number: draft.number.replace(/[\s-]/g, ''),
      holder: draft.holder.trim(),
      idNumber: digits(draft.idNumber),
    }
    try {
      const next = editing.value
        ? await paymentsService.updateAccount(editing.value._id, payload)
        : await paymentsService.createAccount({ ...payload, active: true })
      apply(next)
      toast.success(copy.saved)
      const activate = activateAfterSave
      closeForm()
      if (activate) await setTransfers(true)
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      saving.value = false
    }
  }

  async function toggleAccount(account: AdminBankAccount) {
    busyId.value = account._id
    try {
      apply(await paymentsService.updateAccount(account._id, { active: !account.active }))
      toast.success(account.active ? copy.accountPaused : copy.accountResumed)
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      busyId.value = ''
    }
  }

  async function confirmDelete() {
    const target = toDelete.value
    if (!target) return
    deleting.value = true
    try {
      apply(await paymentsService.deleteAccount(target._id))
      toast.success(copy.deleted)
      toDelete.value = null
    } catch (e) {
      toast.error(errorMessage(e))
      toDelete.value = null
    } finally {
      deleting.value = false
    }
  }

  onMounted(load)

  return {
    state,
    loading,
    loadError,
    load,
    switching,
    busyId,
    accounts,
    activeAccounts,
    setTransfers,
    surcharge,
    savingSurcharge,
    saveSurcharge,
    formOpen,
    formNotice,
    editing,
    draft,
    visibleErrors,
    saving,
    openForm,
    closeForm,
    saveAccount,
    toggleAccount,
    toDelete,
    deleting,
    confirmDelete,
  }
}
