"use client"

import { useMemo, useState } from "react"
import { MagnifyingGlass } from "@phosphor-icons/react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { CotizadorCategoriasRow } from "@/types/cotizador-categorias/cotizador-categorias.types"
import type { CotizadorServiciosRow } from "@/types/cotizador-servicios/cotizador-servicios.types"

export function SeleccionarServicioSheet({
  open,
  onOpenChange,
  categorias,
  servicios,
  onPick,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  categorias: CotizadorCategoriasRow[]
  servicios: CotizadorServiciosRow[]
  onPick: (servicio: CotizadorServiciosRow) => void | Promise<void>
}) {
  const [query, setQuery] = useState("")
  const [picking, setPicking] = useState<string | null>(null)

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = servicios.filter((s) => {
      if (!q) return true
      const haystack = `${s.nombre} ${s.descripcion ?? ""}`.toLowerCase()
      if (haystack.includes(q)) return true
      const cat = categorias.find((c) => c.id === s.categoria_id)
      if (cat && cat.nombre.toLowerCase().includes(q)) return true
      return false
    })

    const byCat = new Map<string | null, CotizadorServiciosRow[]>()
    for (const s of filtered) {
      const key = s.categoria_id
      const arr = byCat.get(key) ?? []
      arr.push(s)
      byCat.set(key, arr)
    }
    return Array.from(byCat.entries())
      .map(([catId, items]) => ({
        categoria:
          categorias.find((c) => c.id === catId) ?? {
            id: "",
            nombre: "Otros",
            region: null,
            tipo: null,
            orden: 999,
            activo: true,
          },
        items: items.sort(
          (a, b) =>
            (a.orden ?? 999) - (b.orden ?? 999) || a.nombre.localeCompare(b.nombre),
        ),
      }))
      .sort(
        (a, b) =>
          (a.categoria.orden ?? 999) - (b.categoria.orden ?? 999) ||
          a.categoria.nombre.localeCompare(b.categoria.nombre),
      )
  }, [query, servicios, categorias])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Agregar servicio</SheetTitle>
          <SheetDescription>
            Buscá por nombre o categoría y tocá uno para agregarlo al día.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-3">
          <div className="relative">
            <MagnifyingGlass className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar servicio…"
              className="pl-7"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-5">
          {grouped.length === 0 ? (
            <p className="text-xs text-neutral-500 text-center py-8">
              No hay servicios que coincidan.
            </p>
          ) : (
            grouped.map(({ categoria, items }) => (
              <div key={categoria.id || "_otros"}>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-2">
                  {categoria.nombre}
                  {categoria.region ? ` · ${categoria.region}` : ""}
                </p>
                <div className="space-y-1.5">
                  {items.map((s) => (
                    <Button
                      key={s.id}
                      variant="outline"
                      className="w-full justify-start h-auto py-2 px-3 text-left whitespace-normal"
                      disabled={picking === s.id}
                      onClick={async () => {
                        setPicking(s.id)
                        try {
                          await onPick(s)
                          setQuery("")
                          onOpenChange(false)
                        } finally {
                          setPicking(null)
                        }
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900">
                          {s.nombre}
                        </p>
                        {s.descripcion ? (
                          <p className="text-xs text-neutral-500 line-clamp-2 mt-0.5">
                            {s.descripcion}
                          </p>
                        ) : null}
                        <p className="text-[10px] text-neutral-400 mt-1">
                          Comisión {s.comision_pct}%
                          {s.is_special ? " · Especial" : ""}
                          {s.no_price ? " · Sin precio cargado" : ""}
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
