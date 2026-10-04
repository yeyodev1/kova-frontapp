/** Forma con la que httpBase rechaza cualquier error del API. */
export interface ApiError {
  status: number
  message: string
  data?: unknown
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

/** Lo que devuelve el backapp en /auth/login y /auth/me. */
export interface SessionUser {
  id: string
  email: string
  name: string
  phone: string
  accountType: 'customer' | 'admin' | string
}

// ─── Tienda (ver kova-backapp/docs/API.md) ──────────────────────────────
// Todos los montos son centavos USD.

export type PaymentMethod = 'card' | 'cod' | 'transfer'

export interface ProductVariant {
  _id: string
  dropiVariationId: number | null
  name: string
  attributes: Record<string, string>
  price: number
  compareAtPrice: number
  stock: number
  sku: string
  // Solo admin
  costPrice?: number
}

export interface ProductOffer {
  quantity: number
  unitPrice: number
  label: string
  isDefault: boolean
}

export interface Faq {
  question: string
  answer: string
}

export interface Product {
  _id: string
  slug: string
  title: string
  shortDescription: string
  description: string
  images: string[]
  category: string
  price: number
  compareAtPrice: number
  type: 'SIMPLE' | 'VARIABLE'
  variants: ProductVariant[]
  offers: ProductOffer[]
  benefits: string[]
  faqs: Faq[]
  stock: number
  isPublished: boolean
  isFeatured: boolean
  soldCount: number
  // Solo admin. null al guardar desenlaza el producto de Dropi.
  dropiId?: number | null
  costPrice?: number
  suggestedPrice?: number
  lastSyncedAt?: string
}

export interface ProductDetail extends Product {
  related: Product[]
}

export interface BankAccount {
  bank: string
  type: string
  number: string
  holder: string
  idNumber: string
}

export interface StoreSettings {
  codSurcharge: number
  transferSurcharge: number
  shippingFee: number
  freeShippingFrom: number
  announcement: string
  whatsapp: string
  bankAccounts: BankAccount[]
  defaultMarkupPercent?: number
}

export interface Province {
  id: number
  name: string
}

export interface City {
  id: number
  name: string
  provinceId: number
}

export interface CartLine {
  productId: string
  variantId: string | null
  quantity: number
}

export interface OrderItem {
  product: string
  variantId: string | null
  title: string
  variantName: string
  image: string
  quantity: number
  unitPrice: number
  total: number
  /** Solo admin: ids de Dropi copiados al comprar. */
  dropiId?: number | null
  dropiVariationId?: number | null
}

export interface Quote {
  subtotal: number
  shippingFee: number
  surcharge: number
  total: number
  items: OrderItem[]
  surcharges: Record<PaymentMethod, number>
}

export type OrderStatus =
  | 'pending_payment'
  | 'awaiting_transfer'
  | 'transfer_review'
  | 'confirmed'
  | 'sent_to_dropi'
  | 'shipped'
  | 'delivered'
  | 'returned'
  | 'cancelled'
  | 'failed'

export interface Customer {
  firstName: string
  lastName: string
  phone: string
  email: string
  idNumber: string
}

export interface ShippingAddress {
  provinceId: number
  province: string
  cityId: number
  city: string
  street: string
  reference: string
}

export interface Order {
  _id: string
  number: string
  customer: Customer
  address: ShippingAddress
  items: OrderItem[]
  subtotal: number
  shippingFee: number
  surcharge: number
  total: number
  paymentMethod: PaymentMethod
  paymentStatus: 'pending' | 'paid' | 'cod' | 'failed' | 'refunded'
  status: OrderStatus
  transfer: { receiptUrl: string; uploadedAt: string | null; confirmedAt: string | null }
  dropi: {
    orderId: number | null
    status: string
    guide: string
    carrier: string
    error: string
    lastSyncAt: string | null
  }
  notes: string
  createdAt: string
}

/** Estados de envío que el admin marca a mano mientras no hay sincronización con Dropi. */
export type ShippingStatus = 'shipped' | 'delivered' | 'returned'

export interface DropiManualInput {
  dropiOrderId?: number
  guide?: string
  carrier?: string
}

export interface ShippingInput {
  guide?: string
  carrier?: string
  status?: ShippingStatus
}

export interface PayphoneConfig {
  token: string
  storeId: string
  clientTransactionId: string
  amount: number
  amountWithoutTax: number
  currency: 'USD'
  reference: string
  email: string
  phoneNumber: string
}

export interface CreateOrderPayload {
  items: CartLine[]
  paymentMethod: PaymentMethod
  customer: Customer
  address: ShippingAddress
  notes?: string
  utm?: Record<string, string>
}

export interface CreateOrderResponse {
  order: Order
  payphone?: PayphoneConfig
}

// ─── Admin ──────────────────────────────────────────────────────────────

export interface DashboardStats {
  ordersToday: number
  revenueToday: number
  pendingTransfers: number
  dropiErrors: number
  ordersByStatus: Record<string, number>
  last7Days: { date: string; orders: number; revenue: number }[]
}

export interface DropiCatalogItem {
  dropiId: number
  name: string
  type: 'SIMPLE' | 'VARIABLE'
  costPrice: number
  suggestedPrice: number
  stock: number
  image: string
  imported: boolean
}

/** Estado de la conexión con la API de Dropi (GET /admin/dropi/status). */
export interface DropiStatus {
  configured: boolean
  connected: boolean
  message: string
  // IP que Dropi reporta al rechazar: es la que hay que pedir que agreguen.
  blockedIp: string | null
  integrationUrl: string | null
  urlMismatch: boolean
  checkedAt: string
}

export interface Lead {
  _id: string
  phone: string
  firstName: string
  items: CartLine[]
  converted: boolean
  createdAt: string
}

/** Producto leído por el botón "Enviar a Kova" desde una página de Dropi (montos en centavos). */
export interface DropiClipProduct {
  dropiId: number | null
  title: string
  images: string[]
  costPrice?: number | null
  suggestedPrice?: number | null
  /** Precio de venta manual, solo cuando no hay costo para calcularlo. */
  price?: number
  stock?: number | null
  description?: string
  category?: string
  supplier?: string
  sourceUrl?: string
}

/** Mensaje que manda el bookmarklet al panel por postMessage. */
export interface DropiClipMessage {
  type: 'kova-clip'
  version: number
  pageType: 'detail' | 'list'
  sourceUrl: string
  products: DropiClipProduct[]
}

export interface DropiClipResult {
  dropiId: number | null
  productId: string | null
  title: string
  status: 'created' | 'updated' | 'error'
  message?: string
}

/** Producto de la tienda ya enlazado a un id de Dropi (GET /admin/dropi/linked). */
export interface DropiLinkedProduct {
  dropiId: number
  productId: string
  title: string
  isPublished: boolean
}
