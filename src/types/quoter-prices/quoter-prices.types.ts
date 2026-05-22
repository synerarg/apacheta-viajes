export interface CotizadorPreciosRow {
  id: string
  servicio_id: string
  temporada: string
  vigencia_desde: string | null
  vigencia_hasta: string | null
  precio_adulto: number
  precio_menor: number | null
  moneda: string
  comision_pct_override: number | null
  notas: string | null
  created_at: string | null
  updated_at: string | null
}

export interface CotizadorPreciosInsert {
  id?: string
  servicio_id: string
  temporada: string
  vigencia_desde?: string | null
  vigencia_hasta?: string | null
  precio_adulto: number
  precio_menor?: number | null
  moneda?: string
  comision_pct_override?: number | null
  notas?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface CotizadorPreciosUpdate {
  id?: string
  servicio_id?: string
  temporada?: string
  vigencia_desde?: string | null
  vigencia_hasta?: string | null
  precio_adulto?: number
  precio_menor?: number | null
  moneda?: string
  comision_pct_override?: number | null
  notas?: string | null
  created_at?: string | null
  updated_at?: string | null
}
