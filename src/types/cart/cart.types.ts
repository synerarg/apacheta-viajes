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
  moneda: string
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
  paymentMethod: "mercadopago" | "transferencia" | "efectivo"
  items: CartItem[]
  reservations: CheckoutReservationSnapshot[]
}
