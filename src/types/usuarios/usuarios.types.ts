export type { UsuarioTipo } from "@/types/shared/enums"
import type { UsuarioTipo } from "@/types/shared/enums"

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
