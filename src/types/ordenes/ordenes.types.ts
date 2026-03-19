export type { OrdenEstado, PagoEstado, MetodoPago } from "@/types/shared/enums"
import type { OrdenEstado, PagoEstado, MetodoPago, Moneda } from "@/types/shared/enums"

type DatabaseJson =
  | string
  | number
  | boolean
  | null
  | { [key: string]: DatabaseJson | undefined }
  | DatabaseJson[]

// Re-export legacy aliases for backwards compatibility
export type OrdenEstadoPago = PagoEstado
export type OrdenMetodoPago = MetodoPago

export interface OrdenesRow {
  id: string
  usuario_id: string
  codigo_referencia: string
  estado: OrdenEstado
  estado_pago: PagoEstado
  metodo_pago: MetodoPago
  total: number
  moneda: Moneda
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
  estado_pago?: PagoEstado
  metodo_pago: MetodoPago
  total: number
  moneda?: Moneda
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
  estado_pago?: PagoEstado
  metodo_pago?: MetodoPago
  total?: number
  moneda?: Moneda
  contacto?: DatabaseJson | null
  pasajero_principal?: DatabaseJson | null
  notas?: string | null
  created_at?: string | null
  updated_at?: string | null
}
