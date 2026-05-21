import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import type { CotizacionesRow } from "@/types/cotizaciones/cotizaciones.types"
import type { OperadoresRow } from "@/types/operadores/operadores.types"

interface CotizacionesEnviadasRecientesProps {
  cotizaciones: CotizacionesRow[]
  operadoresMap: Map<string, OperadoresRow>
  formatCurrency: (value: number) => string
  formatRelative: (iso: string | null) => string
}

function formatDateRange(inicio: string | null, fin: string | null) {
  if (!inicio && !fin) return "Sin fechas"
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }
  const start = inicio
    ? new Date(inicio).toLocaleDateString("es-AR", opts)
    : "?"
  const end = fin ? new Date(fin).toLocaleDateString("es-AR", opts) : "?"
  return `${start} → ${end}`
}

export function CotizacionesEnviadasRecientes({
  cotizaciones,
  operadoresMap,
  formatCurrency,
  formatRelative,
}: CotizacionesEnviadasRecientesProps) {
  if (cotizaciones.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Todavía no se enviaron cotizaciones. Cuando un operador envíe una, va a
          aparecer acá.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {cotizaciones.map((cot) => {
        const operador = operadoresMap.get(cot.operador_id)
        const operadorLabel =
          operador?.nombre_comercial ?? operador?.nombre ?? "Operador desconocido"
        const cliente = cot.cliente_nombre ?? "Cliente sin nombre"

        return (
          <Link
            key={cot.id}
            href={`/dashboard/cotizador/cotizaciones/${cot.id}`}
            className="block"
          >
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="truncate font-semibold text-neutral-900">
                      {operadorLabel}
                    </p>
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                      Enviada
                    </span>
                  </div>
                  <p className="truncate text-xs text-neutral-500">
                    Para <span className="text-neutral-700">{cliente}</span> ·{" "}
                    {formatDateRange(cot.fecha_inicio, cot.fecha_fin)}
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Enviada {formatRelative(cot.updated_at ?? cot.created_at)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-neutral-500">Total</p>
                    <p className="text-sm font-semibold tabular-nums text-neutral-900">
                      {formatCurrency(Number(cot.total_final ?? 0))}
                    </p>
                  </div>
                  <span className="hidden text-xs font-medium text-primary sm:inline">
                    Ver →
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
