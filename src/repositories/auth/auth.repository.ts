import type { Session, User } from "@supabase/supabase-js"

import { AuthRepositoryException } from "@/exceptions/auth/auth.exceptions"
import type { DatabaseClient } from "@/types/database/database.types"

export class AuthRepository {
  constructor(private readonly supabase: DatabaseClient) {}

  async exchangeCodeForSession(code: string): Promise<Session | null> {
    const { data, error } = await this.supabase.auth.exchangeCodeForSession(code)

    if (error) {
      throw new AuthRepositoryException("exchangeCodeForSession", error)
    }

    return data.session
  }

  async getAuthenticatedUser(): Promise<User | null> {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser()

    if (error) {
      throw new AuthRepositoryException("getAuthenticatedUser", error)
    }

    return user
  }
}

export function createAuthRepository(supabase: DatabaseClient) {
  return new AuthRepository(supabase)
}
