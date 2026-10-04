import { onMounted, reactive, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { BankAccount, StoreSettings } from '@/types'
import { centsToDollars, dollarsToCents } from '@/utils/money'
import { errorMessage } from './format'

export interface SettingsForm {
  codSurcharge: number
  transferSurcharge: number
  shippingFee: number
  freeShippingFrom: number
  announcement: string
  whatsapp: string
  defaultMarkupPercent: number
  bankAccounts: BankAccount[]
}

function toForm(s: StoreSettings): SettingsForm {
  return {
    codSurcharge: centsToDollars(s.codSurcharge),
    transferSurcharge: centsToDollars(s.transferSurcharge),
    shippingFee: centsToDollars(s.shippingFee),
    freeShippingFrom: centsToDollars(s.freeShippingFrom),
    announcement: s.announcement || '',
    whatsapp: s.whatsapp || '',
    defaultMarkupPercent: s.defaultMarkupPercent ?? 40,
    bankAccounts: (s.bankAccounts || []).map((b) => ({ ...b })),
  }
}

export function useSettingsForm() {
  const toast = useToastStore()
  const form = reactive<SettingsForm>(toForm({ bankAccounts: [] } as unknown as StoreSettings))
  const loading = ref(true)
  const loadError = ref('')
  const saving = ref(false)

  async function load() {
    loading.value = true
    loadError.value = ''
    try {
      Object.assign(form, toForm(await adminService.settings()))
    } catch (e) {
      loadError.value = errorMessage(e, 'No se pudieron cargar los ajustes')
    } finally {
      loading.value = false
    }
  }

  function validate(): string | null {
    const money = [form.codSurcharge, form.transferSurcharge, form.shippingFee, form.freeShippingFrom]
    if (money.some((v) => !(v >= 0))) return 'Los montos no pueden ser negativos'
    const digits = form.whatsapp.replace(/\D/g, '')
    if (digits && !/^593\d{9}$/.test(digits)) return 'El WhatsApp debe tener el formato 5939XXXXXXXX'
    if (!(form.defaultMarkupPercent >= 0)) return 'El margen por defecto no es válido'
    const bad = form.bankAccounts.findIndex((b) => !b.bank.trim() || !b.number.trim() || !b.holder.trim())
    if (bad >= 0) return `Completa banco, número y titular de la cuenta ${bad + 1}`
    return null
  }

  async function save() {
    const problem = validate()
    if (problem) {
      toast.error(problem)
      return
    }
    saving.value = true
    try {
      const saved = await adminService.updateSettings({
        codSurcharge: dollarsToCents(form.codSurcharge),
        transferSurcharge: dollarsToCents(form.transferSurcharge),
        shippingFee: dollarsToCents(form.shippingFee),
        freeShippingFrom: dollarsToCents(form.freeShippingFrom),
        announcement: form.announcement.trim(),
        whatsapp: form.whatsapp.replace(/\D/g, ''),
        defaultMarkupPercent: Number(form.defaultMarkupPercent) || 0,
        bankAccounts: form.bankAccounts.map((b) => ({
          bank: b.bank.trim(),
          type: b.type.trim(),
          number: b.number.trim(),
          holder: b.holder.trim(),
          idNumber: b.idNumber.trim(),
        })),
      })
      Object.assign(form, toForm(saved))
      toast.success('Ajustes guardados')
    } catch (e) {
      toast.error(errorMessage(e, 'No se pudieron guardar los ajustes'))
    } finally {
      saving.value = false
    }
  }

  onMounted(load)

  return { form, loading, loadError, saving, load, save }
}
