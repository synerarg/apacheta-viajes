"use client"

import { useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Trash } from "@phosphor-icons/react"
import { toast } from "sonner"

import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error"

interface DeleteCotizadorItemButtonProps {
  endpoint: string
  label?: string
  confirmMessage?: string
  redirectTo?: string
  variant?: "icon" | "button"
}

export function DeleteCotizadorItemButton({
  endpoint,
  label = "Eliminar",
  confirmMessage,
  redirectTo,
  variant = "icon",
}: DeleteCotizadorItemButtonProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  function handleClick() {
    const message =
      confirmMessage ??
      `¿Seguro que querés ${label.toLowerCase()}? Esta acción no se puede deshacer.`
    if (!confirm(message)) return

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

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex items-center gap-2 border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50 cursor-pointer"
        title={label}
      >
        <Trash className="h-3.5 w-3.5" />
        {isPending ? "Eliminando..." : label}
      </button>
    )
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
