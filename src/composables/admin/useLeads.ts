import { onMounted, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import type { CartLine, Lead } from '@/types'
import { errorMessage } from './format'
import { waLink } from './whatsapp'

// El backend puede poblar los items con título/imagen; si no, solo vienen ids.
export type LeadItem = CartLine & { title?: string; image?: string; variantName?: string }

export function useLeads() {
  const items = ref<Lead[]>([])
  const page = ref(1)
  const pages = ref(1)
  const total = ref(0)
  const loading = ref(false)
  const error = ref('')

  async function load(p = page.value) {
    page.value = p
    loading.value = true
    error.value = ''
    try {
      const data = await adminService.leads(p)
      // Solo interesan los que no compraron.
      items.value = data.items.filter((l) => !l.converted)
      total.value = data.total
      pages.value = data.pages || 1
    } catch (e) {
      error.value = errorMessage(e, 'No se pudieron cargar los carritos')
    } finally {
      loading.value = false
    }
  }

  function leadItems(lead: Lead): LeadItem[] {
    return lead.items as LeadItem[]
  }

  function recoveryLink(lead: Lead): string {
    const names = leadItems(lead)
      .map((i) => i.title)
      .filter(Boolean)
    const what = names.length ? names.join(', ') : 'tus productos'
    const hi = lead.firstName ? `Hola ${lead.firstName}` : 'Hola'
    const message =
      `${hi}, te saluda Kova. Vimos que dejaste ${what} en tu carrito. ` +
      '¿Te ayudamos a terminar tu pedido? Te lo enviamos a todo Ecuador y puedes pagar contra entrega. ' +
      'Si tienes alguna duda, aquí estamos.'
    return waLink(lead.phone, message)
  }

  onMounted(() => load(1))

  return { items, page, pages, total, loading, error, load, leadItems, recoveryLink }
}
