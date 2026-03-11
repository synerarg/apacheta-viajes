import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import { getSupabaseCredentials } from "@/lib/supabase/config"
import type { Database } from "@/types/database/database.types"

export async function updateSession(request: NextRequest) {
  const { url, publishableKey } = getSupabaseCredentials()

  const response = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  await supabase.auth.getClaims()

  return response
}
