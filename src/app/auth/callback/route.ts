import { NextResponse } from "next/server"

import { createServerAuthController } from "@/controllers/auth/auth.controller"

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
    const authController = await createServerAuthController()

    await authController.completeOAuthSignIn(code)

    return NextResponse.redirect(new URL(next, requestUrl.origin))
  } catch {
    return NextResponse.redirect(
      new URL("/login?error=oauth_callback_failed", requestUrl.origin),
    )
  }
}
