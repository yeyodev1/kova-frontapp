import type { BotConfig, BotEvent, BotFlow, BotRule, BotSession } from '@/types'

/*
 * El panel se escribió contra el contrato acordado; el backend devuelve algunas
 * variantes (customerName/stage, carrito resumido, durationMs, flow/goTo...).
 * Aquí se aceptan ambas formas para que la UI hable siempre un solo idioma.
 */

type RawFlow = Omit<Partial<BotFlow>, 'sendToClient'> & { flow?: string; sendToClient?: string | boolean }
type RawRule = Partial<BotRule> & { goTo?: string }
type RawConfig = Omit<BotConfig, 'flows' | 'rules'> & { flows?: RawFlow[]; rules?: RawRule[] }

// La UI del panel no lleva emojis: los nombres de flujo de BuilderBot sí los traen.
const noEmoji = (text = '') => text.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '').trim()
// "https://api…/api/whatsapp-bot/brain" → "/brain": la URL completa ya está en Endpoints.
const shortPath = (url = '') => url.replace(/^.*\/whatsapp-bot/, '') || url

/** Acepta el contrato y las variantes del backend (flow/goTo, sendToClient booleano). */
export function normalizeConfig(input: unknown): BotConfig {
  const raw = input as RawConfig
  return {
    ...raw,
    endpoints: raw.endpoints || [],
    flows: (raw.flows || []).map((f) => ({
      name: noEmoji(f.name ?? f.flow),
      event: f.event || '',
      endpoint: shortPath(f.endpoint),
      sendToClient:
        typeof f.sendToClient === 'boolean' ? (f.sendToClient ? '{message}' : 'APAGADO') : f.sendToClient || '',
      after: f.after || '',
    })),
    rules: (raw.rules || []).map((r) => ({
      route: r.route || '',
      goesTo: noEmoji(r.goesTo ?? r.goTo),
      when: r.when || '',
    })),
  }
}

type RawSession = Omit<Partial<BotSession>, 'cart' | 'lastMessage'> & {
  customerName?: string
  stage?: string
  cart?: BotSession['cart'] | { items?: number; total?: number; summary?: string }
  lastMessage?: string | { role?: 'user' | 'assistant'; content?: string; at?: string }
  updatedAt?: string
}

export function normalizeSession(input: unknown): BotSession {
  const raw = input as RawSession
  const cart = raw.cart
  const last = raw.lastMessage
  const lastObj = last && typeof last === 'object' ? last : null
  return {
    phone: raw.phone || '',
    name: raw.name ?? raw.customerName ?? '',
    step: raw.step ?? raw.stage ?? '',
    cart: Array.isArray(cart) ? cart : [],
    cartSummary: !Array.isArray(cart) && cart?.items ? cart.summary || '' : undefined,
    cartTotal: !Array.isArray(cart) && cart?.items ? cart.total || 0 : undefined,
    orderNumber: raw.orderNumber || '',
    silencedUntil: raw.silencedUntil ?? null,
    optOut: !!raw.optOut,
    lastMessageAt: raw.lastMessageAt ?? lastObj?.at ?? raw.updatedAt ?? null,
    lastMessage: lastObj ? lastObj.content || '' : typeof last === 'string' ? last : '',
    lastMessageRole: lastObj?.role,
    humanRequested: !!raw.humanRequested,
  }
}

type RawEvent = Partial<BotEvent> & { durationMs?: number }

export function normalizeEvent(input: unknown): BotEvent {
  const raw = input as RawEvent
  const endpoint = raw.endpoint || ''
  return {
    _id: raw._id || '',
    createdAt: raw.createdAt || '',
    phone: raw.phone || '',
    endpoint: endpoint && !endpoint.startsWith('/') ? `/${endpoint}` : endpoint,
    route: raw.route || '',
    decision: raw.decision || '',
    message: raw.message || '',
    reply: raw.reply || '',
    ms: raw.ms ?? raw.durationMs ?? 0,
    error: raw.error || '',
  }
}
