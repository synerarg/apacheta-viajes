export interface CotizadorCategoriasRow {
  id: string
  nombre: string
  region: string | null
  tipo: string | null
  orden: number | null
  activo: boolean | null
  created_at: string | null
  updated_at: string | null
}

export interface CotizadorCategoriasInsert {
  id?: string
  nombre: string
  region?: string | null
  tipo?: string | null
  orden?: number | null
  activo?: boolean | null
  created_at?: string | null
  updated_at?: string | null
}

export interface CotizadorCategoriasUpdate {
  id?: string
  nombre?: string
  region?: string | null
  tipo?: string | null
  orden?: number | null
  activo?: boolean | null
  created_at?: string | null
  updated_at?: string | null
}
