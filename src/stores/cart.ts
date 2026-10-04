import { defineStore } from 'pinia'
import type { CartLine, Product } from '@/types'
import { track } from '@/utils/pixel'

const CART_KEY = 'kova_cart'

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? (JSON.parse(raw) as CartLine[]) : []
  } catch {
    return []
  }
}

/**
 * Carrito mínimo: solo ids y cantidades. Los precios los calcula siempre el
 * backend en /checkout/quote, así un precio viejo en localStorage nunca cobra mal.
 */
export const useCartStore = defineStore('cart', {
  state: () => ({
    lines: load(),
    isOpen: false,
  }),

  getters: {
    count: (s) => s.lines.reduce((sum, l) => sum + l.quantity, 0),
    isEmpty: (s) => s.lines.length === 0,
  },

  actions: {
    persist() {
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(this.lines))
      } catch {
        /* modo privado */
      }
    },

    add(product: Product, variantId: string | null, quantity = 1, open = true) {
      const line = this.lines.find((l) => l.productId === product._id && l.variantId === variantId)
      if (line) line.quantity += quantity
      else this.lines.push({ productId: product._id, variantId, quantity })
      this.persist()
      track('AddToCart', {
        content_ids: [product._id],
        content_name: product.title,
        value: product.price / 100,
        currency: 'USD',
      })
      if (open) this.isOpen = true
    },

    /** Compra directa: reemplaza el carrito por un solo producto (botón "Comprar ahora"). */
    buyNow(product: Product, variantId: string | null, quantity: number) {
      this.lines = []
      this.add(product, variantId, quantity, false)
    },

    setQuantity(index: number, quantity: number) {
      if (quantity <= 0) this.lines.splice(index, 1)
      else if (this.lines[index]) this.lines[index].quantity = quantity
      this.persist()
    },

    remove(index: number) {
      this.lines.splice(index, 1)
      this.persist()
    },

    clear() {
      this.lines = []
      this.persist()
    },
  },
})
