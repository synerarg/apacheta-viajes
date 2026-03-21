import type { CartItem, CheckoutReservationSnapshot } from "@/types/cart/cart.types"
import type {
  BankTransferPaymentResult,
  CheckoutOrderSummary,
  CheckoutPaymentSummary,
} from "@/types/payments/payments.types"

export type CheckoutPaymentMethod = "mercadopago" | "transferencia" | "efectivo"

export interface CheckoutContactInput {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface CheckoutPassengerInput {
  fullName: string
  documentNumber: string
  birthDate: string
  nationality: string
  specialRequirements: string
}

export interface CheckoutSubmitInput {
  items: CartItem[]
  paymentMethod: CheckoutPaymentMethod
  saveProfile: boolean
  contact: CheckoutContactInput
  passenger: CheckoutPassengerInput
}

export interface CheckoutUserContext {
  id: string
  email: string | null
}

export interface CheckoutSubmitResult {
  paymentMethod: CheckoutPaymentMethod
  order: {
    orderId: string
    reference: string
    status: CheckoutOrderSummary["status"]
    paymentStatus: CheckoutOrderSummary["paymentStatus"]
    total: number
    currency: string
  }
  payment: CheckoutPaymentSummary | null
  reservations: CheckoutReservationSnapshot[]
  redirectUrl: string | null
  successUrl: string
  bankTransfer: BankTransferPaymentResult | null
}

export type CheckoutOrderDetailResult = CheckoutOrderSummary

export interface CheckoutProfileResult {
  contact: CheckoutContactInput
  passenger: CheckoutPassengerInput
}
