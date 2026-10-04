import type { PayphoneConfig } from '@/types'

const CSS_URL = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.css'
const JS_URL = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.js'

// Promesa de módulo: los recursos de Payphone se cargan una sola vez por sesión.
let loading: Promise<void> | null = null

function loadAssets(): Promise<void> {
  if (window.PPaymentButtonBox) return Promise.resolve()
  if (loading) return loading

  loading = new Promise<void>((resolve, reject) => {
    if (!document.querySelector(`link[href="${CSS_URL}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = CSS_URL
      document.head.appendChild(link)
    }
    const script = document.createElement('script')
    script.type = 'module'
    script.src = JS_URL
    script.onload = () => resolve()
    script.onerror = () => {
      loading = null
      script.remove()
      reject(new Error('payphone'))
    }
    document.head.appendChild(script)
  })
  return loading
}

/** Monta la Cajita de Pagos de Payphone dentro del contenedor indicado. */
export function usePayphoneBox() {
  async function render(config: PayphoneConfig, containerId = 'pp-button'): Promise<void> {
    await loadAssets()
    const Box = window.PPaymentButtonBox
    if (!Box) throw new Error('payphone')
    const container = document.getElementById(containerId)
    if (container) container.innerHTML = ''
    new Box({
      token: config.token,
      clientTransactionId: config.clientTransactionId,
      amount: config.amount,
      amountWithoutTax: config.amountWithoutTax,
      currency: config.currency,
      storeId: config.storeId,
      reference: config.reference,
      lang: 'es',
      defaultMethod: 'card',
      timeZone: -5,
      // Siempre los datos reales del comprador: Payphone bloquea datos quemados.
      email: config.email || undefined,
      phoneNumber: config.phoneNumber || undefined,
    }).render(containerId)
  }

  return { render }
}
