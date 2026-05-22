import { redirect } from "next/navigation"

import { DashboardSidebarClient } from "@/components/dashboard/dashboard-sidebar-client"
import { createClient } from "@/lib/supabase/server"
import { createUsersRepository } from "@/repositories/users/users.repository"
import { createUsersService } from "@/services/users/users.service"

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

  const usersService = createUsersService(
    createUsersRepository(supabase),
  )
  const profile = await usersService.get({ id: user.id })

  if (profile?.tipo !== "admin") {
    redirect("/")
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
      <DashboardSidebarClient />
      <main className="lg:ml-[250px] min-h-screen pt-14 lg:pt-0 overflow-y-auto bg-white">
        {children}
      </main>
    </div>
  )
}
