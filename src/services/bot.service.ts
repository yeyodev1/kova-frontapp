import APIBase from './httpBase'
import type { BotConfig, BotEvent, BotSession, Paginated } from '@/types'

export interface BotEventsQuery {
  phone?: string
  page?: number
  errors?: boolean
}

/** Panel del bot de WhatsApp. Todas las rutas exigen sesión de admin. */
class BotService extends APIBase {
  async events(query: BotEventsQuery = {}): Promise<Paginated<BotEvent>> {
    const params = {
      phone: query.phone || undefined,
      page: query.page,
      errors: query.errors ? 1 : undefined,
    }
    const { data } = await this.get<Paginated<BotEvent>>('whatsapp-bot/admin/events', undefined, { params })
    return data
  }

  async sessions(query: { page?: number; q?: string } = {}): Promise<Paginated<BotSession>> {
    const params = { page: query.page, q: query.q || undefined }
    const { data } = await this.get<Paginated<BotSession>>('whatsapp-bot/admin/sessions', undefined, { params })
    return data
  }

  async reset(phone: string): Promise<void> {
    await this.post(`whatsapp-bot/admin/sessions/${encodeURIComponent(phone)}/reset`, {})
  }

  async silence(phone: string, minutes = 60): Promise<void> {
    await this.post(`whatsapp-bot/admin/sessions/${encodeURIComponent(phone)}/silence`, { minutes })
  }

  async unsilence(phone: string): Promise<void> {
    await this.post(`whatsapp-bot/admin/sessions/${encodeURIComponent(phone)}/unsilence`, {})
  }

  async config(): Promise<BotConfig> {
    const { data } = await this.get<BotConfig>('whatsapp-bot/admin/config')
    return data
  }
}

export const botService = new BotService()
