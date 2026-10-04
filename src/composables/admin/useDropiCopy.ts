import { ref } from 'vue'
import type { Order } from '@/types'
import { methodLabels } from '@/components/admin/orderLabels'

/** Dólares con punto decimal: así los pide el formulario de Dropi. */
function dollars(cents: number): string {
  return ((Number(cents) || 0) / 100).toFixed(2)
}

/**
 * Bloque de texto con todo lo que pide el formulario de "Crear pedido" de Dropi, en el mismo
 * orden en que se llena. Se pega en notas o se lee mientras se copia campo por campo.
 */
export function buildDropiText(order: Order): string {
  const c = order.customer
  const a = order.address
  const isCod = order.paymentMethod === 'cod'
  const products = order.items.map((item) => {
    const ids = [
      `ID Dropi: ${item.dropiId ?? 'sin enlazar'}`,
      item.variantId || item.dropiVariationId
        ? `Variación: ${item.dropiVariationId ?? 'sin enlazar'}`
        : '',
    ].filter(Boolean)
    const name = `${item.title}${item.variantName ? ` (${item.variantName})` : ''}`
    return `- ${item.quantity} x ${name} | ${ids.join(' | ')} | $${dollars(item.unitPrice)} c/u`
  })

  const lines = [
    `Pedido ${order.number}`,
    '',
    `Nombre: ${c.firstName} ${c.lastName}`.trim(),
    `Celular: ${c.phone}`,
    c.idNumber ? `Cédula: ${c.idNumber}` : 'Cédula: (no la dio)',
    c.email ? `Correo: ${c.email}` : null,
    `Provincia: ${a.province}`,
    `Ciudad: ${a.city}`,
    `Dirección: ${a.street}`,
    a.reference ? `Referencia: ${a.reference}` : null,
    '',
    'Productos:',
    ...products,
    '',
    `Pago: ${methodLabels[order.paymentMethod] ?? order.paymentMethod}`,
    isCod
      ? `CON RECAUDO - Valor a recaudar: $${dollars(order.total)}`
      : 'SIN RECAUDO (ya está pagado)',
    order.notes ? `Notas: ${order.notes}` : null,
  ]
  return lines.filter((line) => line !== null).join('\n')
}

async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Sin permisos de portapapeles (http en el celular, iframes): el método viejo sigue sirviendo.
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  }
}

export function useDropiCopy() {
  const copied = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy(order: Order): Promise<boolean> {
    const ok = await writeClipboard(buildDropiText(order))
    if (ok) {
      copied.value = true
      clearTimeout(timer)
      timer = setTimeout(() => (copied.value = false), 2200)
    }
    return ok
  }

  return { copied, copy }
}
