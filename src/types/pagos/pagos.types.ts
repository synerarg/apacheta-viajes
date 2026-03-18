type DatabaseJson =
  | string
  | number
  | boolean
  | null
  | { [key: string]: DatabaseJson | undefined }
  | DatabaseJson[]

export type PagoMetodo =
  | "mercadopago_checkout_pro"
  | "bank_transfer"
  | "cash_local"

export type PagoProveedor = "mercadopago" | "bank_transfer" | "cash_local"

export type PagoEstado =
  | "pending"
  | "requires_action"
  | "reported"
  | "approved"
  | "rejected"
  | "cancelled"
  | "expired"

export interface PagosRow {
  id: string
  orden_id: string
  metodo: PagoMetodo
  proveedor: PagoProveedor
  estado: PagoEstado
  monto: number
  moneda: string
  external_reference: string
  provider_reference: string | null
  redirect_url: string | null
  expires_at: string | null
  receipt_url: string | null
  receipt_storage_path: string | null
  receipt_reference: string | null
  metadata: DatabaseJson | null
  approved_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface PagosInsert {
  id?: string
  orden_id: string
  metodo: PagoMetodo
  proveedor: PagoProveedor
  estado?: PagoEstado
  monto: number
  moneda?: string
  external_reference: string
  provider_reference?: string | null
  redirect_url?: string | null
  expires_at?: string | null
  receipt_url?: string | null
  receipt_storage_path?: string | null
  receipt_reference?: string | null
  metadata?: DatabaseJson | null
  approved_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface PagosUpdate {
  id?: string
  orden_id?: string
  metodo?: PagoMetodo
  proveedor?: PagoProveedor
  estado?: PagoEstado
  monto?: number
  moneda?: string
  external_reference?: string
  provider_reference?: string | null
  redirect_url?: string | null
  expires_at?: string | null
  receipt_url?: string | null
  receipt_storage_path?: string | null
  receipt_reference?: string | null
  metadata?: DatabaseJson | null
  approved_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}
