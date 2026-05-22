export interface HomeStatisticsRow {
  id: string
  icono: string | null
  valor: string
  descripcion: string
  orden: number | null
  activo: boolean | null
  created_at: string | null
}

export interface HomeStatisticsInsert {
  id?: string
  icono?: string | null
  valor: string
  descripcion: string
  orden?: number | null
  activo?: boolean | null
  created_at?: string | null
}

export interface HomeStatisticsUpdate {
  id?: string
  icono?: string | null
  valor?: string
  descripcion?: string
  orden?: number | null
  activo?: boolean | null
  created_at?: string | null
}
