import { ref } from 'vue'

/**
 * Avisa cuando se publica una versión nueva de la tienda mientras alguien la tiene abierta.
 * Compara la versión de este build con /version.json (sin caché) al volver a la pestaña,
 * al navegar y cada 2 minutos. Estado de módulo: un solo vigilante para toda la app.
 */
export const updateAvailable = ref(false)

const CHECK_EVERY_MS = 2 * 60 * 1000
let started = false
let lastCheck = 0

async function check(): Promise<void> {
  if (updateAvailable.value || Date.now() - lastCheck < 15_000) return
  lastCheck = Date.now()
  try {
    const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) return
    const { version } = (await res.json()) as { version?: string }
    if (version && version !== __APP_VERSION__) updateAvailable.value = true
  } catch {
    // Sin conexión: se reintenta en el próximo chequeo.
  }
}

export function startVersionWatch(): void {
  if (started || import.meta.env.DEV) return
  started = true
  window.setInterval(check, CHECK_EVERY_MS)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') check()
  })
  check()
}

/** Se llama en cada cambio de página: un chequeo barato, limitado a uno cada 15 s. */
export function checkVersionNow(): void {
  if (started) check()
}

export function reloadApp(): void {
  window.location.reload()
}

/**
 * Tras publicar, los archivos viejos de una página dejan de existir y la navegación falla
 * ("Failed to fetch dynamically imported module"). Se recarga una vez hacia la página pedida.
 */
export function isStaleChunkError(error: unknown): boolean {
  const message = String((error as Error)?.message || error)
  return /dynamically imported module|Importing a module script failed|Failed to load module script|error loading dynamically/i.test(
    message,
  )
}
