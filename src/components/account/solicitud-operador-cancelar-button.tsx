"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function SolicitudOperadorCancelarButton({ solicitudId }: { solicitudId: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function cancel() {
    if (!confirm("¿Estás seguro de cancelar tu solicitud?")) return
    startTransition(async () => {
      try {
        const response = await fetch(`/api/solicitudes-operador/${solicitudId}/cancelar`, {
          method: "PATCH",
        })
        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as { error?: string } | null
          throw new Error(data?.error ?? "No se pudo cancelar la solicitud")
        }
        toast.success("Solicitud cancelada")
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error desconocido")
      }
    })
  }

  return (
    <Button onClick={cancel} disabled={pending} variant="outline" size="sm">
      {pending ? "Cancelando..." : "Cancelar solicitud"}
    </Button>
  )
}
