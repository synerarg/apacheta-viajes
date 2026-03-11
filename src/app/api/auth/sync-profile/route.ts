import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"
import { createServerAuthService } from "@/services/auth/auth.service"

export async function POST() {
  try {
    const supabase = await createClient()
    const authService = createServerAuthService(supabase)
    const profile = await authService.syncAuthenticatedUser()

    return NextResponse.json(
      {
        synced: Boolean(profile),
      },
      {
        status: 200,
      },
    )
  } catch {
    return NextResponse.json(
      {
        synced: false,
      },
      {
        status: 500,
      },
    )
  }
}
