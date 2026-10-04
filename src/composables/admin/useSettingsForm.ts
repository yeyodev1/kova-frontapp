import { onMounted, reactive, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { StoreSettings } from '@/types'
import { centsToDollars, dollarsToCents } from '@/utils/money'
import { errorMessage } from './format'

export interface SettingsForm {
  codSurcharge: number
  shippingFee: number
  freeShippingFrom: number
  announcement: string
  whatsapp: string
  defaultMarkupPercent: number
}

function toForm(s: StoreSettings): SettingsForm {
  return {
    codSurcharge: centsToDollars(s.codSurcharge),
    shippingFee: centsToDollars(s.shippingFee),
    freeShippingFrom: centsToDollars(s.freeShippingFrom),
    announcement: s.announcement || '',
    whatsapp: s.whatsapp || '',
    defaultMarkupPercent: s.defaultMarkupPercent ?? 40,
  }
}

export function useSettingsForm() {
  const toast = useToastStore()
  const form = reactive<SettingsForm>(toForm({} as StoreSettings))
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
    const money = [form.codSurcharge, form.shippingFee, form.freeShippingFrom]
    if (money.some((v) => !(v >= 0))) return 'Los montos no pueden ser negativos'
    const digits = form.whatsapp.replace(/\D/g, '')
    if (digits && !/^593\d{9}$/.test(digits)) return 'El WhatsApp debe tener el formato 5939XXXXXXXX'
    if (!(form.defaultMarkupPercent >= 0)) return 'El margen por defecto no es válido'
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
        shippingFee: dollarsToCents(form.shippingFee),
        freeShippingFrom: dollarsToCents(form.freeShippingFrom),
        announcement: form.announcement.trim(),
        whatsapp: form.whatsapp.replace(/\D/g, ''),
        defaultMarkupPercent: Number(form.defaultMarkupPercent) || 0,
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
