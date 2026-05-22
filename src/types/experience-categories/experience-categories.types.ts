export interface ExperienceCategoriesRow {
  id: string
  nombre: string
  slug: string
  activo: boolean | null
  orden: number | null
  created_at: string | null
}

export interface ExperienceCategoriesInsert {
  id?: string
  nombre: string
  slug: string
  activo?: boolean | null
  orden?: number | null
  created_at?: string | null
}

export interface ExperienceCategoriesUpdate {
  id?: string
  nombre?: string
  slug?: string
  activo?: boolean | null
  orden?: number | null
  created_at?: string | null
}
