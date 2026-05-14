import type { Moneda } from "@/types/shared/enums"

export type TrasladoTipoServicio = "regular" | "privado"
export type TrasladoModalidad = "ida" | "ida_vuelta" | "punto_a_punto"
export type TrasladoVehiculoTipo =
  | "auto"
  | "combi"
  | "minibus"
  | "camioneta_4x4"
  | "bus"

export interface TrasladosRow {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  descripcion_corta: string | null
  origen: string
  destino: string
  tipo_servicio: TrasladoTipoServicio
  modalidad: TrasladoModalidad
  vehiculo_tipo: TrasladoVehiculoTipo | null
  capacidad_max: number | null
  base_minima_pax: number
  precio_desde: number
  moneda: Moneda | null
  duracion_minutos: number | null
  incluye_equipaje: boolean | null
  incluye_iva: boolean | null
  impuestos_adicionales_pct: number | null
  imagen_url: string | null
  destino_id: string | null
  activo: boolean | null
  destacado: boolean | null
  orden: number | null
  created_at: string | null
  updated_at: string | null
}

export interface TrasladosInsert {
  id?: string
  nombre: string
  slug: string
  descripcion?: string | null
  descripcion_corta?: string | null
  origen: string
  destino: string
  tipo_servicio?: TrasladoTipoServicio
  modalidad?: TrasladoModalidad
  vehiculo_tipo?: TrasladoVehiculoTipo | null
  capacidad_max?: number | null
  base_minima_pax?: number
  precio_desde?: number
  moneda?: Moneda | null
  duracion_minutos?: number | null
  incluye_equipaje?: boolean | null
  incluye_iva?: boolean | null
  impuestos_adicionales_pct?: number | null
  imagen_url?: string | null
  destino_id?: string | null
  activo?: boolean | null
  destacado?: boolean | null
  orden?: number | null
  created_at?: string | null
  updated_at?: string | null
}

export interface TrasladosUpdate {
  id?: string
  nombre?: string
  slug?: string
  descripcion?: string | null
  descripcion_corta?: string | null
  origen?: string
  destino?: string
  tipo_servicio?: TrasladoTipoServicio
  modalidad?: TrasladoModalidad
  vehiculo_tipo?: TrasladoVehiculoTipo | null
  capacidad_max?: number | null
  base_minima_pax?: number
  precio_desde?: number
  moneda?: Moneda | null
  duracion_minutos?: number | null
  incluye_equipaje?: boolean | null
  incluye_iva?: boolean | null
  impuestos_adicionales_pct?: number | null
  imagen_url?: string | null
  destino_id?: string | null
  activo?: boolean | null
  destacado?: boolean | null
  orden?: number | null
  created_at?: string | null
  updated_at?: string | null
}
