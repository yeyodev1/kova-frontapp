import { reactive, ref, watch } from 'vue'
import { incidentService } from '@/services/incident.service'
import { adminService, type TeamMember } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { incidentCopy } from '@/components/admin/incidents/incidentMeta'
import { useAdminBadges } from './useAdminBadges'
import { errorMessage } from './format'
import type {
  Incident,
  IncidentFilters,
  IncidentPatch,
  IncidentStatus,
  NewIncidentInput,
} from '@/types/incidents'

/**
 * Bandeja de incidencias: lista con filtros, detalle seleccionado y acciones
 * (tomar, resolver, descartar, asignar, severidad, notas). Cada cambio refresca
 * la lista y el badge del menú.
 */
export function useIncidents() {
  const toast = useToastStore()
  const { refresh: refreshBadges, incidents: summary } = useAdminBadges()

  const filters = reactive<IncidentFilters>({ status: 'active', type: '', severity: '', q: '', page: 1 })
  const items = ref<Incident[]>([])
  const total = ref(0)
  const pages = ref(1)
  const loading = ref(false)
  const error = ref('')

  const selectedId = ref('')
  const selected = ref<Incident | null>(null)
  const detailLoading = ref(false)
  const busy = ref('')
  const team = ref<TeamMember[]>([])

  async function load(page = filters.page) {
    filters.page = page
    loading.value = true
    error.value = ''
    try {
      const data = await incidentService.list(filters)
      items.value = data.items
      total.value = data.total
      pages.value = data.pages || 1
    } catch (e) {
      error.value = errorMessage(e, 'No se pudieron cargar las incidencias')
    } finally {
      loading.value = false
    }
  }

  async function select(id: string) {
    selectedId.value = id
    if (!id) {
      selected.value = null
      return
    }
    detailLoading.value = true
    try {
      selected.value = await incidentService.detail(id)
    } catch (e) {
      toast.error(errorMessage(e, 'No se pudo abrir la incidencia'))
      selectedId.value = ''
      selected.value = null
    } finally {
      detailLoading.value = false
    }
  }

  // La tarjeta de la lista se actualiza con lo que devuelve el API, sin recargar todo.
  function apply(updated: Incident) {
    selected.value = updated
    const index = items.value.findIndex((item) => item._id === updated._id)
    if (index >= 0) items.value[index] = { ...items.value[index], ...updated }
  }

  async function run(key: string, action: () => Promise<Incident>, done: string) {
    if (!selected.value || busy.value) return false
    busy.value = key
    try {
      apply(await action())
      toast.success(done)
      void refreshBadges()
      return true
    } catch (e) {
      toast.error(errorMessage(e))
      return false
    } finally {
      busy.value = ''
    }
  }

  const patch = (key: string, body: IncidentPatch, done: string) =>
    run(key, () => incidentService.update(selectedId.value, body), done)

  const setStatus = (status: IncidentStatus) => patch(status, { status }, incidentCopy.done[status])
  const assign = (userId: string) => patch('assignee', { assignee: userId || null }, incidentCopy.done.saved)
  const setSeverity = (severity: Incident['severity']) => patch('severity', { severity }, incidentCopy.done.saved)
  const addNote = (text: string) =>
    run('note', () => incidentService.addNote(selectedId.value, text), incidentCopy.done.note)

  async function create(input: NewIncidentInput) {
    try {
      const created = await incidentService.create(input)
      toast.success(incidentCopy.done.created)
      void refreshBadges()
      await load(1)
      await select(created._id)
      return true
    } catch (e) {
      toast.error(errorMessage(e))
      return false
    }
  }

  async function loadTeam() {
    try {
      team.value = (await adminService.team()).filter((member) => member.isActive)
    } catch {
      team.value = []
    }
  }

  // Filtros: estado, tipo y severidad recargan al toque; la búsqueda espera a que deje de escribir.
  watch(
    () => [filters.status, filters.type, filters.severity],
    () => load(1),
  )
  let timer: ReturnType<typeof setTimeout> | undefined
  watch(
    () => filters.q,
    () => {
      clearTimeout(timer)
      timer = setTimeout(() => load(1), 350)
    },
  )

  return {
    filters,
    items,
    total,
    pages,
    loading,
    error,
    summary,
    selectedId,
    selected,
    detailLoading,
    busy,
    team,
    load,
    select,
    setStatus,
    assign,
    setSeverity,
    addNote,
    create,
    loadTeam,
    refreshBadges,
  }
}
