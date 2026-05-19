"use client"

import { useMemo } from "react"
import {
  Plus,
  Suitcase,
  MicrophoneStage,
  CalendarBlank,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { CotizacionesItemsRow } from "@/types/cotizaciones-items/cotizaciones-items.types"
import { ItemCard } from "./item-card"

function formatDayDate(isoDate: string | null) {
  if (!isoDate) return ""
  const d = new Date(isoDate + "T00:00:00")
  return d.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

function formatMoney(v: number) {
  return `$${Math.round(v || 0).toLocaleString("es-AR")}`
}

export function DiaCard({
  diaOffset,
  fecha,
  items,
  readonly,
  onAddService,
  onAddSpecial,
  onUpdateItem,
  onDeleteItem,
}: {
  diaOffset: number
  fecha: string | null
  items: CotizacionesItemsRow[]
  readonly?: boolean
  onAddService: (diaOffset: number, fecha: string | null) => void
  onAddSpecial: (
    diaOffset: number,
    fecha: string | null,
    kind: "equipaje" | "guia",
  ) => void
  onUpdateItem: (
    itemId: string,
    patch: { adultos?: number; menores?: number },
  ) => Promise<void>
  onDeleteItem: (itemId: string) => Promise<void>
}) {
  const subtotalDia = useMemo(
    () => items.reduce((acc, it) => acc + (it.subtotal_venta || 0), 0),
    [items],
  )

  const hasItems = items.length > 0

  return (
    <Card className="overflow-hidden">
      <div className="bg-neutral-50 border-b border-neutral-100 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-white text-xs font-bold">
            D{diaOffset + 1}
          </span>
          <div className="min-w-0">
            <p className="font-playfair text-sm sm:text-base font-semibold text-neutral-900 capitalize truncate">
              {formatDayDate(fecha) || "—"}
            </p>
            <p className="text-[11px] text-neutral-500">
              {items.length} {items.length === 1 ? "servicio" : "servicios"}
            </p>
          </div>
        </div>
        {hasItems ? (
          <div className="text-right shrink-0">
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
              Subtotal día
            </p>
            <p className="font-semibold text-sm text-neutral-900">
              {formatMoney(subtotalDia)}
            </p>
          </div>
        ) : null}
      </div>

      <CardContent className="space-y-3 py-4">
        {hasItems ? (
          <div className="space-y-2">
            {items.map((it) => (
              <ItemCard
                key={it.id}
                item={it}
                readonly={readonly}
                onUpdate={onUpdateItem}
                onDelete={onDeleteItem}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-neutral-200 px-4 py-6 text-center">
            <CalendarBlank
              className="mx-auto h-6 w-6 text-neutral-300"
              weight="regular"
            />
            <p className="text-xs text-neutral-500 mt-2">
              Sin servicios para este día.
            </p>
          </div>
        )}

        {!readonly && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-neutral-100">
            <Button
              size="sm"
              onClick={() => onAddService(diaOffset, fecha)}
              className="flex-1 sm:flex-initial"
            >
              <Plus />
              Agregar servicio
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddSpecial(diaOffset, fecha, "equipaje")}
            >
              <Suitcase />
              Equipaje
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddSpecial(diaOffset, fecha, "guia")}
            >
              <MicrophoneStage />
              Guía
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
