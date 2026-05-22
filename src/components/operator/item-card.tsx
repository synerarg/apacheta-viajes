"use client"

import { useEffect, useRef, useState } from "react"
import { Minus, Plus, Trash } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import type { QuoteItemsRow } from "@/types/quote-items/quote-items.types"
import { useDebouncedCallback } from "./use-debounced-callback"

function formatMoney(v: number) {
  return `$${Math.round(v || 0).toLocaleString("es-AR")}`
}

const MAX_PERSONAS = 99

function clampPersonas(value: number, min = 0) {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(MAX_PERSONAS, Math.floor(value)))
}

function Stepper({
  label,
  value,
  min = 0,
  readonly,
  onChange,
}: {
  label: string
  value: number
  min?: number
  readonly?: boolean
  onChange: (next: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-2 sm:justify-start sm:gap-3">
      <span className="text-xs text-neutral-500 font-medium">{label}</span>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-xs"
          disabled={readonly || value <= min}
          onClick={() => onChange(clampPersonas(value - 1, min))}
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
          disabled={readonly || value >= MAX_PERSONAS}
          onClick={() => onChange(clampPersonas(value + 1, min))}
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
  item: QuoteItemsRow
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

  // Sincronizar state local cuando el item viene del server (e.g. tras refresh
  // del header). Si hay un cambio pendiente sin flushear, lo respetamos.
  const dirtyRef = useRef(false)
  // Sincronizar con los valores del server cuando el padre refresca.
  useEffect(() => {
    if (dirtyRef.current) return
    setAdultos(item.adultos)
    setMenores(item.menores)
  }, [item.adultos, item.menores])

  const debouncedUpdate = useDebouncedCallback(
    (patch: { adultos?: number; menores?: number }) => {
      dirtyRef.current = false
      onUpdate(item.id, patch).catch(() => {
        dirtyRef.current = false
      })
    },
    400,
  )

  const minAdultos = item.is_special ? 1 : 0

  function changeAdultos(next: number) {
    const safe = clampPersonas(next, minAdultos)
    if (safe === adultos) return
    dirtyRef.current = true
    setAdultos(safe)
    debouncedUpdate({ adultos: safe })
  }

  function changeMenores(next: number) {
    const safe = clampPersonas(next, 0)
    if (safe === menores) return
    dirtyRef.current = true
    setMenores(safe)
    debouncedUpdate({ menores: safe })
  }

  const isSpecial = !!item.is_special

  return (
    <div className="rounded-md border border-neutral-200 bg-white border-l-2 border-l-primary/60 overflow-hidden">
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
              debouncedUpdate.cancel()
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

      {!isSpecial ? (
        <div className="px-3 sm:px-4 pb-3 grid gap-2 grid-cols-1 sm:grid-cols-2 sm:gap-4">
          <Stepper
            label="Adultos"
            value={adultos}
            min={minAdultos}
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

      <div className="grid grid-cols-2 gap-1 px-3 sm:px-4 py-2.5 bg-neutral-50 border-t border-neutral-100">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold truncate">
            Total
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
      </div>
    </div>
  )
}
