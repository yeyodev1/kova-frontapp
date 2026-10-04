import APIBase from './httpBase'

export type BankAccountType = 'Ahorros' | 'Corriente' | 'Transaccional'

/** Cuenta tal como la devuelve /admin/payments (siempre con id y logo resuelto). */
export interface AdminBankAccount {
  _id: string
  bank: string
  bankCode: string
  type: BankAccountType
  number: string
  holder: string
  idNumber: string
  active: boolean
  logoUrl: string
}

/** Banco del catálogo de Ecuador: "otro" no tiene logo. */
export interface BankCatalogItem {
  code: string
  name: string
  logoUrl: string
}

export interface PaymentsState {
  acceptTransfers: boolean
  transferSurcharge: number
  accounts: AdminBankAccount[]
  banks: BankCatalogItem[]
}

export type BankAccountInput = Omit<AdminBankAccount, '_id' | 'logoUrl'> & { logoUrl?: string }

/** Pagos y bancos del panel: interruptor de transferencias, recargo y cuentas. */
class PaymentsService extends APIBase {
  async load(): Promise<PaymentsState> {
    const { data } = await this.get<PaymentsState>('admin/payments')
    return data
  }

  async update(patch: { acceptTransfers?: boolean; transferSurcharge?: number }): Promise<PaymentsState> {
    const { data } = await this.put<PaymentsState>('admin/payments', patch)
    return data
  }

  async createAccount(account: BankAccountInput): Promise<PaymentsState> {
    const { data } = await this.post<PaymentsState>('admin/payments/accounts', account)
    return data
  }

  async updateAccount(id: string, patch: Partial<BankAccountInput>): Promise<PaymentsState> {
    const { data } = await this.put<PaymentsState>(`admin/payments/accounts/${id}`, patch)
    return data
  }

  async deleteAccount(id: string): Promise<PaymentsState> {
    const { data } = await this.delete<PaymentsState>(`admin/payments/accounts/${id}`)
    return data
  }
}

export const paymentsService = new PaymentsService()
