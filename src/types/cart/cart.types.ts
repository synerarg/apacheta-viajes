import type { Moneda } from "@/types/shared/enums"

export type CartItemKind = "paquete" | "experiencia"

export interface CartItem {
  id: string
  kind: CartItemKind
  category: string
  name: string
  description: string
  unitPrice: number
  quantity: number
  image: string
  moneda: Moneda
  paqueteFechaId: string | null
  experienciaId: string | null
}

export interface CartSnapshot {
  items: CartItem[]
}

export interface CheckoutReservationSnapshot {
  reservationId: string
  kind: CartItemKind
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface LastCheckoutSnapshot {
  submittedAt: string
  paymentMethod: "mercadopago" | "transferencia"
  items: CartItem[]
  order: {
    orderId: string
    reference: string
    status: string
    paymentStatus: string
    total: number
    currency: string
  }
  payment: {
    paymentId: string
    method: string
    status: string
    amount: number
    currency: string
    externalReference: string
    redirectUrl: string | null
    expiresAt: string | null
    receiptReference: string | null
    receiptUrl: string | null
  } | null
  reservations: CheckoutReservationSnapshot[]
  bankTransfer: {
    paymentId: string
    expiresAt: string
    reference: string
    status: string
    amount: number
    currency: string
    receiptReference: string | null
    receiptUrl: string | null
  } | null
}
