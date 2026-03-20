import { NavbarClient } from "@/components/layout/navbar-client"
import { createClient } from "@/lib/supabase/server"
import { createUsuariosRepository } from "@/repositories/usuarios/usuarios.repository"
import { createUsuariosService } from "@/services/usuarios/usuarios.service"

export async function Navbar() {
  const supabase = await createClient()
  const usuariosService = createUsuariosService(createUsuariosRepository(supabase))
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <NavbarClient user={null} />
  }

  const profile = await usuariosService.get({ id: user.id })

  return (
    <NavbarClient
      user={{
        id: user.id,
        email: user.email ?? null,
        nombre: profile?.nombre ?? null,
        apellido: profile?.apellido ?? null,
        avatarUrl: profile?.avatar_url ?? null,
        tipo: profile?.tipo ?? null,
      }}
    />
  )
}
