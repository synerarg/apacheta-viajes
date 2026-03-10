import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import { getSupabaseCredentials } from "@/lib/supabase/config"
import type { Database } from "@/types/database/database.types"

export async function createClient() {
  const cookieStore = await cookies()
  const { url, publishableKey } = getSupabaseCredentials()

  return createServerClient<Database>(
    url,
    publishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )
}
