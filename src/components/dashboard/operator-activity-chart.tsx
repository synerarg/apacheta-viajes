import { ChartBar } from "@phosphor-icons/react/dist/ssr"

interface OperadorActivityChartProps {
  buckets: Array<{ key: string; label: string; count: number }>
}

const MONTH_LABELS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
]

export function buildMonthlyBuckets(
  dates: string[],
  monthsBack = 6,
): Array<{ key: string; label: string; count: number }> {
  const now = new Date()
  const buckets: Array<{ key: string; label: string; count: number }> = []
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    buckets.push({
      key,
      label: MONTH_LABELS[d.getMonth()],
      count: 0,
    })
  }
  for (const iso of dates) {
    if (!iso) continue
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) continue
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const bucket = buckets.find((b) => b.key === key)
    if (bucket) bucket.count += 1
  }
  return buckets
}

export function OperadorActivityChart({ buckets }: OperadorActivityChartProps) {
  const total = buckets.reduce((acc, b) => acc + b.count, 0)
  const hasActivity = total > 0
  const max = Math.max(1, ...buckets.map((b) => b.count))

  return (
    <section className="border border-neutral-200 bg-white p-5 space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="font-playfair text-lg font-semibold text-neutral-900">
            Actividad últimos 6 meses
          </h2>
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            Cotizaciones generadas por mes
          </p>
        </div>
        {hasActivity ? (
          <p className="text-xs text-neutral-500 tabular-nums">
            {total} en total
          </p>
        ) : null}
      </div>

      {hasActivity ? (
        <div
          className="flex items-end justify-between gap-2 sm:gap-3 h-44"
          role="img"
          aria-label="Gráfico de barras de cotizaciones por mes"
        >
          {buckets.map((b) => {
            const heightPct = b.count === 0 ? 0 : (b.count / max) * 100
            return (
              <div
                key={b.key}
                className="group flex flex-1 flex-col items-center gap-1.5"
              >
                <span className="text-xs font-medium text-neutral-700 tabular-nums">
                  {b.count}
                </span>
                <div className="w-full flex-1 flex items-end">
                  {b.count > 0 ? (
                    <div
                      className="w-full rounded-t-sm bg-primary/80 transition-colors group-hover:bg-primary"
                      style={{ height: `${Math.max(heightPct, 4)}%` }}
                      aria-label={`${b.count} cotizaciones en ${b.label}`}
                    />
                  ) : (
                    <div
                      className="w-full rounded-t-sm bg-neutral-100"
                      style={{ height: "4px" }}
                      aria-label={`Sin cotizaciones en ${b.label}`}
                    />
                  )}
                </div>
                <span className="text-xs text-neutral-500">{b.label}</span>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <ChartBar
            className="h-10 w-10 text-neutral-400 opacity-50"
            weight="duotone"
            aria-hidden
          />
          <p className="mt-3 text-sm text-neutral-500">
            Sin actividad aún para graficar
          </p>
        </div>
      )}
    </section>
  )
}
