"use client"

import { Checkbox } from "@/components/ui/checkbox"
import type { QuoteItemsRow } from "@/types/quote-items/quote-items.types"

function formatMoney(v: number) {
  return `$${Math.round(v || 0).toLocaleString("es-AR")}`
}

function formatDay(iso: string | null) {
  if (!iso) return ""
  return new Date(iso + "T00:00:00").toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

type DayBreakdown = {
  index: number
  fecha: string
  items: QuoteItemsRow[]
}

export function TotalsPanel({
  items,
  days,
  totalComision,
  totalImpuesto,
  totalFinal,
  impuestoPct,
  aplicaImpuesto,
  readonly,
  onToggleImpuesto,
}: {
  items: QuoteItemsRow[]
  days: string[]
  totalVenta?: number
  totalComision: number
  totalNeto?: number
  totalImpuesto: number
  totalFinal: number
  impuestoPct: number
  aplicaImpuesto: boolean
  readonly?: boolean
  onToggleImpuesto: (next: boolean) => void
}) {
  const breakdown: DayBreakdown[] = days.map((fecha, index) => ({
    index,
    fecha,
    items: items
      .filter((it) => it.dia_offset === index)
      .sort(
        (a, b) =>
          (a.orden ?? 999) - (b.orden ?? 999) ||
          a.servicio_nombre.localeCompare(b.servicio_nombre),
      ),
  }))

  const hasItems = items.length > 0

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between bg-primary/5 -mx-1 px-1 py-1 rounded">
          <span className="text-neutral-700 text-xs font-medium">
            Tu comisión total
          </span>
          <span className="font-bold text-primary tabular-nums">
            {formatMoney(totalComision)}
          </span>
        </div>
      </div>

      {hasItems ? (
        <div className="border-t border-neutral-200 pt-3 space-y-3">
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
            Detalle por servicio
          </p>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {breakdown.map((day) =>
              day.items.length === 0 ? null : (
                <div key={day.index} className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold flex items-center justify-between">
                    <span>
                      Día {day.index + 1} · {formatDay(day.fecha)}
                    </span>
                  </p>
                  <ul className="space-y-1.5">
                    {day.items.map((it) => (
                      <li
                        key={it.id}
                        className="text-xs leading-snug flex items-start justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-neutral-800 truncate">
                            {it.servicio_nombre}
                          </p>
                          {!it.is_special ? (
                            <p className="text-[10px] text-neutral-400">
                              {it.adultos} ad · {it.menores} ch
                              {it.comision_pct
                                ? ` · ${it.comision_pct}% com.`
                                : ""}
                            </p>
                          ) : (
                            <p className="text-[10px] text-neutral-400">
                              Especial · sin comisión
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0 tabular-nums">
                          <p className="text-neutral-900 font-medium">
                            {formatMoney(it.subtotal_venta)}
                          </p>
                          {it.subtotal_comision > 0 ? (
                            <p className="text-[10px] text-primary">
                              +{formatMoney(it.subtotal_comision)}
                            </p>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </div>
      ) : null}

      <div className="border-t border-neutral-200 pt-3 space-y-2">
        <label
          className={`flex items-center gap-2 text-xs ${
            readonly ? "text-neutral-400" : "text-neutral-700 cursor-pointer"
          }`}
        >
          <Checkbox
            checked={aplicaImpuesto}
            disabled={readonly}
            onCheckedChange={(c) => onToggleImpuesto(c === true)}
          />
          <span>Aplicar impuesto ({impuestoPct}%)</span>
        </label>
        {aplicaImpuesto ? (
          <div className="flex items-center justify-between text-xs pl-6">
            <span className="text-neutral-500">Impuesto</span>
            <span className="text-neutral-700 tabular-nums font-medium">
              {formatMoney(totalImpuesto)}
            </span>
          </div>
        ) : null}
      </div>

      <div className="border-t-2 border-neutral-900 pt-3">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
              Total
            </p>
            <p className="text-xs text-neutral-500 mt-0.5">
              {aplicaImpuesto
                ? "Con impuestos incluidos"
                : "Sin impuestos aplicados"}
            </p>
          </div>
          <span className="text-xl font-bold text-neutral-900 tabular-nums leading-none">
            {formatMoney(totalFinal)}
          </span>
        </div>
      </div>
    </div>
  )
}
