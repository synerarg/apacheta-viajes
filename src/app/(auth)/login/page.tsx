import { redirect } from "next/navigation"

import { LoginForm } from "@/components/auth/login-form"
import { createClient } from "@/lib/supabase/server"

function getSafeNext(next: string | string[] | undefined) {
  const value = Array.isArray(next) ? next[0] : next
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/"
  }
  return value
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const params = await searchParams
    redirect(getSafeNext(params.next))
  }

  return <LoginForm />
}
