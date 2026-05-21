import type { ReactNode } from "react"

import { Card, CardContent } from "@/components/ui/card"

type Trend = {
  label: string
  direction: "up" | "down" | "flat"
}

interface KpiCardProps {
  icon: ReactNode
  label: string
  value: string
  helper?: string
  trend?: Trend
  accentClassName?: string
}

const trendStyles: Record<Trend["direction"], string> = {
  up: "text-emerald-700 bg-emerald-50",
  down: "text-rose-700 bg-rose-50",
  flat: "text-neutral-600 bg-neutral-100",
}

const trendArrow: Record<Trend["direction"], string> = {
  up: "▲",
  down: "▼",
  flat: "•",
}

export function KpiCard({
  icon,
  label,
  value,
  helper,
  trend,
  accentClassName = "bg-primary/10 text-primary",
}: KpiCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 py-5">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accentClassName}`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {label}
          </p>
          <p className="text-2xl font-semibold text-neutral-900 tabular-nums">
            {value}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {trend ? (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  trendStyles[trend.direction]
                }`}
              >
                <span aria-hidden="true">{trendArrow[trend.direction]}</span>
                {trend.label}
              </span>
            ) : null}
            {helper ? (
              <span className="text-[11px] text-neutral-500">{helper}</span>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
