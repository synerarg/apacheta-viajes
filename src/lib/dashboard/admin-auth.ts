import { createClient } from "@/lib/supabase/server"
import { createUsuariosRepository } from "@/repositories/usuarios/usuarios.repository"

export async function requireAdminSession() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("No autenticado")
  }

  const usuariosRepo = createUsuariosRepository(supabase)
  const profile = await usuariosRepo.findById(user.id)

  if (profile?.tipo !== "admin") {
    throw new Error("No autorizado")
  }

  return {
    user,
    profile,
  }
}
