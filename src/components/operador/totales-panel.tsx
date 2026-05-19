"use client"

import { Checkbox } from "@/components/ui/checkbox"

function formatMoney(v: number) {
  return `$${Math.round(v || 0).toLocaleString("es-AR")}`
}

export function TotalesPanel({
  totalVenta,
  totalComision,
  totalNeto,
  totalImpuesto,
  totalFinal,
  impuestoPct,
  aplicaImpuesto,
  readonly,
  onToggleImpuesto,
}: {
  totalVenta: number
  totalComision: number
  totalNeto: number
  totalImpuesto: number
  totalFinal: number
  impuestoPct: number
  aplicaImpuesto: boolean
  readonly?: boolean
  onToggleImpuesto: (next: boolean) => void
}) {
  return (
    <div className="space-y-4">
      {/* Detalle */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-neutral-500 text-xs">Subtotal venta cliente</span>
          <span className="font-medium text-neutral-900 tabular-nums">
            {formatMoney(totalVenta)}
          </span>
        </div>
        <div className="flex items-center justify-between bg-primary/5 -mx-1 px-1 py-1 rounded">
          <span className="text-neutral-700 text-xs font-medium">
            Tu comisión total
          </span>
          <span className="font-bold text-primary tabular-nums">
            {formatMoney(totalComision)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-500 text-xs">Neto Apacheta</span>
          <span className="text-neutral-700 tabular-nums text-sm">
            {formatMoney(totalNeto)}
          </span>
        </div>
      </div>

      {/* Impuesto */}
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

      {/* Total final */}
      <div className="border-t-2 border-neutral-900 pt-3">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
              Total final cliente
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
