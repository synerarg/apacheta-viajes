export interface OutboundDestinationsRow {
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

export interface OutboundDestinationsInsert {
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

export interface OutboundDestinationsUpdate {
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
