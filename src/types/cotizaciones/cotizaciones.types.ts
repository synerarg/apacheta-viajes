export type CotizacionEstado = "borrador" | "enviada" | "archivada"

export interface CotizacionesRow {
  id: string
  token: string
  operador_id: string
  cliente_nombre: string | null
  cliente_email: string | null
  cliente_telefono: string | null
  fecha_inicio: string | null
  fecha_fin: string | null
  aplica_impuesto: boolean
  impuesto_pct: number
  total_venta: number
  total_comision: number
  total_neto: number
  total_impuesto: number
  total_final: number
  estado: CotizacionEstado
  notas_internas: string | null
  recomendaciones: string[] | null
  created_at: string
  updated_at: string
}

export interface CotizacionesInsert {
  id?: string
  token?: string
  operador_id: string
  cliente_nombre?: string | null
  cliente_email?: string | null
  cliente_telefono?: string | null
  fecha_inicio?: string | null
  fecha_fin?: string | null
  aplica_impuesto?: boolean
  impuesto_pct?: number
  total_venta?: number
  total_comision?: number
  total_neto?: number
  total_impuesto?: number
  total_final?: number
  estado?: CotizacionEstado
  notas_internas?: string | null
  recomendaciones?: string[] | null
  created_at?: string
  updated_at?: string
}

export interface CotizacionesUpdate {
  id?: string
  token?: string
  operador_id?: string
  cliente_nombre?: string | null
  cliente_email?: string | null
  cliente_telefono?: string | null
  fecha_inicio?: string | null
  fecha_fin?: string | null
  aplica_impuesto?: boolean
  impuesto_pct?: number
  total_venta?: number
  total_comision?: number
  total_neto?: number
  total_impuesto?: number
  total_final?: number
  estado?: CotizacionEstado
  notas_internas?: string | null
  recomendaciones?: string[] | null
  created_at?: string
  updated_at?: string
}
