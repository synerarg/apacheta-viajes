"use client"

import { useState, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error"

interface DeleteQuoterItemButtonProps {
  endpoint: string
  label?: string
  confirmMessage?: string
  redirectTo?: string
  variant?: "icon" | "button"
}

export function DeleteQuoterItemButton({
  endpoint,
  label = "Eliminar",
  confirmMessage,
  redirectTo,
  variant = "icon",
}: DeleteQuoterItemButtonProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  function handleConfirm() {
    setOpen(false)
    startTransition(async () => {
      try {
        const response = await fetch(endpoint, {
          method: "DELETE",
        })

        if (!response.ok) {
          const data = (await response.json().catch(() => ({}))) as {
            error?: string
          }
          throw new Error(data.error ?? "No se pudo eliminar.")
        }

        toast.success(`${label} correctamente.`)

        if (redirectTo && pathname !== redirectTo) {
          router.replace(redirectTo)
          return
        }

        router.refresh()
      } catch (error) {
        toast.error(
          getUserFacingErrorMessage(error, `No se pudo ${label.toLowerCase()}.`),
        )
      }
    })
  }

  const message =
    confirmMessage ??
    `¿Seguro que querés ${label.toLowerCase()}? Esta acción no se puede deshacer.`

  const trigger =
    variant === "button" ? (
      <button
        type="button"
        disabled={isPending}
        className="inline-flex items-center gap-2 border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50 cursor-pointer"
        title={label}
      >
        <Trash className="h-3.5 w-3.5" />
        {isPending ? "Eliminando..." : label}
      </button>
    ) : (
      <button
        type="button"
        disabled={isPending}
        className="transition-colors hover:text-red-500 disabled:opacity-50 cursor-pointer"
        title={label}
      >
        <Trash className="h-4 w-4" />
      </button>
    )

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{label}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              handleConfirm()
            }}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {label}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
