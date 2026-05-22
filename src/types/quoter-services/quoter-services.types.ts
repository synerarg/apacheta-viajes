export interface CotizadorServiciosRow {
  id: string
  categoria_id: string | null
  nombre: string
  descripcion: string | null
  comision_pct: number
  no_price: boolean | null
  is_special: boolean | null
  orden: number | null
  activo: boolean | null
  created_at: string | null
  updated_at: string | null
}

export interface CotizadorServiciosInsert {
  id?: string
  categoria_id?: string | null
  nombre: string
  descripcion?: string | null
  comision_pct?: number
  no_price?: boolean | null
  is_special?: boolean | null
  orden?: number | null
  activo?: boolean | null
  created_at?: string | null
  updated_at?: string | null
}

export interface CotizadorServiciosUpdate {
  id?: string
  categoria_id?: string | null
  nombre?: string
  descripcion?: string | null
  comision_pct?: number
  no_price?: boolean | null
  is_special?: boolean | null
  orden?: number | null
  activo?: boolean | null
  created_at?: string | null
  updated_at?: string | null
}
