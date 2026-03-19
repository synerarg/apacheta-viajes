"use client"

import { useTransition } from "react"
import { Trash } from "@phosphor-icons/react"
import { toast } from "sonner"

interface DeleteItemButtonProps {
  action: () => Promise<void>
  label?: string
}

export function DeleteItemButton({ action, label = "Eliminar" }: DeleteItemButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm(`¿Seguro que querés ${label.toLowerCase()}? Esta acción no se puede deshacer.`)) return
    startTransition(async () => {
      try {
        await action()
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : `No se pudo ${label.toLowerCase()}.`,
        )
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="transition-colors hover:text-red-500 disabled:opacity-50"
      title={label}
    >
      <Trash className="h-4 w-4" />
    </button>
  )
}
