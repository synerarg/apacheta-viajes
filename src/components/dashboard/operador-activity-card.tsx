import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { OperadoresRow } from "@/types/operadores/operadores.types"

interface OperadorActivityCardProps {
  operador: OperadoresRow
  enviadasCount: number
  borradorCount: number
  totalVenta: number
  lastActivityIso: string | null
  formatCurrency: (value: number) => string
  formatRelative: (iso: string | null) => string
  muted?: boolean
}

export function OperadorActivityCard({
  operador,
  enviadasCount,
  borradorCount,
  totalVenta,
  lastActivityIso,
  formatCurrency,
  formatRelative,
  muted = false,
}: OperadorActivityCardProps) {
  const isInactive = operador.activo === false
  const hasActivity = enviadasCount > 0 || borradorCount > 0

  return (
    <Link
      href={`/dashboard/operadores/${operador.id}`}
      className="block transition-shadow hover:shadow-md"
    >
      <Card className={muted ? "bg-neutral-50/60" : ""}>
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate text-base">
                {operador.nombre_comercial ?? operador.nombre}
              </CardTitle>
              <CardDescription className="truncate">
                {operador.email}
              </CardDescription>
            </div>
            {isInactive ? (
              <span className="inline-flex shrink-0 items-center rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-medium text-neutral-700">
                Inactivo
              </span>
            ) : null}
          </div>
          {hasActivity ? (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {enviadasCount > 0 ? (
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                  {enviadasCount} {enviadasCount === 1 ? "enviada" : "enviadas"}
                </span>
              ) : null}
              {borradorCount > 0 ? (
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                  {borradorCount} en borrador
                </span>
              ) : null}
            </div>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-1.5 text-sm text-neutral-600">
          {enviadasCount > 0 ? (
            <p className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">Venta acumulada</span>
              <span className="font-semibold tabular-nums text-neutral-900">
                {formatCurrency(totalVenta)}
              </span>
            </p>
          ) : null}
          <p className="text-xs text-neutral-500">
            {lastActivityIso
              ? `Última actividad: ${formatRelative(lastActivityIso)}`
              : "Sin cotizaciones aún"}
          </p>
          {operador.zona_operacion ? (
            <p className="truncate text-xs text-neutral-400">
              {operador.zona_operacion}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  )
}
