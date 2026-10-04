import { computed, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { errorMessage } from './format'

interface ExportFilters {
  status: string
  paymentMethod: string
  q: string
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  // Safari necesita que la URL siga viva un momento después del click.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Exportar pedidos a CSV para Dropi: con los filtros de la lista o solo los marcados. */
export function useOrdersExport(filters: ExportFilters) {
  const toast = useToastStore()
  const selecting = ref(false)
  const selected = ref<Set<string>>(new Set())
  const exporting = ref(false)

  const count = computed(() => selected.value.size)

  function toggle(id: string) {
    const next = new Set(selected.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    selected.value = next
  }

  function selectAll(ids: string[]) {
    const allIn = ids.every((id) => selected.value.has(id))
    const next = new Set(selected.value)
    for (const id of ids) {
      if (allIn) next.delete(id)
      else next.add(id)
    }
    selected.value = next
  }

  function toggleSelecting() {
    selecting.value = !selecting.value
    if (!selecting.value) selected.value = new Set()
  }

  async function exportCsv() {
    if (exporting.value) return
    exporting.value = true
    try {
      const params = count.value
        ? { ids: [...selected.value].join(',') }
        : {
            // Sin estado elegido el backend exporta los confirmados que faltan en Dropi.
            status: filters.status || undefined,
            paymentMethod: filters.paymentMethod || undefined,
            q: filters.q.trim() || undefined,
          }
      const { blob, filename, count: rows } = await adminService.exportOrdersCsv(params)
      if (rows === 0) {
        toast.info(
          filters.status
            ? 'No hay pedidos con estos filtros para exportar'
            : 'No hay pedidos confirmados pendientes de crear en Dropi',
        )
        return
      }
      download(blob, filename)
      toast.success(
        rows === 1
          ? 'Exportado 1 pedido'
          : rows > 0
            ? `Exportados ${rows} pedidos`
            : 'Archivo descargado',
      )
    } catch (e) {
      toast.error(errorMessage(e, 'No se pudo exportar'))
    } finally {
      exporting.value = false
    }
  }

  return { selecting, selected, count, exporting, toggle, selectAll, toggleSelecting, exportCsv }
}
