import APIBase from './httpBase'
import type {
  DashboardStats,
  DropiManualInput,
  DropiCatalogItem,
  DropiClipProduct,
  DropiClipResult,
  DropiLinkedProduct,
  DropiStatus,
  Lead,
  Order,
  Paginated,
  Product,
  ShippingInput,
  StoreSettings,
} from '@/types'

/** Administrador y qué avisos por correo recibe: pedidos y asesor del bot. */
export interface TeamMember {
  _id: string
  name: string
  email: string
  isActive: boolean
  notifyOrders: boolean
  notifyHumanRequests: boolean
}

export type TeamAlertsPatch = Partial<Pick<TeamMember, 'notifyOrders' | 'notifyHumanRequests'>>

/** Panel de administración. Todas las rutas exigen sesión de admin. */
class AdminService extends APIBase {
  async dashboard(): Promise<DashboardStats> {
    const { data } = await this.get<DashboardStats>('admin/dashboard')
    return data
  }

  // ─── Dropi ──────────────────────────────────────────────
  async dropiCatalog(params: { q?: string; page?: number; limit?: number }) {
    const { data } = await this.get<{ items: DropiCatalogItem[]; total: number }>(
      'admin/dropi/products',
      undefined,
      { params, timeout: 30000 },
    )
    return data
  }

  /** Una llamada liviana a Dropi, cacheada 60 s en el backend; `refresh` la salta. */
  async dropiStatus(refresh = false): Promise<DropiStatus> {
    const { data } = await this.get<DropiStatus>('admin/dropi/status', undefined, {
      params: refresh ? { refresh: 1 } : undefined,
      timeout: 30000,
    })
    return data
  }

  /** Acepta el id de Dropi o un link de producto: el backend extrae el id del link. */
  async importFromDropi(ref: number | string, markupPercent?: number): Promise<Product> {
    const body =
      typeof ref === 'number' || /^\d+$/.test(ref.trim())
        ? { dropiId: Number(ref) }
        : { url: ref.trim() }
    const { data } = await this.post<Product>(
      'admin/dropi/import',
      { ...body, markupPercent },
      undefined,
      { timeout: 30000 },
    )
    return data
  }

  /** Botón "Enviar a Kova": guarda lo que el dueño leyó en Dropi. Máximo 60 por llamada. */
  async dropiClip(
    products: DropiClipProduct[],
    markupPercent?: number,
  ): Promise<{ results: DropiClipResult[] }> {
    const { data } = await this.post<{ results: DropiClipResult[] }>(
      'admin/dropi/clip',
      { products, markupPercent },
      undefined,
      { timeout: 60000 },
    )
    return data
  }

  /** Cuáles de estos ids de Dropi ya están en la tienda. */
  async dropiLinked(ids: number[]): Promise<DropiLinkedProduct[]> {
    if (!ids.length) return []
    const { data } = await this.get<{ items: DropiLinkedProduct[] }>(
      'admin/dropi/linked',
      undefined,
      { params: { ids: ids.join(',') } },
    )
    return data.items
  }

  async syncDropi(what: 'products' | 'locations' | 'orders'): Promise<Record<string, unknown>> {
    const { data } = await this.post<Record<string, unknown>>(
      `admin/dropi/sync-${what}`,
      {},
      undefined,
      {
        timeout: 60000,
      },
    )
    return data
  }

  // ─── Productos ──────────────────────────────────────────
  async products(params: { q?: string; page?: number; published?: boolean }) {
    const { data } = await this.get<Paginated<Product>>('admin/products', undefined, { params })
    return data
  }

  async product(id: string): Promise<Product> {
    const { data } = await this.get<Product>(`admin/products/${id}`)
    return data
  }

  /** Producto manual (borrador). Sirve mientras la API de Dropi no esté habilitada. */
  async createProduct(data: Partial<Product> & { title: string }): Promise<Product> {
    const { data: created } = await this.post<Product>('admin/products', data)
    return created
  }

  async updateProduct(id: string, patch: Partial<Product>): Promise<Product> {
    const { data } = await this.put<Product>(`admin/products/${id}`, patch)
    return data
  }

  async deleteProduct(id: string): Promise<void> {
    await this.delete(`admin/products/${id}`)
  }

  /** Trae de Dropi stock, costo y variantes nuevas de un producto enlazado. */
  async syncProductFromDropi(id: string): Promise<Product> {
    const { data } = await this.post<Product>(`admin/products/${id}/sync-dropi`, {}, undefined, {
      timeout: 30000,
    })
    return data
  }

  async uploadProductImage(id: string, file: File): Promise<Product> {
    const form = new FormData()
    form.append('image', file)
    const { data } = await this.post<Product>(`admin/products/${id}/images`, form)
    return data
  }

  /** Sube una foto antes de crear el producto ("Subir producto"): devuelve su link de Cloudinary. */
  async uploadImage(file: Blob, onProgress?: (percent: number) => void): Promise<string> {
    const form = new FormData()
    form.append('image', file, file instanceof File ? file.name : 'foto.jpg')
    const { data } = await this.post<{ url: string }>('admin/uploads/image', form, undefined, {
      timeout: 120000,
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100))
      },
    })
    return data.url
  }

  /** Categorías usadas en la tienda, incluidas las de borradores. */
  async productCategories(): Promise<string[]> {
    const { data } = await this.get<string[]>('admin/products/categories')
    return data
  }

  // ─── Órdenes ────────────────────────────────────────────
  async orders(params: {
    status?: string
    paymentMethod?: string
    q?: string
    page?: number
    dropiError?: number
    todo?: number
  }) {
    const { data } = await this.get<Paginated<Order>>('admin/orders', undefined, { params })
    return data
  }

  async order(id: string): Promise<Order> {
    const { data } = await this.get<Order>(`admin/orders/${id}`)
    return data
  }

  async orderAction(id: string, action: 'confirm-transfer' | 'send-to-dropi' | 'cancel') {
    const { data } = await this.post<Order>(`admin/orders/${id}/${action}`, {}, undefined, {
      timeout: 30000,
    })
    return data
  }

  /** El pedido ya se creó a mano en app.dropi.ec: guarda id, guía y transportadora. */
  async markCreatedInDropi(id: string, body: DropiManualInput): Promise<Order> {
    const { data } = await this.post<Order>(`admin/orders/${id}/dropi-manual`, body)
    return data
  }

  async updateShipping(id: string, body: ShippingInput): Promise<Order> {
    const { data } = await this.put<Order>(`admin/orders/${id}/shipping`, body)
    return data
  }

  /** CSV para Dropi. Se baja como blob para mandar el Bearer (un link directo no lo lleva). */
  async exportOrdersCsv(params: {
    status?: string
    paymentMethod?: string
    q?: string
    from?: string
    to?: string
    ids?: string
  }): Promise<{ blob: Blob; filename: string; count: number }> {
    try {
      const res = await this.get<Blob>('admin/orders/export', undefined, {
        params,
        responseType: 'blob',
        timeout: 60000,
      })
      const disposition = String(res.headers['content-disposition'] || '')
      const filename = /filename="?([^";]+)"?/.exec(disposition)?.[1] || 'kova-pedidos-dropi.csv'
      return { blob: res.data, filename, count: Number(res.headers['x-orders-count'] ?? -1) }
    } catch (error) {
      // Con responseType blob el { message } del backend llega como Blob: se lee para mostrarlo.
      const err = error as { status?: number; message?: string; data?: unknown }
      if (err.data instanceof Blob) {
        try {
          err.message = JSON.parse(await err.data.text()).message || err.message
        } catch {
          // Se queda el mensaje genérico.
        }
      }
      throw err
    }
  }

  // ─── Leads y ajustes ────────────────────────────────────
  async leads(page = 1) {
    const { data } = await this.get<Paginated<Lead>>('admin/leads', undefined, { params: { page } })
    return data
  }

  async settings(): Promise<StoreSettings> {
    const { data } = await this.get<StoreSettings>('admin/settings')
    return data
  }

  async updateSettings(patch: Partial<StoreSettings>): Promise<StoreSettings> {
    const { data } = await this.put<StoreSettings>('admin/settings', patch)
    return data
  }

  // ─── Equipo ─────────────────────────────────────────────
  async team(): Promise<TeamMember[]> {
    const { data } = await this.get<TeamMember[]>('admin/team')
    return data
  }

  async setTeamAlerts(id: string, patch: TeamAlertsPatch): Promise<TeamMember> {
    const { data } = await this.put<TeamMember>(`admin/team/${id}`, patch)
    return data
  }
}

export const adminService = new AdminService()
