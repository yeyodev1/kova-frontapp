import APIBase from './httpBase'
import type { Paginated } from '@/types'
import type {
  Incident,
  IncidentFilters,
  IncidentPatch,
  IncidentSummary,
  NewIncidentInput,
} from '@/types/incidents'

/** Bandeja de incidencias del panel. Todas las rutas exigen sesión de admin. */
class IncidentService extends APIBase {
  async list(filters: IncidentFilters): Promise<Paginated<Incident>> {
    const params: Record<string, string | number> = { page: filters.page }
    // Sin `status` el API devuelve abiertas + en curso.
    if (filters.status !== 'active') params.status = filters.status
    if (filters.type) params.type = filters.type
    if (filters.severity) params.severity = filters.severity
    if (filters.q.trim()) params.q = filters.q.trim()
    const { data } = await this.get<Paginated<Incident>>('admin/incidents', undefined, { params })
    return data
  }

  async summary(): Promise<IncidentSummary> {
    const { data } = await this.get<IncidentSummary>('admin/incidents/summary')
    return data
  }

  async detail(id: string): Promise<Incident> {
    const { data } = await this.get<Incident>(`admin/incidents/${id}`)
    return data
  }

  async create(input: NewIncidentInput): Promise<Incident> {
    const { data } = await this.post<Incident>('admin/incidents', input)
    return data
  }

  async update(id: string, patch: IncidentPatch): Promise<Incident> {
    const { data } = await this.put<Incident>(`admin/incidents/${id}`, patch)
    return data
  }

  async addNote(id: string, text: string): Promise<Incident> {
    const { data } = await this.post<Incident>(`admin/incidents/${id}/notes`, { text })
    return data
  }
}

export const incidentService = new IncidentService()
