import Link from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SolicitudOperadorActions } from "@/components/dashboard/solicitud-operador-actions"
import { createServerSolicitudesOperadorController } from "@/controllers/solicitudes-operador/solicitudes-operador.controller"
import { SolicitudesOperadorNotFoundException } from "@/exceptions/solicitudes-operador/solicitudes-operador.exceptions"
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
  if (!iso) return ""
  return new Date(iso).toLocaleString("es-AR", { dateStyle: "long", timeStyle: "short" })
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="text-sm text-neutral-900 whitespace-pre-line">{value}</p>
    </div>
  )
}

export default async function SolicitudOperadorDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let solicitud: SolicitudesOperadorRow
  try {
    const controller = await createServerSolicitudesOperadorController()
    solicitud = await controller.getById(id)
  } catch (error) {
    if (error instanceof SolicitudesOperadorNotFoundException) {
      notFound()
    }
    throw error
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/operadores/solicitudes">← Volver</Link>
        </Button>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusStyles[solicitud.estado]}`}
        >
          {statusLabels[solicitud.estado]}
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{solicitud.nombre_comercial}</CardTitle>
          <CardDescription>
            Solicitud enviada el {formatDate(solicitud.created_at)}
            {solicitud.revisado_at
              ? ` · Última revisión el ${formatDate(solicitud.revisado_at)}`
              : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email de contacto" value={solicitud.email_contacto} />
            <Field label="Teléfono" value={solicitud.telefono_contacto} />
            <Field label="Documento / CUIT" value={solicitud.documento} />
            <Field label="Zona de operación" value={solicitud.zona_operacion} />
            <Field label="Sitio web" value={solicitud.sitio_web} />
          </div>
          <Field label="Experiencia previa" value={solicitud.experiencia_descripcion} />
          <Field label="Motivación" value={solicitud.motivacion} />
          {solicitud.motivo_rechazo ? (
            <div className="rounded-md border border-rose-200 bg-rose-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-rose-700">
                Motivo de rechazo registrado
              </p>
              <p className="mt-1 text-sm text-rose-900 whitespace-pre-line">
                {solicitud.motivo_rechazo}
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acciones</CardTitle>
          <CardDescription>
            Las acciones de aprobación cambian el rol del usuario y le dan acceso inmediato al panel de operador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SolicitudOperadorActions solicitudId={solicitud.id} estado={solicitud.estado} />
        </CardContent>
      </Card>
    </div>
  )
}
