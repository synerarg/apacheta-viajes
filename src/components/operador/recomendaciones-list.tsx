"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb } from "@phosphor-icons/react"

export function RecomendacionesList({
  recomendaciones,
}: {
  recomendaciones: string[]
}) {
  if (!recomendaciones || recomendaciones.length === 0) return null

  return (
    <Card>
      <CardContent className="py-4 space-y-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" weight="fill" />
          <h3 className="text-sm font-semibold text-neutral-900">
            Recomendaciones
          </h3>
        </div>
        <ul className="space-y-1.5">
          {recomendaciones.map((rec, i) => (
            <li key={i} className="text-xs text-neutral-700 leading-relaxed">
              {rec}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
