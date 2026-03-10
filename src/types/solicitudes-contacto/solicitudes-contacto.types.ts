export type SolicitudContactoEstado =
  | "nuevo"
  | "en_proceso"
  | "respondido"
  | "cerrado"

export interface SolicitudesContactoRow {
  id: string
  nombre_completo: string
  correo_electronico: string
  tipo_viaje: string | null
  presupuesto_estimado: string | null
  fechas_estimadas: string | null
  numero_pasajeros: number | null
  mensaje: string | null
  estado: SolicitudContactoEstado | null
  created_at: string | null
  updated_at: string | null
}

export interface SolicitudesContactoInsert {
  id?: string
  nombre_completo: string
  correo_electronico: string
  tipo_viaje?: string | null
  presupuesto_estimado?: string | null
  fechas_estimadas?: string | null
  numero_pasajeros?: number | null
  mensaje?: string | null
  estado?: SolicitudContactoEstado | null
  created_at?: string | null
  updated_at?: string | null
}

export interface SolicitudesContactoUpdate {
  id?: string
  nombre_completo?: string
  correo_electronico?: string
  tipo_viaje?: string | null
  presupuesto_estimado?: string | null
  fechas_estimadas?: string | null
  numero_pasajeros?: number | null
  mensaje?: string | null
  estado?: SolicitudContactoEstado | null
  created_at?: string | null
  updated_at?: string | null
}
