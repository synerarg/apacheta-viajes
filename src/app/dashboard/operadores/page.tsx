import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerOperadoresController } from "@/controllers/operadores/operadores.controller"
import { createServerSolicitudesOperadorController } from "@/controllers/solicitudes-operador/solicitudes-operador.controller"
import type { SolicitudesOperadorRow } from "@/types/solicitudes-operador/solicitudes-operador.types"

export const dynamic = "force-dynamic"

const statusStyles: Record<SolicitudesOperadorRow["estado"], string> = {
  pendiente: "bg-amber-100 text-amber-800",
  en_revision: "bg-blue-100 text-blue-800",
  aprobada: "bg-emerald-100 text-emerald-800",
  rechazada: "bg-rose-100 text-rose-800",
  cancelada: "bg-neutral-200 text-neutral-700",
}

const statusLabels: Record<SolicitudesOperadorRow["estado"], string> = {
  pendiente: "Pendiente",
  en_revision: "En revisión",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
  cancelada: "Cancelada",
}

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default async function DashboardOperadoresPage() {
  const operadoresController = await createServerOperadoresController()
  const solicitudesController = await createServerSolicitudesOperadorController()

  const [operadores, pendientes, enRevision] = await Promise.all([
    operadoresController.list(),
    solicitudesController.list({ estado: "pendiente" }),
    solicitudesController.list({ estado: "en_revision" }),
  ])

  const activos = operadores.filter((o) => o.activo !== false)
  const porRevisar = [...pendientes, ...enRevision].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
  const totalPorRevisar = porRevisar.length

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header className="space-y-2">
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-neutral-900">
          Operadores
        </h1>
        <p className="text-sm text-neutral-500">
          Gestioná las altas, las solicitudes pendientes y la actividad de los operadores.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{activos.length} operadores activos</CardTitle>
            <CardDescription>Con acceso al panel de cotización.</CardDescription>
          </CardHeader>
        </Card>
        <Card className={totalPorRevisar > 0 ? "border-amber-300 bg-amber-50/60" : ""}>
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>
                {totalPorRevisar} {totalPorRevisar === 1 ? "solicitud" : "solicitudes"} por revisar
              </CardTitle>
              <CardDescription>
                {pendientes.length} pendientes · {enRevision.length} en revisión
              </CardDescription>
            </div>
            <Button asChild size="sm">
              <Link href="/dashboard/operadores/solicitudes">Ver todas</Link>
            </Button>
          </CardHeader>
        </Card>
      </div>

      {/* Solicitudes pendientes — inline */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-playfair text-lg font-semibold">
            Solicitudes por revisar
          </h2>
          {totalPorRevisar > 0 ? (
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/operadores/solicitudes">Ver todas →</Link>
            </Button>
          ) : null}
        </div>

        {porRevisar.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No hay solicitudes pendientes. Cuando un usuario aplique para ser
              operador, va a aparecer acá.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {porRevisar.slice(0, 5).map((solicitud) => (
              <Link
                key={solicitud.id}
                href={`/dashboard/operadores/solicitudes/${solicitud.id}`}
                className="block"
              >
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="font-semibold text-neutral-900 truncate">
                        {solicitud.nombre_comercial}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">
                        {solicitud.email_contacto}
                        {solicitud.telefono_contacto
                          ? ` · ${solicitud.telefono_contacto}`
                          : ""}
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        Enviada el {formatDate(solicitud.created_at)}
                        {solicitud.zona_operacion ? ` · ${solicitud.zona_operacion}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[solicitud.estado]
                        }`}
                      >
                        {statusLabels[solicitud.estado]}
                      </span>
                      <span className="text-xs text-primary font-medium hidden sm:inline">
                        Revisar →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {porRevisar.length > 5 ? (
              <p className="text-center text-xs text-neutral-500 pt-2">
                +{porRevisar.length - 5} más en{" "}
                <Link
                  href="/dashboard/operadores/solicitudes"
                  className="text-primary underline"
                >
                  Ver todas las solicitudes
                </Link>
              </p>
            ) : null}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-playfair text-lg font-semibold">Operadores activos</h2>
        {activos.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Todavía no hay operadores activos. Aprobá solicitudes para sumar al equipo.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activos.map((operador) => (
              <Link
                key={operador.id}
                href={`/dashboard/operadores/${operador.id}`}
                className="block transition-shadow hover:shadow-md"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {operador.nombre_comercial ?? operador.nombre}
                    </CardTitle>
                    <CardDescription>{operador.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-neutral-600 space-y-1">
                    {operador.zona_operacion ? (
                      <p>
                        <strong>Zona:</strong> {operador.zona_operacion}
                      </p>
                    ) : null}
                    {operador.telefono_contacto ? (
                      <p>
                        <strong>Tel:</strong> {operador.telefono_contacto}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
