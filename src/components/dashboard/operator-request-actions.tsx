"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type Estado = "pendiente" | "en_revision" | "aprobada" | "rechazada" | "cancelada"

type TipoOption = { id: string; nombre: string }

export function OperatorRequestActions({
  requestId,
  estado,
  tipos,
  currentTipoId,
}: {
  requestId: string
  estado: Estado
  tipos: TipoOption[]
  currentTipoId?: string | null
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [motivo, setMotivo] = useState("")
  const [tipoId, setTipoId] = useState(currentTipoId ?? "")

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

  function handleApprove() {
    if (!tipoId) {
      toast.error("Elegí un tipo de operador antes de aprobar")
      return
    }
    callAction(
      `/api/dashboard/solicitudes-operador/${requestId}/aprobar`,
      { tipo_operador_id: tipoId },
      "Solicitud aprobada",
    )
  }

  function handleReject() {
    if (motivo.trim().length < 3) {
      toast.error("El motivo debe tener al menos 3 caracteres")
      return
    }
    callAction(
      `/api/dashboard/solicitudes-operador/${requestId}/rechazar`,
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
      <div className="space-y-1.5 max-w-xs">
        <Label htmlFor="tipo_operador_id">
          Tipo de operador <span className="text-rose-600">*</span>
        </Label>
        {tipos.length === 0 ? (
          <p className="text-sm text-rose-600">
            No hay tipos de operador activos. Creá uno en{" "}
            <span className="font-medium">Tipos de operador</span> antes de aprobar.
          </p>
        ) : (
          <Select value={tipoId} onValueChange={setTipoId}>
            <SelectTrigger id="tipo_operador_id" className="w-full">
              <SelectValue placeholder="Elegí el tipo a asignar" />
            </SelectTrigger>
            <SelectContent>
              {tipos.map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <p className="text-[11px] text-neutral-500">
          La clasificación del operador la define el administrador. Se asigna al aprobar.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleApprove} disabled={pending || tipos.length === 0}>
          {pending ? "Procesando..." : "Aprobar"}
        </Button>
        {estado === "pendiente" ? (
          <Button
            variant="secondary"
            onClick={() =>
              callAction(
                `/api/dashboard/solicitudes-operador/${requestId}/revisar`,
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
