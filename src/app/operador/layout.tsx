import { redirect } from "next/navigation"

import { OperadorSidebarClient } from "@/components/operador/operador-sidebar-client"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function OperadorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/operador")
  }

  const { data: profile } = await supabase
    .from("usuarios")
    .select("tipo")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.tipo !== "operador" && profile?.tipo !== "admin") {
    redirect("/account/operador")
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-50">
      <OperadorSidebarClient />
      <main className="lg:ml-[250px] min-h-screen pt-14 lg:pt-0 overflow-y-auto bg-neutral-50">
        {children}
      </main>
    </div>
  )
}
