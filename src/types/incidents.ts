/** Incidencias del panel (GET /admin/incidents). Ver docs/API.md del backend. */

export type IncidentType =
  | 'dropi_error'
  | 'payment_mismatch'
  | 'payment_failed'
  | 'email_failed'
  | 'bot_error'
  | 'customer_complaint'
  | 'human_request'
  | 'receipt_review_stale'
  | 'order_stuck'
  | 'manual'

export type IncidentSeverity = 'high' | 'medium' | 'low'
export type IncidentStatus = 'open' | 'in_progress' | 'resolved' | 'dismissed'
/** `active` = abiertas + en curso (lo que manda el API sin `status`). */
export type IncidentStatusFilter = 'active' | IncidentStatus | 'all'

export interface IncidentNote {
  _id: string
  at: string
  by: string | null
  byName: string
  text: string
}

export interface IncidentAssignee {
  _id: string
  name: string
  email: string
}

export interface Incident {
  _id: string
  number: string
  type: IncidentType
  severity: IncidentSeverity
  title: string
  detail: string
  order: string | null
  orderNumber: string
  phone: string
  customerName: string
  source: 'system' | 'bot' | 'admin'
  status: IncidentStatus
  assignee: IncidentAssignee | null
  notes?: IncidentNote[]
  occurrences: number
  lastSeenAt: string
  resolvedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface IncidentSummary {
  open: number
  in_progress: number
  resolved: number
  dismissed: number
  active: number
  bySeverity: Record<IncidentSeverity, number>
  /** Alta + media sin cerrar: badge del menú. */
  badge: number
}

export interface IncidentFilters {
  status: IncidentStatusFilter
  type: IncidentType | ''
  severity: IncidentSeverity | ''
  q: string
  page: number
}

export interface IncidentPatch {
  status?: IncidentStatus
  assignee?: string | null
  severity?: IncidentSeverity
}

export interface NewIncidentInput {
  title: string
  detail?: string
  severity: IncidentSeverity
  orderNumber?: string
  phone?: string
}
