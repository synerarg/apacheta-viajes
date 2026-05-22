"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Circle, FloppyDisk, Trash } from "@phosphor-icons/react"
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
import { Input } from "@/components/ui/input"
import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error"
import type { QuoterPricesRow } from "@/types/quoter-prices/quoter-prices.types"

const TEMPORADAS = [
  "Oct25-Mar26",
  "Ene-Mar26",
  "Abr-Jun26",
  "Jul-Sep26",
  "Oct-Dic26",
  "2025-2026",
] as const

type Temporada = (typeof TEMPORADAS)[number]

interface PrecioState {
  id: string | null
  precio_adulto: string
  precio_menor: string
  vigencia_desde: string
  vigencia_hasta: string
  comision_pct_override: string
  notas: string
}

interface QuoterPricesGridProps {
  serviceId: string
  precios: QuoterPricesRow[]
}

function emptyState(): PrecioState {
  return {
    id: null,
    precio_adulto: "",
    precio_menor: "",
    vigencia_desde: "",
    vigencia_hasta: "",
    comision_pct_override: "",
    notas: "",
  }
}

function fromRow(row: QuoterPricesRow): PrecioState {
  return {
    id: row.id,
    precio_adulto: String(row.precio_adulto ?? ""),
    precio_menor: row.precio_menor !== null ? String(row.precio_menor) : "",
    vigencia_desde: row.vigencia_desde ?? "",
    vigencia_hasta: row.vigencia_hasta ?? "",
    comision_pct_override:
      row.comision_pct_override !== null
        ? String(row.comision_pct_override)
        : "",
    notas: row.notas ?? "",
  }
}

export function QuoterPricesGrid({
  serviceId,
  precios,
}: QuoterPricesGridProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [savingTemporada, setSavingTemporada] = useState<string | null>(null)

  const initialMap: Record<Temporada, PrecioState> = TEMPORADAS.reduce(
    (acc, temporada) => {
      const existing = precios.find((p) => p.temporada === temporada)
      acc[temporada] = existing ? fromRow(existing) : emptyState()
      return acc
    },
    {} as Record<Temporada, PrecioState>,
  )

  const [rows, setRows] = useState<Record<Temporada, PrecioState>>(initialMap)
  const [deleteTarget, setDeleteTarget] = useState<Temporada | null>(null)

  function updateRow(
    temporada: Temporada,
    field: keyof PrecioState,
    value: string,
  ) {
    setRows((prev) => ({
      ...prev,
      [temporada]: { ...prev[temporada], [field]: value },
    }))
  }

  function saveRow(temporada: Temporada) {
    const row = rows[temporada]
    const parsedAdulto = Number(row.precio_adulto)

    if (!row.precio_adulto || !Number.isFinite(parsedAdulto)) {
      toast.error("Ingresá un precio adulto válido")
      return
    }

    setSavingTemporada(temporada)
    startTransition(async () => {
      try {
        const payload = {
          servicio_id: serviceId,
          temporada,
          precio_adulto: parsedAdulto,
          precio_menor: row.precio_menor ? Number(row.precio_menor) : null,
          vigencia_desde: row.vigencia_desde || null,
          vigencia_hasta: row.vigencia_hasta || null,
          comision_pct_override: row.comision_pct_override
            ? Number(row.comision_pct_override)
            : null,
          notas: row.notas.trim() || null,
        }

        const endpoint = row.id
          ? `/api/dashboard/cotizador-precios/${row.id}`
          : "/api/dashboard/cotizador-precios"

        const response = await fetch(endpoint, {
          method: row.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const data = (await response.json().catch(() => ({}))) as {
            error?: string
          }
          throw new Error(data.error ?? "No se pudo guardar el precio.")
        }

        const data = (await response.json().catch(() => ({}))) as {
          id?: string
        }
        if (data.id && !row.id) {
          setRows((prev) => ({
            ...prev,
            [temporada]: { ...prev[temporada], id: data.id ?? null },
          }))
        }

        toast.success(`Precio ${temporada} guardado`)
        router.refresh()
      } catch (error) {
        toast.error(
          getUserFacingErrorMessage(error, "No se pudo guardar el precio."),
        )
      } finally {
        setSavingTemporada(null)
      }
    })
  }

  function clearRow(temporada: Temporada) {
    const row = rows[temporada]
    if (!row.id) {
      setRows((prev) => ({ ...prev, [temporada]: emptyState() }))
      return
    }
    setDeleteTarget(temporada)
  }

  function confirmDelete() {
    const temporada = deleteTarget
    if (!temporada) return
    const row = rows[temporada]
    if (!row.id) {
      setDeleteTarget(null)
      return
    }

    setDeleteTarget(null)
    setSavingTemporada(temporada)
    startTransition(async () => {
      try {
        const response = await fetch(
          `/api/dashboard/cotizador-precios/${row.id}`,
          { method: "DELETE" },
        )
        if (!response.ok) {
          const data = (await response.json().catch(() => ({}))) as {
            error?: string
          }
          throw new Error(data.error ?? "No se pudo eliminar el precio.")
        }
        setRows((prev) => ({ ...prev, [temporada]: emptyState() }))
        toast.success(`Precio ${temporada} eliminado`)
        router.refresh()
      } catch (error) {
        toast.error(
          getUserFacingErrorMessage(error, "No se pudo eliminar el precio."),
        )
      } finally {
        setSavingTemporada(null)
      }
    })
  }

  return (
    <>
    <AlertDialog
      open={deleteTarget !== null}
      onOpenChange={(o) => {
        if (!o) setDeleteTarget(null)
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar precio</AlertDialogTitle>
          <AlertDialogDescription>
            {deleteTarget
              ? `¿Limpiar el precio de la temporada ${deleteTarget}? Se eliminará la fila.`
              : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              confirmDelete()
            }}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <div className="overflow-x-auto border border-neutral-200 bg-white">
      <table className="w-full min-w-[1100px] text-sm">
        <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
          <tr>
            <th className="px-3 py-2 text-left">Temporada</th>
            <th className="px-3 py-2 text-left">Precio adulto</th>
            <th className="px-3 py-2 text-left">Precio menor</th>
            <th className="px-3 py-2 text-left">Vigencia desde</th>
            <th className="px-3 py-2 text-left">Vigencia hasta</th>
            <th className="px-3 py-2 text-left">Comisión override (%)</th>
            <th className="px-3 py-2 text-left">Notas</th>
            <th className="px-3 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {TEMPORADAS.map((temporada) => {
            const row = rows[temporada]
            const exists = !!row.id
            const isRowSaving = savingTemporada === temporada && isPending
            return (
              <tr
                key={temporada}
                className={`border-t border-neutral-100 ${
                  exists ? "bg-white" : "bg-neutral-50/40"
                }`}
              >
                <td className="px-3 py-2 align-top">
                  <div className="flex items-center gap-2">
                    {exists ? (
                      <CheckCircle
                        className="h-4 w-4 text-emerald-600"
                        weight="fill"
                      />
                    ) : (
                      <Circle className="h-4 w-4 text-neutral-300" />
                    )}
                    <span className="font-medium text-neutral-800">
                      {temporada}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {exists ? "Cargado" : "Vacío"}
                  </p>
                </td>
                <td className="px-3 py-2 align-top">
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={row.precio_adulto}
                    onChange={(event) =>
                      updateRow(temporada, "precio_adulto", event.target.value)
                    }
                    className="w-28"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={row.precio_menor}
                    onChange={(event) =>
                      updateRow(temporada, "precio_menor", event.target.value)
                    }
                    className="w-28"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <Input
                    type="date"
                    value={row.vigencia_desde}
                    onChange={(event) =>
                      updateRow(temporada, "vigencia_desde", event.target.value)
                    }
                    className="w-36"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <Input
                    type="date"
                    value={row.vigencia_hasta}
                    onChange={(event) =>
                      updateRow(temporada, "vigencia_hasta", event.target.value)
                    }
                    className="w-36"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={row.comision_pct_override}
                    onChange={(event) =>
                      updateRow(
                        temporada,
                        "comision_pct_override",
                        event.target.value,
                      )
                    }
                    className="w-24"
                    placeholder="—"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <Input
                    value={row.notas}
                    onChange={(event) =>
                      updateRow(temporada, "notas", event.target.value)
                    }
                    placeholder="Observaciones"
                    className="w-48"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => saveRow(temporada)}
                      disabled={isRowSaving}
                      className="inline-flex items-center gap-1 bg-primary px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
                    >
                      <FloppyDisk className="h-3.5 w-3.5" />
                      {isRowSaving ? "Guardando…" : "Guardar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => clearRow(temporada)}
                      disabled={isRowSaving}
                      className="inline-flex items-center gap-1 border border-neutral-200 px-2.5 py-1 text-xs text-neutral-600 transition-colors hover:bg-neutral-50 disabled:opacity-50 cursor-pointer"
                    >
                      <Trash className="h-3.5 w-3.5" />
                      {exists ? "Eliminar" : "Limpiar"}
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
    </>
  )
}
