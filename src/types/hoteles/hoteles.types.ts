export interface HotelesRow {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  descripcion_corta: string | null
  estrellas: number | null
  direccion: string | null
  ciudad: string | null
  provincia: string | null
  latitud: number | null
  longitud: number | null
  imagen_url: string | null
  destino_id: string | null
  activo: boolean | null
  orden: number | null
  created_at: string | null
  updated_at: string | null
}

export interface HotelesInsert {
  id?: string
  nombre: string
  slug: string
  descripcion?: string | null
  descripcion_corta?: string | null
  estrellas?: number | null
  direccion?: string | null
  ciudad?: string | null
  provincia?: string | null
  latitud?: number | null
  longitud?: number | null
  imagen_url?: string | null
  destino_id?: string | null
  activo?: boolean | null
  orden?: number | null
  created_at?: string | null
  updated_at?: string | null
}

export interface HotelesUpdate {
  id?: string
  nombre?: string
  slug?: string
  descripcion?: string | null
  descripcion_corta?: string | null
  estrellas?: number | null
  direccion?: string | null
  ciudad?: string | null
  provincia?: string | null
  latitud?: number | null
  longitud?: number | null
  imagen_url?: string | null
  destino_id?: string | null
  activo?: boolean | null
  orden?: number | null
  created_at?: string | null
  updated_at?: string | null
}
