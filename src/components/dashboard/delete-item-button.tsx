"use client"

import { useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Trash } from "@phosphor-icons/react"
import { toast } from "sonner"

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
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  function handleClick() {
    if (!confirm(`¿Seguro que querés ${label.toLowerCase()}? Esta acción no se puede deshacer.`)) return
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
      className="transition-colors hover:text-red-500 disabled:opacity-50 cursor-pointer"
      title={label}
    >
      <Trash className="h-4 w-4" />
    </button>
  )
}
