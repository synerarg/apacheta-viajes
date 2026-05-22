export interface CotizacionesItemsRow {
  id: string
  cotizacion_id: string
  servicio_id: string | null
  dia_offset: number
  fecha: string | null
  servicio_nombre: string
  servicio_descripcion: string | null
  adultos: number
  menores: number
  precio_adulto_unit: number
  precio_menor_unit: number | null
  comision_pct: number
  subtotal_venta: number
  subtotal_comision: number
  subtotal_neto: number
  is_special: boolean
  orden: number
  created_at: string
}

export interface CotizacionesItemsInsert {
  id?: string
  cotizacion_id: string
  servicio_id?: string | null
  dia_offset?: number
  fecha?: string | null
  servicio_nombre: string
  servicio_descripcion?: string | null
  adultos?: number
  menores?: number
  precio_adulto_unit?: number
  precio_menor_unit?: number | null
  comision_pct?: number
  subtotal_venta?: number
  subtotal_comision?: number
  subtotal_neto?: number
  is_special?: boolean
  orden?: number
  created_at?: string
}

export interface CotizacionesItemsUpdate {
  id?: string
  cotizacion_id?: string
  servicio_id?: string | null
  dia_offset?: number
  fecha?: string | null
  servicio_nombre?: string
  servicio_descripcion?: string | null
  adultos?: number
  menores?: number
  precio_adulto_unit?: number
  precio_menor_unit?: number | null
  comision_pct?: number
  subtotal_venta?: number
  subtotal_comision?: number
  subtotal_neto?: number
  is_special?: boolean
  orden?: number
  created_at?: string
}
