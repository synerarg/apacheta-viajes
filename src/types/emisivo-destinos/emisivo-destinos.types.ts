export interface EmisivoDestinosRow {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  descripcion_corta: string | null
  pais: string
  imagen_url: string | null
  activo: boolean | null
  orden: number | null
  created_at: string | null
  updated_at: string | null
}

export interface EmisivoDestinosInsert {
  id?: string
  nombre: string
  slug: string
  descripcion?: string | null
  descripcion_corta?: string | null
  pais: string
  imagen_url?: string | null
  activo?: boolean | null
  orden?: number | null
  created_at?: string | null
  updated_at?: string | null
}

export interface EmisivoDestinosUpdate {
  id?: string
  nombre?: string
  slug?: string
  descripcion?: string | null
  descripcion_corta?: string | null
  pais?: string
  imagen_url?: string | null
  activo?: boolean | null
  orden?: number | null
  created_at?: string | null
  updated_at?: string | null
}
