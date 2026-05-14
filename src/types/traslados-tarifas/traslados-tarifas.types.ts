import type { Moneda } from "@/types/shared/enums"

export interface TrasladosTarifasRow {
  id: string
  traslado_id: string
  vigencia_label: string
  vigencia_desde: string | null
  vigencia_hasta: string | null
  precio_adulto: number
  precio_nino: number | null
  moneda: Moneda | null
  comision_pct: number | null
  notas: string | null
  orden: number | null
  created_at: string | null
  updated_at: string | null
}

export interface TrasladosTarifasInsert {
  id?: string
  traslado_id: string
  vigencia_label: string
  vigencia_desde?: string | null
  vigencia_hasta?: string | null
  precio_adulto: number
  precio_nino?: number | null
  moneda?: Moneda | null
  comision_pct?: number | null
  notas?: string | null
  orden?: number | null
  created_at?: string | null
  updated_at?: string | null
}

export interface TrasladosTarifasUpdate {
  id?: string
  traslado_id?: string
  vigencia_label?: string
  vigencia_desde?: string | null
  vigencia_hasta?: string | null
  precio_adulto?: number
  precio_nino?: number | null
  moneda?: Moneda | null
  comision_pct?: number | null
  notas?: string | null
  orden?: number | null
  created_at?: string | null
  updated_at?: string | null
}
