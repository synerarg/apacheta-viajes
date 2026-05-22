export type { PaymentStatus, PaymentMethod, PaymentProvider } from "@/types/shared/enums"
import type { PaymentStatus, PaymentMethod, PaymentProvider, Moneda } from "@/types/shared/enums"

type DatabaseJson =
  | string
  | number
  | boolean
  | null
  | { [key: string]: DatabaseJson | undefined }
  | DatabaseJson[]

export interface PaymentsRow {
  id: string
  orden_id: string
  metodo: PaymentMethod
  proveedor: PaymentProvider
  estado: PaymentStatus
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

export interface PaymentsInsert {
  id?: string
  orden_id: string
  metodo: PaymentMethod
  proveedor: PaymentProvider
  estado?: PaymentStatus
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

export interface PaymentsUpdate {
  id?: string
  orden_id?: string
  metodo?: PaymentMethod
  proveedor?: PaymentProvider
  estado?: PaymentStatus
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
