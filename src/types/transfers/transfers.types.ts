import type { Moneda } from "@/types/shared/enums"

export type TransferServiceType = "regular" | "privado"
export type TransferModality = "ida" | "ida_vuelta" | "punto_a_punto"
export type TransferVehicleType =
  | "auto"
  | "combi"
  | "minibus"
  | "camioneta_4x4"
  | "bus"

export interface TransfersRow {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  descripcion_corta: string | null
  origen: string
  destino: string
  tipo_servicio: TransferServiceType
  modalidad: TransferModality
  vehiculo_tipo: TransferVehicleType | null
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

export interface TransfersInsert {
  id?: string
  nombre: string
  slug: string
  descripcion?: string | null
  descripcion_corta?: string | null
  origen: string
  destino: string
  tipo_servicio?: TransferServiceType
  modalidad?: TransferModality
  vehiculo_tipo?: TransferVehicleType | null
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

export interface TransfersUpdate {
  id?: string
  nombre?: string
  slug?: string
  descripcion?: string | null
  descripcion_corta?: string | null
  origen?: string
  destino?: string
  tipo_servicio?: TransferServiceType
  modalidad?: TransferModality
  vehiculo_tipo?: TransferVehicleType | null
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
