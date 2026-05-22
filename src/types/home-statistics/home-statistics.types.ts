export interface EstadisticasHomeRow {
  id: string
  icono: string | null
  valor: string
  descripcion: string
  orden: number | null
  activo: boolean | null
  created_at: string | null
}

export interface EstadisticasHomeInsert {
  id?: string
  icono?: string | null
  valor: string
  descripcion: string
  orden?: number | null
  activo?: boolean | null
  created_at?: string | null
}

export interface EstadisticasHomeUpdate {
  id?: string
  icono?: string | null
  valor?: string
  descripcion?: string
  orden?: number | null
  activo?: boolean | null
  created_at?: string | null
}
