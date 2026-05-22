"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Trash } from "@phosphor-icons/react"
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface DeleteQuoteButtonProps {
  quoteId: string
  clienteNombre?: string | null
  variant?: "icon" | "full"
  redirectTo?: string
  disabled?: boolean
}

export function DeleteQuoteButton({
  quoteId,
  clienteNombre,
  variant = "full",
  redirectTo,
  disabled,
}: DeleteQuoteButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function stop(event: React.SyntheticEvent) {
    event.stopPropagation()
  }

  function handleConfirm() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/cotizaciones/${quoteId}`, {
          method: "DELETE",
        })
        if (!res.ok) {
          let message = `Error HTTP ${res.status}`
          try {
            const body = (await res.json()) as { error?: string; message?: string }
            message = body.error ?? body.message ?? message
          } catch {
            /* ignore */
          }
          toast.error(message)
          return
        }
        toast.success("Cotización eliminada")
        setOpen(false)
        if (redirectTo) {
          router.replace(redirectTo)
        } else {
          router.refresh()
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al eliminar")
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={(event) => {
            stop(event)
            setOpen(true)
          }}
          disabled={disabled || isPending}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 cursor-pointer"
          title="Eliminar cotización"
          aria-label="Eliminar cotización"
        >
          <Trash className="h-4 w-4" />
        </button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          disabled={disabled || isPending}
          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Trash />
          Eliminar cotización
        </Button>
      )}

      <AlertDialogContent onClick={stop}>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar cotización</AlertDialogTitle>
          <AlertDialogDescription>
            {clienteNombre
              ? `Se va a eliminar la cotización de "${clienteNombre}". `
              : "Se va a eliminar esta cotización. "}
            Esta acción es definitiva y no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              handleConfirm()
            }}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isPending ? "Eliminando…" : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
