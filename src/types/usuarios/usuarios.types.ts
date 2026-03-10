export type UsuarioTipo = "cliente" | "agencia" | "admin"

export interface UsuariosRow {
  id: string
  nombre: string | null
  apellido: string | null
  email: string
  tipo: UsuarioTipo | null
  avatar_url: string | null
  created_at: string | null
  updated_at: string | null
}

export interface UsuariosInsert {
  id: string
  nombre?: string | null
  apellido?: string | null
  email: string
  tipo?: UsuarioTipo | null
  avatar_url?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface UsuariosUpdate {
  id?: string
  nombre?: string | null
  apellido?: string | null
  email?: string
  tipo?: UsuarioTipo | null
  avatar_url?: string | null
  created_at?: string | null
  updated_at?: string | null
}
