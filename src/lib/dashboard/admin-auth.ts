import { createClient } from "@/lib/supabase/server"
import { createUsersRepository } from "@/repositories/users/users.repository"

export async function requireAdminSession() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("No autenticado")
  }

  const usersRepo = createUsersRepository(supabase)
  const profile = await usersRepo.findById(user.id)

  if (profile?.tipo !== "admin") {
    throw new Error("No autorizado")
  }

  return {
    user,
    profile,
  }
}
