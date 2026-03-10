import { createClient } from "@supabase/supabase-js"

import {
  getSupabaseCredentials,
  getSupabaseServiceRoleKey,
} from "@/lib/supabase/config"
import type { Database } from "@/types/database/database.types"

export function createAdminClient() {
  const { url } = getSupabaseCredentials()
  const serviceRoleKey = getSupabaseServiceRoleKey()

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
