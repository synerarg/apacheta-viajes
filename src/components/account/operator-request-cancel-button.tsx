"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function SolicitudOperadorCancelarButton({
  solicitudId,
}: {
  solicitudId: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleConfirm() {
    setOpen(false)
    startTransition(async () => {
      try {
        const response = await fetch(
          `/api/solicitudes-operador/${solicitudId}/cancelar`,
          { method: "PATCH" },
        )
        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as {
            error?: string
          } | null
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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button disabled={pending} variant="outline" size="sm">
          {pending ? "Cancelando..." : "Cancelar solicitud"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar solicitud</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que querés cancelar tu solicitud? Vas a tener que
            volver a postularte si cambiás de opinión.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Volver</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              handleConfirm()
            }}
            disabled={pending}
            className="bg-red-600 hover:bg-red-700"
          >
            Cancelar solicitud
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
