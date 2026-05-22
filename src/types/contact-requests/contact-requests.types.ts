export type { RequestStatus } from "@/types/shared/enums"
import type { RequestStatus } from "@/types/shared/enums"

// Re-export legacy alias
export type ContactRequestStatus = RequestStatus

export interface ContactRequestsRow {
  id: string
  nombre_completo: string
  correo_electronico: string
  tipo_viaje: string | null
  presupuesto_estimado: string | null
  fechas_estimadas: string | null
  numero_pasajeros: number | null
  mensaje: string | null
  estado: RequestStatus | null
  created_at: string | null
  updated_at: string | null
}

export interface ContactRequestsInsert {
  id?: string
  nombre_completo: string
  correo_electronico: string
  tipo_viaje?: string | null
  presupuesto_estimado?: string | null
  fechas_estimadas?: string | null
  numero_pasajeros?: number | null
  mensaje?: string | null
  estado?: RequestStatus | null
  created_at?: string | null
  updated_at?: string | null
}

export interface ContactRequestsUpdate {
  id?: string
  nombre_completo?: string
  correo_electronico?: string
  tipo_viaje?: string | null
  presupuesto_estimado?: string | null
  fechas_estimadas?: string | null
  numero_pasajeros?: number | null
  mensaje?: string | null
  estado?: RequestStatus | null
  created_at?: string | null
  updated_at?: string | null
}
