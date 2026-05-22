"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function isValidIso(value: string) {
  return ISO_DATE_RE.test(value)
}

export function DateRangeSection({
  inicio,
  fin,
  readonly,
  onCommit,
}: {
  inicio: string | null
  fin: string | null
  readonly?: boolean
  onCommit: (patch: { fecha_inicio?: string; fecha_fin?: string }) => void
}) {
  const [error, setError] = useState<string | null>(null)

  const startValue = inicio ?? ""
  const endValue = fin ?? ""

  function handleStartChange(next: string) {
    if (!next) return
    if (!isValidIso(next)) return
    setError(null)
    // Si el nuevo inicio invalida el fin, ajustarlo en el mismo commit
    if (endValue && next > endValue) {
      onCommit({ fecha_inicio: next, fecha_fin: next })
      return
    }
    onCommit({ fecha_inicio: next })
  }

  function handleEndChange(next: string) {
    if (!next) return
    if (!isValidIso(next)) return
    if (startValue && next < startValue) {
      setError("La fecha de fin no puede ser anterior a la de inicio.")
      return
    }
    setError(null)
    onCommit({ fecha_fin: next })
  }

  return (
    <div className="space-y-2">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-xs">Fecha de inicio</Label>
          <Input
            type="date"
            value={startValue}
            disabled={readonly}
            onChange={(e) => handleStartChange(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs">Fecha de fin</Label>
          <Input
            type="date"
            value={endValue}
            min={startValue || undefined}
            disabled={readonly}
            onChange={(e) => handleEndChange(e.target.value)}
          />
        </div>
      </div>
      {error ? (
        <p className="text-xs text-rose-600">{error}</p>
      ) : (
        <p className="text-[11px] text-neutral-400">
          Al cambiar el rango se ajustan automáticamente las fechas de los
          servicios. Los días que queden fuera del rango se eliminan.
        </p>
      )}
    </div>
  )
}
