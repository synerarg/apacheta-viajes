import type {
  OrdenEstado,
  OrdenEstadoPago,
  OrdenMetodoPago,
  OrdenesRow,
} from "@/types/ordenes/ordenes.types"
import type { OrdenesItemsRow } from "@/types/ordenes-items/ordenes-items.types"
import type { PagoEstado, PagoMetodo, PagosRow } from "@/types/pagos/pagos.types"
import type { ReservaEstado, ReservasRow } from "@/types/reservas/reservas.types"
import type { UsuariosRow } from "@/types/usuarios/usuarios.types"

export type SupportedPaymentMethod = Exclude<OrdenMetodoPago, "cash_local">

export interface PaymentCustomer {
  email?: string | null
  fullName?: string | null
  documentNumber?: string | null
}

export interface ReservationPaymentContext {
  reservation: ReservasRow
  user: UsuariosRow | null
}

export interface OrderPaymentContext {
  order: OrdenesRow
  items: OrdenesItemsRow[]
  reservations: ReservasRow[]
  user: UsuariosRow | null
  latestPayment: PagosRow | null
}

export interface PaymentReceiptAccessInput {
  paymentId: string
  userId: string
}

export interface PaymentReceiptDownloadResult {
  paymentId: string
  url: string
  expiresInSeconds: number
}

export interface CreateMercadoPagoCheckoutProInput {
  orderId: string
  title?: string
  description?: string
  payer?: PaymentCustomer
  successPath?: string
  failurePath?: string
  pendingPath?: string
}

export interface MercadoPagoCheckoutProResult {
  provider: "mercadopago_checkout_pro"
  orderId: string
  paymentId: string
  preferenceId: string
  initPoint: string | null
  sandboxInitPoint: string | null
  externalReference: string
}

export interface MercadoPagoWebhookResult {
  orderId: string
  paymentId: string
  mercadopagoPaymentId: string
  mercadopagoStatus: string
  paymentStatus: PagoEstado
  orderStatus: OrdenEstado
  alreadyProcessed: boolean
}

export interface CreateBankTransferPaymentInput {
  orderId: string
  payer?: PaymentCustomer
  note?: string
}

export interface ConfirmBankTransferInput {
  paymentId: string
  payer?: PaymentCustomer
  note?: string
  receiptReference?: string
}

export interface UploadBankTransferReceiptInput {
  paymentId: string
  fileName: string
  fileType: string
  fileBuffer: ArrayBuffer
  receiptReference?: string
  note?: string
  userId: string
}

export interface BankTransferDetails {
  bankName: string
  accountHolder: string
  taxId?: string | null
  alias: string
  cbu: string
  receiptEmail?: string | null
}

export interface BankTransferPaymentResult {
  provider: "bank_transfer"
  orderId: string
  paymentId: string
  amount: number
  currency: string
  expiresAt: string
  reference: string
  status: PagoEstado
  bankDetails: BankTransferDetails
  instructions: string[]
  receiptReference: string | null
  hasReceipt: boolean
  receiptUrl: string | null
}

export interface CashLocalPaymentResult {
  provider: "cash_local"
  orderId: string
  paymentId: string
  amount: number
  currency: string
  status: PagoEstado
}

export interface BankTransferConfirmationResult {
  orderId: string
  paymentId: string
  status: PagoEstado
  confirmedAt: string
  reference: string
}

export interface BankTransferReceiptUploadResult {
  orderId: string
  paymentId: string
  status: PagoEstado
  receiptReference: string | null
  hasReceipt: boolean
  receiptUrl: string | null
  uploadedAt: string
}

export interface CreatePaymentInput {
  method: OrdenMetodoPago
  orderId: string
  title?: string
  description?: string
  payer?: PaymentCustomer
  successPath?: string
  failurePath?: string
  pendingPath?: string
  note?: string
}

export interface CheckoutPaymentSummary {
  paymentId: string
  method: PagoMetodo
  provider: PagosRow["proveedor"]
  status: PagoEstado
  amount: number
  currency: string
  externalReference: string
  redirectUrl: string | null
  expiresAt: string | null
  receiptReference: string | null
  hasReceipt: boolean
  receiptUrl: string | null
}

export interface CheckoutOrderItemSummary {
  orderItemId: string
  reservationId: string
  kind: OrdenesItemsRow["tipo"]
  name: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  currency: string
  image: string
}

export interface CheckoutOrderSummary {
  orderId: string
  reference: string
  status: OrdenEstado
  paymentStatus: OrdenEstadoPago
  paymentMethod: OrdenMetodoPago
  total: number
  currency: string
  createdAt: string | null
  items: CheckoutOrderItemSummary[]
  payment: CheckoutPaymentSummary | null
  reservations: {
    reservationId: string
    kind: ReservasRow["tipo"]
    status: ReservaEstado | null
    quantity: number
    unitPrice: number
    totalPrice: number
  }[]
  bankTransfer: BankTransferPaymentResult | null
}
