import type { ReservaEstado, ReservasRow } from "@/types/reservas/reservas.types"
import type { UsuariosRow } from "@/types/usuarios/usuarios.types"

export type SupportedPaymentMethod =
  | "mercadopago_checkout_pro"
  | "bank_transfer"

export interface PaymentCustomer {
  email?: string | null
  fullName?: string | null
  documentNumber?: string | null
}

export interface ReservationPaymentContext {
  reservation: ReservasRow
  user: UsuariosRow | null
}

export interface CreateMercadoPagoCheckoutProInput {
  reservationId: string
  title?: string
  description?: string
  payer?: PaymentCustomer
  successPath?: string
  failurePath?: string
  pendingPath?: string
}

export interface MercadoPagoCheckoutProResult {
  provider: "mercadopago_checkout_pro"
  reservationId: string
  preferenceId: string
  initPoint: string | null
  sandboxInitPoint: string | null
  externalReference: string
}

export interface MercadoPagoWebhookResult {
  reservationId: string
  mercadopagoPaymentId: string
  mercadopagoStatus: string
  reservationStatus: ReservaEstado
  alreadyProcessed: boolean
}

export interface CreateBankTransferPaymentInput {
  reservationId: string
  payer?: PaymentCustomer
  note?: string
}

export interface ConfirmBankTransferInput {
  reservationId: string
  payer?: PaymentCustomer
  note?: string
  receiptReference?: string
}

export interface BankTransferDetails {
  bankName: string
  accountHolder: string
  alias: string
  cbu: string
  receiptEmail?: string | null
}

export interface BankTransferPaymentResult {
  provider: "bank_transfer"
  reservationId: string
  amount: number
  currency: string
  expiresAt: string
  reference: string
  status: ReservaEstado
  bankDetails: BankTransferDetails
  instructions: string[]
}

export interface BankTransferConfirmationResult {
  reservationId: string
  status: ReservaEstado
  confirmedAt: string
  reference: string
}

export interface CreatePaymentInput {
  method: SupportedPaymentMethod
  reservationId: string
  title?: string
  description?: string
  payer?: PaymentCustomer
  successPath?: string
  failurePath?: string
  pendingPath?: string
  note?: string
}
