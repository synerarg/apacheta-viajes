export interface QuoterPricesRow {
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

export interface QuoterPricesInsert {
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

export interface QuoterPricesUpdate {
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
