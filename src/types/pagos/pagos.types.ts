export type { PagoEstado, MetodoPago, PagoProveedor } from "@/types/shared/enums"
import type { PagoEstado, MetodoPago, PagoProveedor, Moneda } from "@/types/shared/enums"

type DatabaseJson =
  | string
  | number
  | boolean
  | null
  | { [key: string]: DatabaseJson | undefined }
  | DatabaseJson[]

// Re-export legacy aliases for backwards compatibility
export type PagoMetodo = MetodoPago

export interface PagosRow {
  id: string
  orden_id: string
  metodo: MetodoPago
  proveedor: PagoProveedor
  estado: PagoEstado
  monto: number
  moneda: Moneda
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
  metodo: MetodoPago
  proveedor: PagoProveedor
  estado?: PagoEstado
  monto: number
  moneda?: Moneda
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
  metodo?: MetodoPago
  proveedor?: PagoProveedor
  estado?: PagoEstado
  monto?: number
  moneda?: Moneda
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
