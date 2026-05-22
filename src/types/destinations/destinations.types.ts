export interface DestinationsRow {
  id: string
  nombre: string
  slug: string
  descripcion_corta: string | null
  provincia: string | null
  imagen_url: string | null
  latitud: number | null
  longitud: number | null
  activo: boolean | null
  created_at: string | null
}

export interface DestinationsInsert {
  id?: string
  nombre: string
  slug: string
  descripcion_corta?: string | null
  provincia?: string | null
  imagen_url?: string | null
  latitud?: number | null
  longitud?: number | null
  activo?: boolean | null
  created_at?: string | null
}

export interface DestinationsUpdate {
  id?: string
  nombre?: string
  slug?: string
  descripcion_corta?: string | null
  provincia?: string | null
  imagen_url?: string | null
  latitud?: number | null
  longitud?: number | null
  activo?: boolean | null
  created_at?: string | null
}
