import type { Moneda } from "@/types/shared/enums"

export interface ExperienciasRow {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  descripcion_corta: string | null
  duracion_horas: number | null
  precio: number | null
  moneda: Moneda | null
  imagen_url: string | null
  ubicacion: string | null
  latitud: number | null
  longitud: number | null
  destino_id: string | null
  categoria_id: string | null
  destacado: boolean | null
  activo: boolean | null
  orden: number | null
  created_at: string | null
  updated_at: string | null
}

export interface ExperienciasInsert {
  id?: string
  nombre: string
  slug: string
  descripcion?: string | null
  descripcion_corta?: string | null
  duracion_horas?: number | null
  precio?: number | null
  moneda?: Moneda | null
  imagen_url?: string | null
  ubicacion?: string | null
  latitud?: number | null
  longitud?: number | null
  destino_id?: string | null
  categoria_id?: string | null
  destacado?: boolean | null
  activo?: boolean | null
  orden?: number | null
  created_at?: string | null
  updated_at?: string | null
}

export interface ExperienciasUpdate {
  id?: string
  nombre?: string
  slug?: string
  descripcion?: string | null
  descripcion_corta?: string | null
  duracion_horas?: number | null
  precio?: number | null
  moneda?: Moneda | null
  imagen_url?: string | null
  ubicacion?: string | null
  latitud?: number | null
  longitud?: number | null
  destino_id?: string | null
  categoria_id?: string | null
  destacado?: boolean | null
  activo?: boolean | null
  orden?: number | null
  created_at?: string | null
  updated_at?: string | null
}
