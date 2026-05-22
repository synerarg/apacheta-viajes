export interface QuoterCategoriesRow {
  id: string
  nombre: string
  region: string | null
  tipo: string | null
  orden: number | null
  activo: boolean | null
  created_at: string | null
  updated_at: string | null
}

export interface QuoterCategoriesInsert {
  id?: string
  nombre: string
  region?: string | null
  tipo?: string | null
  orden?: number | null
  activo?: boolean | null
  created_at?: string | null
  updated_at?: string | null
}

export interface QuoterCategoriesUpdate {
  id?: string
  nombre?: string
  region?: string | null
  tipo?: string | null
  orden?: number | null
  activo?: boolean | null
  created_at?: string | null
  updated_at?: string | null
}
