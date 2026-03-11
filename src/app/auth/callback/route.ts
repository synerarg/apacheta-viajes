import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"
import { createServerAuthService } from "@/services/auth/auth.service"

function getSafeRedirectPath(next: string | null) {
  if (!next || !next.startsWith("/")) {
    return "/"
  }

  return next
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = getSafeRedirectPath(requestUrl.searchParams.get("next"))

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_auth_code", requestUrl.origin),
    )
  }

  try {
    const supabase = await createClient()
    const authService = createServerAuthService(supabase)

    await authService.completeOAuthSignIn(code)

    return NextResponse.redirect(new URL(next, requestUrl.origin))
  } catch {
    return NextResponse.redirect(
      new URL("/login?error=oauth_callback_failed", requestUrl.origin),
    )
  }
}
