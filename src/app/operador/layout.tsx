import { OperadorSidebarClient } from "@/components/operador/operador-sidebar-client"

export const dynamic = "force-dynamic"

// La autenticación y autorización (login + rol operador/admin) las resuelve
// `proxy.ts` → `updateSession` en el middleware. Si llegamos hasta acá es
// porque ya tenemos sesión y rol válido, así que el layout sólo renderiza.
export default function OperadorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
      <OperadorSidebarClient />
      <main className="lg:ml-[250px] min-h-screen pt-14 lg:pt-0 overflow-y-auto bg-white">
        {children}
      </main>
    </div>
  )
}
