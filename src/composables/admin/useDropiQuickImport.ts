import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { errorMessage } from './format'

/** Un id (`12345`) o algo que parezca link de Dropi con un número de 3+ dígitos. */
function looksValid(text: string): boolean {
  return /^\d+$/.test(text) || /\d{3,}/.test(text)
}

/** Importa por id o link de Dropi y lleva directo al editor del producto. */
export function useDropiQuickImport(markup: Ref<number>) {
  const router = useRouter()
  const toast = useToastStore()

  const reference = ref('')
  const importing = ref(false)
  const error = ref('')

  async function submit() {
    const text = reference.value.trim()
    error.value = ''
    if (!text) {
      error.value = 'Pega el ID o el link del producto en Dropi'
      return
    }
    if (!looksValid(text)) {
      error.value =
        'No veo un ID ahí. Pega solo el número (ej. 12345) o el link completo del producto'
      return
    }
    importing.value = true
    try {
      const product = await adminService.importFromDropi(text, markup.value)
      toast.success(`${product.title} quedó guardado como borrador`)
      reference.value = ''
      router.push(`/admin/productos/${product._id}`)
    } catch (e) {
      error.value = errorMessage(e, 'No se pudo importar el producto')
    } finally {
      importing.value = false
    }
  }

  return { reference, importing, error, submit }
}
