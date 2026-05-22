export type { UserType } from "@/types/shared/enums"
import type { UserType } from "@/types/shared/enums"

export interface UsersRow {
  id: string
  nombre: string | null
  apellido: string | null
  email: string
  tipo: UserType | null
  avatar_url: string | null
  created_at: string | null
  updated_at: string | null
}

export interface UsersInsert {
  id: string
  nombre?: string | null
  apellido?: string | null
  email: string
  tipo?: UserType | null
  avatar_url?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface UsersUpdate {
  id?: string
  nombre?: string | null
  apellido?: string | null
  email?: string
  tipo?: UserType | null
  avatar_url?: string | null
  created_at?: string | null
  updated_at?: string | null
}
