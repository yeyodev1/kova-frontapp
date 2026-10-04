import APIBase from './httpBase'
import type {
  CartLine,
  City,
  CreateOrderPayload,
  CreateOrderResponse,
  Order,
  Paginated,
  PaymentMethod,
  Product,
  ProductDetail,
  Province,
  Quote,
  StoreSettings,
} from '@/types'

export interface ProductQuery {
  page?: number
  limit?: number
  category?: string
  q?: string
  featured?: boolean
  sort?: 'popular' | 'price_asc' | 'price_desc' | 'new'
}

/** API pública de la tienda: catálogo, ubicaciones, checkout y seguimiento. */
class StoreService extends APIBase {
  async settings(): Promise<StoreSettings> {
    const { data } = await this.get<StoreSettings>('store/settings')
    return data
  }

  async products(query: ProductQuery = {}): Promise<Paginated<Product>> {
    const params = { ...query, featured: query.featured ? 1 : undefined }
    const { data } = await this.get<Paginated<Product>>('products', undefined, { params })
    return data
  }

  async categories(): Promise<string[]> {
    const { data } = await this.get<string[]>('products/categories')
    return data
  }

  async product(slug: string): Promise<ProductDetail> {
    const { data } = await this.get<ProductDetail>(`products/${encodeURIComponent(slug)}`)
    return data
  }

  async provinces(): Promise<Province[]> {
    const { data } = await this.get<Province[]>('locations/provinces')
    return data
  }

  async cities(provinceId: number): Promise<City[]> {
    const { data } = await this.get<City[]>(`locations/provinces/${provinceId}/cities`)
    return data
  }

  async quote(items: CartLine[], paymentMethod: PaymentMethod): Promise<Quote> {
    const { data } = await this.post<Quote>('checkout/quote', { items, paymentMethod })
    return data
  }

  async lead(phone: string, firstName: string, items: CartLine[]): Promise<void> {
    await this.post('checkout/lead', { phone, firstName, items })
  }

  async createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    const { data } = await this.post<CreateOrderResponse>('orders', payload, undefined, {
      timeout: 30000,
    })
    return data
  }

  async confirmPayment(
    id: string,
    clientTransactionId: string,
  ): Promise<{ order: Order; approved: boolean }> {
    const { data } = await this.post<{ order: Order; approved: boolean }>(
      'orders/confirm',
      { id, clientTransactionId },
      undefined,
      { timeout: 30000 },
    )
    return data
  }

  async uploadReceipt(number: string, phone: string, file: File): Promise<Order> {
    const form = new FormData()
    form.append('receipt', file)
    form.append('phone', phone)
    const { data } = await this.post<Order>(`orders/${encodeURIComponent(number)}/receipt`, form)
    return data
  }

  async track(number: string, phone: string): Promise<Order> {
    const { data } = await this.get<Order>('orders/track', undefined, { params: { number, phone } })
    return data
  }
}

export const storeService = new StoreService()
