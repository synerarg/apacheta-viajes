import type { Session, User } from "@supabase/supabase-js"

import { AuthServiceException } from "@/exceptions/auth/auth.exceptions"
import { createAuthRepository, type AuthRepository } from "@/repositories/auth/auth.repository"
import { createUsersRepository } from "@/repositories/users/users.repository"
import type { UsersService } from "@/services/users/users.service"
import { createUsersService } from "@/services/users/users.service"
import type { DatabaseClient } from "@/types/database/database.types"
import type {
  UsersInsert,
  UsersRow,
  UsersUpdate,
} from "@/types/users/users.types"

interface CreateAuthServiceOptions {
  authRepository: AuthRepository
  usersService: UsersService
}

function getMetadataValue(
  metadata: User["user_metadata"],
  key: string,
): string | null {
  const value = metadata?.[key]

  return typeof value === "string" && value.trim().length > 0 ? value : null
}

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersService: UsersService,
  ) {}

  private buildUsersPayload(user: User): UsersInsert {
    const email = user.email

    if (!email) {
      throw new AuthServiceException(
        "buildUsersPayload",
        new Error("No pudimos recuperar el correo de la cuenta autenticada."),
      )
    }

    const fullName =
      getMetadataValue(user.user_metadata, "full_name") ??
      getMetadataValue(user.user_metadata, "name")
    const givenName = getMetadataValue(user.user_metadata, "given_name")
    const familyName = getMetadataValue(user.user_metadata, "family_name")
    const avatarUrl =
      getMetadataValue(user.user_metadata, "avatar_url") ??
      getMetadataValue(user.user_metadata, "picture")

    const [firstNameFromFullName, ...lastNameParts] = fullName
      ? fullName.split(" ").filter(Boolean)
      : []
    const lastNameFromFullName = lastNameParts.join(" ") || null

    return {
      id: user.id,
      email,
      nombre: givenName ?? firstNameFromFullName ?? null,
      apellido: familyName ?? lastNameFromFullName,
      avatar_url: avatarUrl,
      tipo: "cliente",
    }
  }

  private buildUsersUpdate(
    currentUser: UsersRow,
    payload: UsersInsert,
  ): UsersUpdate {
    return {
      email: payload.email,
      nombre: payload.nombre ?? currentUser.nombre,
      apellido: payload.apellido ?? currentUser.apellido,
      avatar_url: payload.avatar_url ?? currentUser.avatar_url,
    }
  }

  async syncAuthenticatedUser(): Promise<UsersRow | null> {
    try {
      const user = await this.authRepository.getAuthenticatedUser()

      if (!user) {
        return null
      }

      return await this.syncProfile(user)
    } catch (error) {
      throw new AuthServiceException("syncAuthenticatedUser", error)
    }
  }

  async completeOAuthSignIn(code: string): Promise<Session | null> {
    try {
      const session = await this.authRepository.exchangeCodeForSession(code)

      if (session?.user) {
        await this.syncProfile(session.user)
      }

      return session
    } catch (error) {
      throw new AuthServiceException("completeOAuthSignIn", error)
    }
  }

  async syncProfile(user: User): Promise<UsersRow> {
    try {
      const payload = this.buildUsersPayload(user)
      const currentProfile = await this.usersService.get({ id: user.id })

      if (!currentProfile) {
        return await this.usersService.create(payload)
      }

      return await this.usersService.updateById(
        user.id,
        this.buildUsersUpdate(currentProfile, payload),
      )
    } catch (error) {
      throw new AuthServiceException("syncProfile", error)
    }
  }
}

export function createAuthService({
  authRepository,
  usersService,
}: CreateAuthServiceOptions) {
  return new AuthService(authRepository, usersService)
}

export function createServerAuthService(supabase: DatabaseClient) {
  return createAuthService({
    authRepository: createAuthRepository(supabase),
    usersService: createUsersService(createUsersRepository(supabase)),
  })
}
