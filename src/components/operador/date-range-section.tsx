"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DateRangeSection({
  inicio,
  fin,
  readonly,
  onCommit,
}: {
  inicio: string | null
  fin: string | null
  readonly?: boolean
  onCommit: (patch: { fecha_inicio?: string; fecha_fin?: string }) => Promise<void>
}) {
  const [start, setStart] = useState(inicio ?? "")
  const [end, setEnd] = useState(fin ?? "")

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <Label className="text-xs">Fecha de inicio</Label>
        <Input
          type="date"
          value={start}
          disabled={readonly}
          onChange={(e) => setStart(e.target.value)}
          onBlur={() => {
            if (start && start !== (inicio ?? "")) {
              onCommit({ fecha_inicio: start })
            }
          }}
        />
      </div>
      <div>
        <Label className="text-xs">Fecha de fin</Label>
        <Input
          type="date"
          value={end}
          disabled={readonly}
          onChange={(e) => setEnd(e.target.value)}
          onBlur={() => {
            if (end && end !== (fin ?? "")) {
              onCommit({ fecha_fin: end })
            }
          }}
        />
      </div>
    </div>
  )
}
