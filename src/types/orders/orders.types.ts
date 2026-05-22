export type { OrderStatus, PaymentStatus, PaymentMethod } from "@/types/shared/enums"
import type { OrderStatus, PaymentStatus, PaymentMethod, Moneda } from "@/types/shared/enums"

type DatabaseJson =
  | string
  | number
  | boolean
  | null
  | { [key: string]: DatabaseJson | undefined }
  | DatabaseJson[]

// Re-export legacy aliases for backwards compatibility
export type OrderPaymentStatus = PaymentStatus
export type OrderPaymentMethod = PaymentMethod

export interface OrdersRow {
  id: string
  usuario_id: string
  codigo_referencia: string
  estado: OrderStatus
  estado_pago: PaymentStatus
  metodo_pago: PaymentMethod
  total: number
  moneda: Moneda
  contacto: DatabaseJson | null
  pasajero_principal: DatabaseJson | null
  notas: string | null
  created_at: string | null
  updated_at: string | null
}

export interface OrdersInsert {
  id?: string
  usuario_id: string
  codigo_referencia: string
  estado?: OrderStatus
  estado_pago?: PaymentStatus
  metodo_pago: PaymentMethod
  total: number
  moneda?: Moneda
  contacto?: DatabaseJson | null
  pasajero_principal?: DatabaseJson | null
  notas?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface OrdersUpdate {
  id?: string
  usuario_id?: string
  codigo_referencia?: string
  estado?: OrderStatus
  estado_pago?: PaymentStatus
  metodo_pago?: PaymentMethod
  total?: number
  moneda?: Moneda
  contacto?: DatabaseJson | null
  pasajero_principal?: DatabaseJson | null
  notas?: string | null
  created_at?: string | null
  updated_at?: string | null
}
