import type { Moneda } from "@/types/shared/enums"

export interface PaquetesFechasRow {
  id: string
  paquete_id: string
  fecha_inicio: string
  fecha_fin: string
  precio_por_persona: number
  moneda: Moneda | null
  cupo_total: number
  cupo_disponible: number
  activo: boolean | null
  created_at: string | null
  updated_at: string | null
}

export interface PaquetesFechasInsert {
  id?: string
  paquete_id: string
  fecha_inicio: string
  fecha_fin: string
  precio_por_persona: number
  moneda?: Moneda | null
  cupo_total: number
  cupo_disponible: number
  activo?: boolean | null
  created_at?: string | null
  updated_at?: string | null
}

export interface PaquetesFechasUpdate {
  id?: string
  paquete_id?: string
  fecha_inicio?: string
  fecha_fin?: string
  precio_por_persona?: number
  moneda?: Moneda | null
  cupo_total?: number
  cupo_disponible?: number
  activo?: boolean | null
  created_at?: string | null
  updated_at?: string | null
}
