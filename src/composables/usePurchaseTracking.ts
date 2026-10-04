import type { Order } from '@/types'
import { track } from '@/utils/pixel'

const PREFIX = 'kova_purchase_'

/**
 * Purchase se dispara una sola vez por pedido aunque el cliente recargue o
 * vuelva a la página: el flag queda en localStorage.
 */
export function trackPurchase(order: Order): void {
  const key = PREFIX + order.number
  try {
    if (localStorage.getItem(key)) return
    localStorage.setItem(key, '1')
  } catch {
    /* modo privado: mejor un posible duplicado que perder el evento */
  }
  track('Purchase', {
    value: order.total / 100,
    currency: 'USD',
    content_ids: order.items.map((item) => item.product),
    content_type: 'product',
    num_items: order.items.reduce((sum, item) => sum + item.quantity, 0),
    order_id: order.number,
  })
}
