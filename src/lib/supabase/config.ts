function getRequiredEnvironmentVariable(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export function getSupabaseCredentials() {
  return {
    url: getRequiredEnvironmentVariable("NEXT_PUBLIC_SUPABASE_URL"),
    publishableKey: getRequiredEnvironmentVariable(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
    ),
  }
}

export function getSupabaseServiceRoleKey() {
  return getRequiredEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY")
}
