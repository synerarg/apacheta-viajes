import { OperatorSidebarClient } from "@/components/operator/operator-sidebar-client"
import { createServerOperatorsController } from "@/controllers/operators/operators.controller"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

// La autenticación y autorización (login + rol operador/admin) las resuelve
// `proxy.ts` → `updateSession` en el middleware. Si llegamos hasta acá es
// porque ya tenemos sesión y rol válido, así que el layout sólo renderiza.
export default async function OperatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let tier: { nombre: string; comisionPct: number } | null = null
  if (user) {
    try {
      const controller = await createServerOperatorsController()
      const operator = await controller.findByUserIdWithTier(user.id)
      if (operator?.tipo_operador) {
        tier = {
          nombre: operator.tipo_operador.nombre,
          comisionPct: operator.tipo_operador.comision_pct,
        }
      }
    } catch {
      tier = null
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
      <OperatorSidebarClient tier={tier} />
      <main className="lg:ml-[250px] min-h-screen pt-14 lg:pt-0 overflow-y-auto bg-white">
        {children}
      </main>
    </div>
  )
}
