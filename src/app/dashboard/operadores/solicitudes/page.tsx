import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import { createServerOperatorRequestsController } from "@/controllers/operator-requests/operator-requests.controller"
import { createServerOperatorTypesController } from "@/controllers/operator-types/operator-types.controller"
import type { OperatorRequestsRow } from "@/types/operator-requests/operator-requests.types"

export const dynamic = "force-dynamic"

const TABS = [
  { key: "pendiente", label: "Pendientes" },
  { key: "en_revision", label: "En revisión" },
  { key: "aprobada", label: "Aprobadas" },
  { key: "rechazada", label: "Rechazadas" },
  { key: "cancelada", label: "Canceladas" },
] as const

type TabKey = (typeof TABS)[number]["key"]

const statusStyles: Record<OperatorRequestsRow["estado"], string> = {
  pendiente: "bg-amber-100 text-amber-800",
  en_revision: "bg-blue-100 text-blue-800",
  aprobada: "bg-emerald-100 text-emerald-800",
  rechazada: "bg-rose-100 text-rose-800",
  cancelada: "bg-neutral-200 text-neutral-700",
}

function formatDate(iso: string | null) {
  if (!iso) return ""
  return new Date(iso).toLocaleString("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export default async function OperatorRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>
}) {
  const params = await searchParams
  const activeTab: TabKey =
    (TABS.find((tab) => tab.key === params.estado)?.key as TabKey | undefined) ?? "pendiente"

  const controller = await createServerOperatorRequestsController()
  const tiposController = await createServerOperatorTypesController()
  const [solicitudes, tipos] = await Promise.all([
    controller.list({ estado: activeTab }),
    tiposController.listOrdered(),
  ])
  const tiposById = new Map(tipos.map((t) => [t.id, t]))

  return (
    <div className="p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
      <header className="space-y-2">
        <h1 className="font-playfair text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900">
          Solicitudes de operador
        </h1>
        <p className="text-sm sm:text-base text-neutral-500">
          Aprobá o rechazá pedidos de alta de operadores. Una aprobación activa el rol y le da acceso al panel.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2 border-b border-neutral-200 pb-2 -mx-3 sm:mx-0 px-3 sm:px-0 overflow-x-auto">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={`/dashboard/operadores/solicitudes?estado=${tab.key}`}
            className={`shrink-0 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {solicitudes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No hay solicitudes en este estado.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {solicitudes.map((solicitud) => {
            const tipo = solicitud.tipo_operador_id
              ? tiposById.get(solicitud.tipo_operador_id)
              : null
            return (
              <Link
                key={solicitud.id}
                href={`/dashboard/operadores/solicitudes/${solicitud.id}`}
                className="block"
              >
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1 min-w-0">
                      <p className="font-semibold text-neutral-900 break-words">{solicitud.nombre_comercial}</p>
                      <p className="text-xs text-neutral-500 break-words">
                        {solicitud.email_contacto} · {solicitud.telefono_contacto}
                      </p>
                      <p className="text-xs text-neutral-400">
                        Enviada el {formatDate(solicitud.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {tipo ? (
                        <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                          {tipo.nombre} · {Number(tipo.comision_pct).toFixed(2).replace(/\.?0+$/, "")}%
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                          Sin tipo
                        </span>
                      )}
                      <span
                        className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[solicitud.estado]
                        }`}
                      >
                        {TABS.find((tab) => tab.key === solicitud.estado)?.label ?? solicitud.estado}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
