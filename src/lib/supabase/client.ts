import { createBrowserClient } from "@supabase/ssr"

import { getSupabaseCredentials } from "@/lib/supabase/config"
import type { Database } from "@/types/database/database.types"

export function createClient() {
  const { url, publishableKey } = getSupabaseCredentials()

  return createBrowserClient<Database>(url, publishableKey)
}
