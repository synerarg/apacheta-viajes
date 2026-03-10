export interface CategoriasExperienciaRow {
  id: string
  nombre: string
  slug: string
  activo: boolean | null
  orden: number | null
  created_at: string | null
}

export interface CategoriasExperienciaInsert {
  id?: string
  nombre: string
  slug: string
  activo?: boolean | null
  orden?: number | null
  created_at?: string | null
}

export interface CategoriasExperienciaUpdate {
  id?: string
  nombre?: string
  slug?: string
  activo?: boolean | null
  orden?: number | null
  created_at?: string | null
}
