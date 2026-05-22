export type { ReservaTipo, ReservaEstado } from "@/types/shared/enums"
import type { ReservaTipo, ReservaEstado, Moneda } from "@/types/shared/enums"

export interface ReservasRow {
  id: string
  usuario_id: string
  paquete_fecha_id: string | null
  experiencia_id: string | null
  tipo: ReservaTipo
  estado: ReservaEstado | null
  cantidad_pasajeros: number
  precio_unitario: number
  precio_total: number
  moneda: Moneda | null
  notas: string | null
  created_at: string | null
  updated_at: string | null
}

export interface ReservasInsert {
  id?: string
  usuario_id: string
  paquete_fecha_id?: string | null
  experiencia_id?: string | null
  tipo: ReservaTipo
  estado?: ReservaEstado | null
  cantidad_pasajeros?: number
  precio_unitario: number
  precio_total: number
  moneda?: Moneda | null
  notas?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface ReservasUpdate {
  id?: string
  usuario_id?: string
  paquete_fecha_id?: string | null
  experiencia_id?: string | null
  tipo?: ReservaTipo
  estado?: ReservaEstado | null
  cantidad_pasajeros?: number
  precio_unitario?: number
  precio_total?: number
  moneda?: Moneda | null
  notas?: string | null
  created_at?: string | null
  updated_at?: string | null
}
