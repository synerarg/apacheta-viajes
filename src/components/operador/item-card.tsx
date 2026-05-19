"use client"

import { useState } from "react"
import { Minus, Plus, Trash } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import type { CotizacionesItemsRow } from "@/types/cotizaciones-items/cotizaciones-items.types"
import { useDebouncedCallback } from "./use-debounced-callback"

function formatMoney(v: number) {
  return `$${Math.round(v || 0).toLocaleString("es-AR")}`
}

function Stepper({
  label,
  value,
  readonly,
  onChange,
}: {
  label: string
  value: number
  readonly?: boolean
  onChange: (delta: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-2 sm:justify-start sm:gap-3">
      <span className="text-xs text-neutral-500 font-medium">{label}</span>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-xs"
          disabled={readonly || value <= 0}
          onClick={() => onChange(-1)}
          aria-label={`Reducir ${label.toLowerCase()}`}
        >
          <Minus />
        </Button>
        <span className="w-8 text-center text-sm font-semibold tabular-nums">
          {value}
        </span>
        <Button
          variant="outline"
          size="icon-xs"
          disabled={readonly}
          onClick={() => onChange(1)}
          aria-label={`Aumentar ${label.toLowerCase()}`}
        >
          <Plus />
        </Button>
      </div>
    </div>
  )
}

export function ItemCard({
  item,
  readonly,
  onUpdate,
  onDelete,
}: {
  item: CotizacionesItemsRow
  readonly?: boolean
  onUpdate: (
    itemId: string,
    patch: { adultos?: number; menores?: number },
  ) => Promise<void>
  onDelete: (itemId: string) => Promise<void>
}) {
  const [adultos, setAdultos] = useState(item.adultos)
  const [menores, setMenores] = useState(item.menores)
  const [deleting, setDeleting] = useState(false)

  const debouncedUpdate = useDebouncedCallback(
    (patch: { adultos?: number; menores?: number }) => {
      onUpdate(item.id, patch)
    },
    400,
  )

  function changeAdultos(delta: number) {
    const next = Math.max(0, adultos + delta)
    setAdultos(next)
    debouncedUpdate({ adultos: next })
  }

  function changeMenores(delta: number) {
    const next = Math.max(0, menores + delta)
    setMenores(next)
    debouncedUpdate({ menores: next })
  }

  const isSpecial = !!item.is_special

  return (
    <div className="rounded-md border border-neutral-200 bg-white border-l-2 border-l-primary/60 overflow-hidden">
      {/* Header: nombre + delete */}
      <div className="flex items-start justify-between gap-2 px-3 py-3 sm:px-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-sm text-neutral-900">
              {item.servicio_nombre}
            </h4>
            {isSpecial ? (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                Especial
              </span>
            ) : null}
            {!isSpecial && item.comision_pct ? (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                {item.comision_pct}% comisión
              </span>
            ) : null}
          </div>
          {item.servicio_descripcion ? (
            <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-snug">
              {item.servicio_descripcion}
            </p>
          ) : null}
        </div>
        {!readonly && (
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={deleting}
            onClick={async () => {
              setDeleting(true)
              try {
                await onDelete(item.id)
              } finally {
                setDeleting(false)
              }
            }}
            className="text-neutral-400 hover:text-rose-600 hover:bg-rose-50 shrink-0"
            aria-label="Eliminar item"
          >
            <Trash />
          </Button>
        )}
      </div>

      {/* Steppers */}
      {!isSpecial ? (
        <div className="px-3 sm:px-4 pb-3 grid gap-2 grid-cols-1 sm:grid-cols-2 sm:gap-4">
          <Stepper
            label="Adultos"
            value={adultos}
            readonly={readonly}
            onChange={changeAdultos}
          />
          <Stepper
            label="Menores"
            value={menores}
            readonly={readonly}
            onChange={changeMenores}
          />
        </div>
      ) : (
        <div className="px-3 sm:px-4 pb-3">
          <p className="text-xs text-neutral-500">
            Cantidad fija · sin comisión
          </p>
        </div>
      )}

      {/* Totales */}
      <div className="grid grid-cols-3 gap-1 px-3 sm:px-4 py-2.5 bg-neutral-50 border-t border-neutral-100">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold truncate">
            Cliente paga
          </p>
          <p className="font-semibold text-xs sm:text-sm text-neutral-900 truncate">
            {formatMoney(item.subtotal_venta)}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold truncate">
            Tu comisión
          </p>
          <p className="font-semibold text-xs sm:text-sm text-primary truncate">
            {formatMoney(item.subtotal_comision)}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold truncate">
            Neto Apacheta
          </p>
          <p className="font-semibold text-xs sm:text-sm text-neutral-600 truncate">
            {formatMoney(item.subtotal_neto)}
          </p>
        </div>
      </div>
    </div>
  )
}
