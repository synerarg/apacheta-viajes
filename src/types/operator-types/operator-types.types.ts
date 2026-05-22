export interface OperatorTypesRow {
  id: string
  nombre: string
  comision_pct: number
  descripcion: string | null
  activo: boolean
  orden: number
  created_at: string
  updated_at: string
}

export interface OperatorTypesInsert {
  id?: string
  nombre: string
  comision_pct?: number
  descripcion?: string | null
  activo?: boolean
  orden?: number
  created_at?: string
  updated_at?: string
}

export interface OperatorTypesUpdate {
  id?: string
  nombre?: string
  comision_pct?: number
  descripcion?: string | null
  activo?: boolean
  orden?: number
  created_at?: string
  updated_at?: string
}
