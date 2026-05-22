export interface OperadoresRow {
  id: string
  nombre: string
  email: string
  ciudad: string | null
  provincia: string | null
  contacto_nombre: string | null
  usuario_id: string | null
  activo: boolean | null
  nombre_comercial: string | null
  documento: string | null
  telefono_contacto: string | null
  sitio_web: string | null
  redes_sociales: Record<string, string> | null
  experiencia_descripcion: string | null
  zona_operacion: string | null
  documentacion_urls: string[] | null
  created_at: string | null
  updated_at: string | null
}

export interface OperadoresInsert {
  id?: string
  nombre: string
  email: string
  ciudad?: string | null
  provincia?: string | null
  contacto_nombre?: string | null
  usuario_id?: string | null
  activo?: boolean | null
  nombre_comercial?: string | null
  documento?: string | null
  telefono_contacto?: string | null
  sitio_web?: string | null
  redes_sociales?: Record<string, string> | null
  experiencia_descripcion?: string | null
  zona_operacion?: string | null
  documentacion_urls?: string[] | null
  created_at?: string | null
  updated_at?: string | null
}

export interface OperadoresUpdate {
  id?: string
  nombre?: string
  email?: string
  ciudad?: string | null
  provincia?: string | null
  contacto_nombre?: string | null
  usuario_id?: string | null
  activo?: boolean | null
  nombre_comercial?: string | null
  documento?: string | null
  telefono_contacto?: string | null
  sitio_web?: string | null
  redes_sociales?: Record<string, string> | null
  experiencia_descripcion?: string | null
  zona_operacion?: string | null
  documentacion_urls?: string[] | null
  created_at?: string | null
  updated_at?: string | null
}
