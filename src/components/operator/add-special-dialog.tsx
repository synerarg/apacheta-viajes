"use client"

import { useEffect, useState } from "react"
import { MicrophoneStageIcon, SuitcaseIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export type EspecialKind = "equipaje" | "guia"

export function AgregarEspecialDialog({
  open,
  onOpenChange,
  kind,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  kind: EspecialKind | null
  onConfirm: (cantidad: number, precioUnit: number) => void | Promise<void>
}) {
  const [cantidad, setCantidad] = useState("1")
  const [precio, setPrecio] = useState("0")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setCantidad("1")
      setPrecio("0")
    }
  }, [open])

  if (!kind) return null

  const label = kind === "equipaje" ? "Equipaje adicional" : "Guía bilingüe"
  const Icon = kind === "equipaje" ? SuitcaseIcon : MicrophoneStageIcon
  const description =
    kind === "equipaje"
      ? "Suplemento por valija extra o equipaje fuera de lo permitido."
      : "Suplemento por guía en idioma extranjero (inglés, portugués, etc.)."

  const cantidadNum = Math.max(1, parseInt(cantidad, 10) || 1)
  const precioNum = Math.max(0, parseFloat(precio) || 0)
  const total = cantidadNum * precioNum

  function formatMoney(v: number) {
    return `$${Math.round(v || 0).toLocaleString("es-AR")}`
  }

  async function handleConfirm() {
    setSubmitting(true)
    try {
      await onConfirm(cantidadNum, precioNum)
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" weight="fill" />
            {label}
          </SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 px-4 py-2 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="esp_cantidad">Cantidad</Label>
            <Input
              id="esp_cantidad"
              type="number"
              inputMode="numeric"
              min={1}
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              autoFocus
            />
            <p className="text-[11px] text-neutral-500">
              {kind === "equipaje"
                ? "Cantidad de valijas / bultos adicionales."
                : "Cantidad de jornadas con guía bilingüe."}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="esp_precio">Precio unitario al cliente (ARS)</Label>
            <Input
              id="esp_precio"
              type="number"
              inputMode="decimal"
              min={0}
              step={100}
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
            <p className="text-[11px] text-neutral-500">
              Lo que cobrás al cliente por unidad. Sin comisión.
            </p>
          </div>

          <div className="rounded-md bg-neutral-50 border border-neutral-200 p-4 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
              Total
            </span>
            <span className="text-lg font-bold text-neutral-900">
              {formatMoney(total)}
            </span>
          </div>
        </div>

        <div className="border-t border-neutral-200 px-4 py-3 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={submitting || precioNum <= 0}
          >
            {submitting ? "Agregando..." : "Agregar al día"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
