export type { ReservationType, ReservationStatus } from "@/types/shared/enums"
import type { ReservationType, ReservationStatus, Moneda } from "@/types/shared/enums"

export interface ReservationsRow {
  id: string
  usuario_id: string
  paquete_fecha_id: string | null
  experiencia_id: string | null
  tipo: ReservationType
  estado: ReservationStatus | null
  cantidad_pasajeros: number
  precio_unitario: number
  precio_total: number
  moneda: Moneda | null
  notas: string | null
  created_at: string | null
  updated_at: string | null
}

export interface ReservationsInsert {
  id?: string
  usuario_id: string
  paquete_fecha_id?: string | null
  experiencia_id?: string | null
  tipo: ReservationType
  estado?: ReservationStatus | null
  cantidad_pasajeros?: number
  precio_unitario: number
  precio_total: number
  moneda?: Moneda | null
  notas?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface ReservationsUpdate {
  id?: string
  usuario_id?: string
  paquete_fecha_id?: string | null
  experiencia_id?: string | null
  tipo?: ReservationType
  estado?: ReservationStatus | null
  cantidad_pasajeros?: number
  precio_unitario?: number
  precio_total?: number
  moneda?: Moneda | null
  notas?: string | null
  created_at?: string | null
  updated_at?: string | null
}
