import type { User } from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/server"
import { createServerAuthService, type AuthService } from "@/services/auth/auth.service"

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async syncAuthenticatedUser() {
    return this.authService.syncAuthenticatedUser()
  }

  async completeOAuthSignIn(code: string) {
    return this.authService.completeOAuthSignIn(code)
  }

  async syncProfile(user: User) {
    return this.authService.syncProfile(user)
  }
}

export async function createServerAuthController() {
  const supabase = await createClient()

  return new AuthController(createServerAuthService(supabase))
}
