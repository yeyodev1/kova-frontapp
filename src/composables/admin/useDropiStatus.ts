import { computed, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { DropiStatus } from '@/types'
import { errorMessage } from './format'

const STORE_URL = 'https://kovashopper.com'

// Estado de módulo: la vista de Dropi y el editor de producto leen la misma conexión.
const status = ref<DropiStatus | null>(null)
const checking = ref(false)
const checkError = ref('')

/** Texto listo para pegar en el chat de soporte de Dropi. */
function supportText(s: DropiStatus): string {
  const lines = [
    'Hola, equipo de soporte de Dropi.',
    `Tengo una integración (tipo WooCommerce) para mi tienda ${STORE_URL}.`,
    `La API de integraciones (https://api.dropi.ec/integrations) me responde 401 "Access denied" desde la IP ${s.blockedIp ?? '(la de mi servidor)'}.`,
    '¿Pueden agregar esa IP a las IPs permitidas de mi integración?',
  ]
  if (s.urlMismatch && s.integrationUrl) {
    lines.push(
      `Además, la integración quedó registrada con ${s.integrationUrl}; la URL correcta de la tienda es ${STORE_URL}.`,
    )
  }
  lines.push('Gracias.')
  return lines.join('\n')
}

async function copy(text: string, what: string) {
  const toast = useToastStore()
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`${what} copiado`)
  } catch {
    toast.error('No se pudo copiar: selecciónalo y cópialo a mano')
  }
}

export function useDropiStatus() {
  async function check(refresh = false) {
    checking.value = true
    checkError.value = ''
    try {
      status.value = await adminService.dropiStatus(refresh)
    } catch (e) {
      checkError.value = errorMessage(e, 'No se pudo consultar el estado de Dropi')
    } finally {
      checking.value = false
    }
  }

  const connected = computed(() => !!status.value?.connected)
  const message = computed(() => status.value && supportText(status.value))

  return {
    status,
    checking,
    checkError,
    connected,
    supportMessage: message,
    check,
    copy,
  }
}
