import type { ReservationType, Moneda } from "@/types/shared/enums"

type DatabaseJson =
  | string
  | number
  | boolean
  | null
  | { [key: string]: DatabaseJson | undefined }
  | DatabaseJson[]

// Re-export legacy alias
export type OrderItemType = ReservationType

export interface OrderItemsRow {
  id: string
  orden_id: string
  reserva_id: string
  tipo: ReservationType
  nombre: string
  descripcion_corta: string | null
  imagen_url: string | null
  cantidad: number
  precio_unitario: number
  precio_total: number
  moneda: Moneda
  metadata: DatabaseJson | null
  created_at: string | null
  updated_at: string | null
}

export interface OrderItemsInsert {
  id?: string
  orden_id: string
  reserva_id: string
  tipo: ReservationType
  nombre: string
  descripcion_corta?: string | null
  imagen_url?: string | null
  cantidad?: number
  precio_unitario: number
  precio_total: number
  moneda?: Moneda
  metadata?: DatabaseJson | null
  created_at?: string | null
  updated_at?: string | null
}

export interface OrderItemsUpdate {
  id?: string
  orden_id?: string
  reserva_id?: string
  tipo?: ReservationType
  nombre?: string
  descripcion_corta?: string | null
  imagen_url?: string | null
  cantidad?: number
  precio_unitario?: number
  precio_total?: number
  moneda?: Moneda
  metadata?: DatabaseJson | null
  created_at?: string | null
  updated_at?: string | null
}
