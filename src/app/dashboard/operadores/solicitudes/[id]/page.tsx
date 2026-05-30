import Link from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OperatorRequestActions } from "@/components/dashboard/operator-request-actions"
import { createServerOperatorRequestsController } from "@/controllers/operator-requests/operator-requests.controller"
import { createServerOperatorTypesController } from "@/controllers/operator-types/operator-types.controller"
import { OperatorRequestsNotFoundException } from "@/exceptions/operator-requests/operator-requests.exceptions"
import type { OperatorRequestsRow } from "@/types/operator-requests/operator-requests.types"

export const dynamic = "force-dynamic"

const statusStyles: Record<OperatorRequestsRow["estado"], string> = {
  pendiente: "bg-amber-100 text-amber-800",
  en_revision: "bg-blue-100 text-blue-800",
  aprobada: "bg-emerald-100 text-emerald-800",
  rechazada: "bg-rose-100 text-rose-800",
  cancelada: "bg-neutral-200 text-neutral-700",
}

const statusLabels: Record<OperatorRequestsRow["estado"], string> = {
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
    <div className="space-y-1 min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="text-sm text-neutral-900 whitespace-pre-line break-words">{value}</p>
    </div>
  )
}

export default async function OperatorRequestDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let solicitud: OperatorRequestsRow
  try {
    const controller = await createServerOperatorRequestsController()
    solicitud = await controller.getById(id)
  } catch (error) {
    if (error instanceof OperatorRequestsNotFoundException) {
      notFound()
    }
    throw error
  }

  const tiposController = await createServerOperatorTypesController()
  const tipos = await tiposController.listActiveOrdered()
  const tipo = solicitud.tipo_operador_id
    ? tipos.find((t) => t.id === solicitud.tipo_operador_id) ??
      (await tiposController.getById(solicitud.tipo_operador_id).catch(() => null))
    : null
  const tipoLabel = tipo
    ? `${tipo.nombre} · ${Number(tipo.comision_pct).toFixed(2).replace(/\.?0+$/, "")}% comisión`
    : "No especificado"

  return (
    <div className="p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-wrap items-center gap-3">
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
          <CardTitle className="text-xl sm:text-2xl break-words">{solicitud.nombre_comercial}</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Solicitud enviada el {formatDate(solicitud.created_at)}
            {solicitud.revisado_at
              ? ` · Última revisión el ${formatDate(solicitud.revisado_at)}`
              : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Tipo de operador" value={tipoLabel} />
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
          <OperatorRequestActions
            requestId={solicitud.id}
            estado={solicitud.estado}
            tipos={tipos.map((t) => ({ id: t.id, nombre: t.nombre }))}
            currentTipoId={solicitud.tipo_operador_id}
          />
        </CardContent>
      </Card>
    </div>
  )
}
