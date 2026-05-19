import type { SolicitudOperadorEstado } from "@/types/shared/enums"

export interface SolicitudesOperadorRow {
  id: string
  usuario_id: string
  estado: SolicitudOperadorEstado
  nombre_comercial: string
  documento: string | null
  telefono_contacto: string
  email_contacto: string
  sitio_web: string | null
  redes_sociales: Record<string, string> | null
  experiencia_descripcion: string | null
  zona_operacion: string | null
  motivacion: string | null
  documentacion_urls: string[] | null
  revisado_por: string | null
  revisado_at: string | null
  motivo_rechazo: string | null
  notas_internas: string | null
  created_at: string
  updated_at: string
}

export interface SolicitudesOperadorInsert {
  id?: string
  usuario_id: string
  estado?: SolicitudOperadorEstado
  nombre_comercial: string
  documento?: string | null
  telefono_contacto: string
  email_contacto: string
  sitio_web?: string | null
  redes_sociales?: Record<string, string> | null
  experiencia_descripcion?: string | null
  zona_operacion?: string | null
  motivacion?: string | null
  documentacion_urls?: string[] | null
  revisado_por?: string | null
  revisado_at?: string | null
  motivo_rechazo?: string | null
  notas_internas?: string | null
  created_at?: string
  updated_at?: string
}

export interface SolicitudesOperadorUpdate {
  id?: string
  usuario_id?: string
  estado?: SolicitudOperadorEstado
  nombre_comercial?: string
  documento?: string | null
  telefono_contacto?: string
  email_contacto?: string
  sitio_web?: string | null
  redes_sociales?: Record<string, string> | null
  experiencia_descripcion?: string | null
  zona_operacion?: string | null
  motivacion?: string | null
  documentacion_urls?: string[] | null
  revisado_por?: string | null
  revisado_at?: string | null
  motivo_rechazo?: string | null
  notas_internas?: string | null
  created_at?: string
  updated_at?: string
}
