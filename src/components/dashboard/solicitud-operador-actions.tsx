"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type Estado = "pendiente" | "en_revision" | "aprobada" | "rechazada" | "cancelada"

export function SolicitudOperadorActions({
  solicitudId,
  estado,
}: {
  solicitudId: string
  estado: Estado
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [motivo, setMotivo] = useState("")

  function callAction(path: string, body?: unknown, successMessage?: string) {
    startTransition(async () => {
      try {
        const response = await fetch(path, {
          method: "PATCH",
          headers: body ? { "Content-Type": "application/json" } : undefined,
          body: body ? JSON.stringify(body) : undefined,
        })
        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as { error?: string } | null
          throw new Error(data?.error ?? "La acción falló")
        }
        toast.success(successMessage ?? "Acción completada")
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error desconocido")
      }
    })
  }

  function handleReject() {
    if (motivo.trim().length < 3) {
      toast.error("El motivo debe tener al menos 3 caracteres")
      return
    }
    callAction(
      `/api/dashboard/solicitudes-operador/${solicitudId}/rechazar`,
      { motivo: motivo.trim() },
      "Solicitud rechazada",
    )
  }

  if (estado === "aprobada" || estado === "rechazada" || estado === "cancelada") {
    return (
      <p className="text-sm text-muted-foreground">
        Esta solicitud ya fue {estado}. No se pueden ejecutar más acciones.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() =>
            callAction(
              `/api/dashboard/solicitudes-operador/${solicitudId}/aprobar`,
              undefined,
              "Solicitud aprobada",
            )
          }
          disabled={pending}
        >
          {pending ? "Procesando..." : "Aprobar"}
        </Button>
        {estado === "pendiente" ? (
          <Button
            variant="secondary"
            onClick={() =>
              callAction(
                `/api/dashboard/solicitudes-operador/${solicitudId}/revisar`,
                undefined,
                "Marcada en revisión",
              )
            }
            disabled={pending}
          >
            Marcar en revisión
          </Button>
        ) : null}
        <Button
          variant="destructive"
          onClick={() => setShowRejectForm((prev) => !prev)}
          disabled={pending}
        >
          {showRejectForm ? "Cancelar rechazo" : "Rechazar"}
        </Button>
      </div>
      {showRejectForm ? (
        <div className="space-y-2 rounded-md border border-rose-200 bg-rose-50 p-4">
          <label className="text-sm font-medium text-rose-900">Motivo del rechazo</label>
          <Textarea
            rows={3}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="El usuario verá este motivo en su email y en el panel."
          />
          <Button variant="destructive" onClick={handleReject} disabled={pending}>
            {pending ? "Procesando..." : "Confirmar rechazo"}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
