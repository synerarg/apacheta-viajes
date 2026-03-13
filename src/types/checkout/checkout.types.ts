import type { CartItem, CheckoutReservationSnapshot } from "@/types/cart/cart.types"
import type { BankTransferPaymentResult } from "@/types/payments/payments.types"

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
  contact: CheckoutContactInput
  passenger: CheckoutPassengerInput
}

export interface CheckoutUserContext {
  id: string
  email: string | null
}

export interface CheckoutSubmitResult {
  paymentMethod: CheckoutPaymentMethod
  reservations: CheckoutReservationSnapshot[]
  redirectUrl: string | null
  successUrl: string
  bankTransfer: BankTransferPaymentResult | null
}
