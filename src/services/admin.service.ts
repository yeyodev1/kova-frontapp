import APIBase from './httpBase'
import type {
  DashboardStats,
  DropiCatalogItem,
  Lead,
  Order,
  Paginated,
  Product,
  StoreSettings,
} from '@/types'

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

  async importFromDropi(dropiId: number, markupPercent?: number): Promise<Product> {
    const { data } = await this.post<Product>(
      'admin/dropi/import',
      { dropiId, markupPercent },
      undefined,
      { timeout: 30000 },
    )
    return data
  }

  async syncDropi(what: 'products' | 'locations' | 'orders'): Promise<Record<string, unknown>> {
    const { data } = await this.post<Record<string, unknown>>(`admin/dropi/sync-${what}`, {}, undefined, {
      timeout: 60000,
    })
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

  async updateProduct(id: string, patch: Partial<Product>): Promise<Product> {
    const { data } = await this.put<Product>(`admin/products/${id}`, patch)
    return data
  }

  async deleteProduct(id: string): Promise<void> {
    await this.delete(`admin/products/${id}`)
  }

  async uploadProductImage(id: string, file: File): Promise<Product> {
    const form = new FormData()
    form.append('image', file)
    const { data } = await this.post<Product>(`admin/products/${id}/images`, form)
    return data
  }

  // ─── Órdenes ────────────────────────────────────────────
  async orders(params: { status?: string; paymentMethod?: string; q?: string; page?: number }) {
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
}

export const adminService = new AdminService()
