import type {
  OrderStatus,
  OrderPaymentStatus,
  OrderPaymentMethod,
  OrdersRow,
} from "@/types/orders/orders.types"
import type { OrderItemsRow } from "@/types/order-items/order-items.types"
import type { PaymentStatus, PaymentMethod, PaymentsRow } from "@/types/payments/payments.types"
import type { ReservationStatus, ReservationsRow } from "@/types/reservations/reservations.types"
import type { UsersRow } from "@/types/users/users.types"

export type SupportedPaymentMethod = Exclude<OrderPaymentMethod, "cash_local">

export interface PaymentCustomer {
  email?: string | null
  fullName?: string | null
  documentNumber?: string | null
}

export interface ReservationPaymentContext {
  reservation: ReservationsRow
  user: UsersRow | null
}

export interface OrderPaymentContext {
  order: OrdersRow
  items: OrderItemsRow[]
  reservations: ReservationsRow[]
  user: UsersRow | null
  latestPayment: PaymentsRow | null
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
  paymentStatus: PaymentStatus
  orderStatus: OrderStatus
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

export interface AuthorizeBankTransferReceiptUploadInput {
  paymentId: string
  userId: string
  fileName: string
  fileType: string
  fileSize: number
}

export interface RegisterBankTransferReceiptInput {
  paymentId: string
  userId: string
  receiptStoragePath: string
  fileName: string
  fileType: string
  receiptReference?: string
  note?: string
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
  status: PaymentStatus
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
  status: PaymentStatus
}

export interface BankTransferConfirmationResult {
  orderId: string
  paymentId: string
  status: PaymentStatus
  confirmedAt: string
  reference: string
}

export interface BankTransferReceiptUploadResult {
  orderId: string
  paymentId: string
  status: PaymentStatus
  receiptReference: string | null
  hasReceipt: boolean
  receiptUrl: string | null
  uploadedAt: string
}

export interface BankTransferReceiptUploadAuthorizationResult {
  orderId: string
  paymentId: string
  bucket: string
  path: string
  token: string
  maxBytes: number
}

export interface ExpireBankTransferPaymentsResult {
  processedAt: string
  expiredPayments: Array<{
    orderId: string
    paymentId: string
  }>
}

export interface CreatePaymentInput {
  method: OrderPaymentMethod
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
  method: PaymentMethod
  provider: PaymentsRow["proveedor"]
  status: PaymentStatus
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
  kind: OrderItemsRow["tipo"]
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
  status: OrderStatus
  paymentStatus: OrderPaymentStatus
  paymentMethod: OrderPaymentMethod
  total: number
  currency: string
  createdAt: string | null
  items: CheckoutOrderItemSummary[]
  payment: CheckoutPaymentSummary | null
  reservations: {
    reservationId: string
    kind: ReservationsRow["tipo"]
    status: ReservationStatus | null
    quantity: number
    unitPrice: number
    totalPrice: number
  }[]
  bankTransfer: BankTransferPaymentResult | null
}
