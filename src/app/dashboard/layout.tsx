import { redirect } from "next/navigation"

import { DashboardSidebarClient } from "@/components/dashboard/dashboard-sidebar-client"
import { createClient } from "@/lib/supabase/server"
import { createUsuariosRepository } from "@/repositories/usuarios/usuarios.repository"
import { createUsuariosService } from "@/services/usuarios/usuarios.service"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const usuariosService = createUsuariosService(
    createUsuariosRepository(supabase),
  )
  const profile = await usuariosService.get({ id: user.id })

  if (profile?.tipo !== "admin") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-white">
      <DashboardSidebarClient />
      <main className="lg:ml-[250px] min-h-screen pt-14 lg:pt-0 overflow-y-auto bg-white">
        {children}
      </main>
    </div>
  )
}
