import type { Moneda } from "@/types/shared/enums"

export interface PaquetesRow {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  descripcion_corta: string | null
  duracion_dias: number
  precio_desde: number
  moneda: Moneda | null
  imagen_url: string | null
  destino_id: string | null
  incluye_alojamiento: boolean | null
  incluye_traslado: boolean | null
  incluye_comidas: boolean | null
  incluye_guia: boolean | null
  incluye_entradas: boolean | null
  destacado: boolean | null
  activo: boolean | null
  orden: number | null
  created_at: string | null
  updated_at: string | null
}

export interface PaquetesInsert {
  id?: string
  nombre: string
  slug: string
  descripcion?: string | null
  descripcion_corta?: string | null
  duracion_dias?: number
  precio_desde: number
  moneda?: Moneda | null
  imagen_url?: string | null
  destino_id?: string | null
  incluye_alojamiento?: boolean | null
  incluye_traslado?: boolean | null
  incluye_comidas?: boolean | null
  incluye_guia?: boolean | null
  incluye_entradas?: boolean | null
  destacado?: boolean | null
  activo?: boolean | null
  orden?: number | null
  created_at?: string | null
  updated_at?: string | null
}

export interface PaquetesUpdate {
  id?: string
  nombre?: string
  slug?: string
  descripcion?: string | null
  descripcion_corta?: string | null
  duracion_dias?: number
  precio_desde?: number
  moneda?: Moneda | null
  imagen_url?: string | null
  destino_id?: string | null
  incluye_alojamiento?: boolean | null
  incluye_traslado?: boolean | null
  incluye_comidas?: boolean | null
  incluye_guia?: boolean | null
  incluye_entradas?: boolean | null
  destacado?: boolean | null
  activo?: boolean | null
  orden?: number | null
  created_at?: string | null
  updated_at?: string | null
}
