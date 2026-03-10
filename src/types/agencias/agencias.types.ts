export interface AgenciasRow {
  id: string
  nombre: string
  email: string
  ciudad: string | null
  provincia: string | null
  contacto_nombre: string | null
  usuario_id: string | null
  activo: boolean | null
  created_at: string | null
  updated_at: string | null
}

export interface AgenciasInsert {
  id?: string
  nombre: string
  email: string
  ciudad?: string | null
  provincia?: string | null
  contacto_nombre?: string | null
  usuario_id?: string | null
  activo?: boolean | null
  created_at?: string | null
  updated_at?: string | null
}

export interface AgenciasUpdate {
  id?: string
  nombre?: string
  email?: string
  ciudad?: string | null
  provincia?: string | null
  contacto_nombre?: string | null
  usuario_id?: string | null
  activo?: boolean | null
  created_at?: string | null
  updated_at?: string | null
}
