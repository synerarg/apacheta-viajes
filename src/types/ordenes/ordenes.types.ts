type DatabaseJson =
  | string
  | number
  | boolean
  | null
  | { [key: string]: DatabaseJson | undefined }
  | DatabaseJson[]

export type OrdenEstado =
  | "pendiente"
  | "pago_pendiente"
  | "pago_reportado"
  | "pagada"
  | "confirmada"
  | "cancelada"
  | "completada"

export type OrdenEstadoPago =
  | "pending"
  | "requires_action"
  | "reported"
  | "approved"
  | "rejected"
  | "cancelled"
  | "expired"

export type OrdenMetodoPago =
  | "mercadopago_checkout_pro"
  | "bank_transfer"
  | "cash_local"

export interface OrdenesRow {
  id: string
  usuario_id: string
  codigo_referencia: string
  estado: OrdenEstado
  estado_pago: OrdenEstadoPago
  metodo_pago: OrdenMetodoPago
  total: number
  moneda: string
  contacto: DatabaseJson | null
  pasajero_principal: DatabaseJson | null
  notas: string | null
  created_at: string | null
  updated_at: string | null
}

export interface OrdenesInsert {
  id?: string
  usuario_id: string
  codigo_referencia: string
  estado?: OrdenEstado
  estado_pago?: OrdenEstadoPago
  metodo_pago: OrdenMetodoPago
  total: number
  moneda?: string
  contacto?: DatabaseJson | null
  pasajero_principal?: DatabaseJson | null
  notas?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface OrdenesUpdate {
  id?: string
  usuario_id?: string
  codigo_referencia?: string
  estado?: OrdenEstado
  estado_pago?: OrdenEstadoPago
  metodo_pago?: OrdenMetodoPago
  total?: number
  moneda?: string
  contacto?: DatabaseJson | null
  pasajero_principal?: DatabaseJson | null
  notas?: string | null
  created_at?: string | null
  updated_at?: string | null
}
