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

interface DeleteItemButtonProps {
  action: () => Promise<void>
  label?: string
  redirectTo?: string
}

export function DeleteItemButton({
  action,
  label = "Eliminar",
  redirectTo,
}: DeleteItemButtonProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  function handleConfirm() {
    setOpen(false)
    startTransition(async () => {
      try {
        await action()
        toast.success(`${label} correctamente.`)

        if (redirectTo && pathname !== redirectTo) {
          router.replace(redirectTo)
          return
        }

        router.refresh()
      } catch (error) {
        toast.error(
          getUserFacingErrorMessage(
            error,
            `No se pudo ${label.toLowerCase()}.`,
          ),
        )
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          disabled={isPending}
          className="transition-colors hover:text-red-500 disabled:opacity-50 cursor-pointer"
          title={label}
        >
          <Trash className="h-4 w-4" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{label}</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Seguro que querés {label.toLowerCase()}? Esta acción no se puede
            deshacer.
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
            className="bg-red-600 hover:bg-red-700"
          >
            {label}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
