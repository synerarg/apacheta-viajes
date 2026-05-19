"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
  ArrowLeft,
  PaperPlaneTilt,
  Archive,
  ArrowCounterClockwise,
  CaretUp,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { CotizacionesRow } from "@/types/cotizaciones/cotizaciones.types"
import type { CotizacionesItemsRow } from "@/types/cotizaciones-items/cotizaciones-items.types"
import type { CotizadorCategoriasRow } from "@/types/cotizador-categorias/cotizador-categorias.types"
import type { CotizadorServiciosRow } from "@/types/cotizador-servicios/cotizador-servicios.types"

import { AgregarEspecialDialog, type EspecialKind } from "./agregar-especial-dialog"
import { ClienteInfoForm } from "./cliente-info-form"
import { DateRangeSection } from "./date-range-section"
import { DiaCard } from "./dia-card"
import { SeleccionarServicioSheet } from "./seleccionar-servicio-sheet"
import { TotalesPanel } from "./totales-panel"
import { SalidaActions } from "./salida-actions"

type Props = {
  cotizacion: CotizacionesRow
  items: CotizacionesItemsRow[]
  categorias: CotizadorCategoriasRow[]
  servicios: CotizadorServiciosRow[]
}

function isoBetween(start: string | null, end: string | null): string[] {
  if (!start || !end) return []
  const s = new Date(start + "T00:00:00")
  const e = new Date(end + "T00:00:00")
  if (isNaN(s.getTime()) || isNaN(e.getTime()) || e < s) return []
  const out: string[] = []
  const cur = new Date(s)
  while (cur <= e) {
    out.push(cur.toISOString().slice(0, 10))
    cur.setDate(cur.getDate() + 1)
  }
  return out
}

function formatDate(iso: string | null) {
  if (!iso) return ""
  return new Date(iso + "T00:00:00").toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatMoney(v: number) {
  return `$${Math.round(v || 0).toLocaleString("es-AR")}`
}

const ESTADO_BADGE: Record<
  CotizacionesRow["estado"],
  { bg: string; text: string; label: string }
> = {
  borrador: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    label: "Borrador",
  },
  enviada: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    label: "Enviada",
  },
  archivada: {
    bg: "bg-neutral-200",
    text: "text-neutral-700",
    label: "Archivada",
  },
}

export function CotizadorBuilder({
  cotizacion: initialCotizacion,
  items: initialItems,
  categorias,
  servicios,
}: Props) {
  const router = useRouter()
  const [cotizacion, setCotizacion] = useState<CotizacionesRow>(initialCotizacion)
  const [items, setItems] = useState<CotizacionesItemsRow[]>(initialItems)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerDia, setPickerDia] = useState<{ offset: number; fecha: string | null } | null>(null)
  const [especialOpen, setEspecialOpen] = useState(false)
  const [especialCtx, setEspecialCtx] = useState<
    { kind: EspecialKind; diaOffset: number; fecha: string | null } | null
  >(null)
  const [isSending, startSending] = useTransition()
  const [publicUrl, setPublicUrl] = useState<string | null>(null)
  const [mobileTotalsOpen, setMobileTotalsOpen] = useState(false)

  const readonly = cotizacion.estado !== "borrador"
  const estadoBadge =
    ESTADO_BADGE[cotizacion.estado] ?? {
      bg: "bg-neutral-100",
      text: "text-neutral-700",
      label: cotizacion.estado ?? "—",
    }

  const days = useMemo(
    () => isoBetween(cotizacion.fecha_inicio, cotizacion.fecha_fin),
    [cotizacion.fecha_inicio, cotizacion.fecha_fin],
  )

  // Group items by dia_offset
  const itemsByDay = useMemo(() => {
    const map = new Map<number, CotizacionesItemsRow[]>()
    for (const it of items) {
      const arr = map.get(it.dia_offset) ?? []
      arr.push(it)
      map.set(it.dia_offset, arr)
    }
    for (const [k, arr] of map) {
      arr.sort(
        (a, b) =>
          (a.orden ?? 999) - (b.orden ?? 999) ||
          a.servicio_nombre.localeCompare(b.servicio_nombre),
      )
      map.set(k, arr)
    }
    return map
  }, [items])

  // ─── API helpers ─────────────────────────────────────────────
  async function refreshCotizacion() {
    try {
      const res = await fetch(`/api/cotizaciones/${cotizacion.id}`, {
        method: "GET",
        cache: "no-store",
      })
      if (!res.ok) return
      const data = await res.json()
      const cot = data?.data ?? data
      if (cot && typeof cot === "object") {
        const { items: itms, ...header } = cot as CotizacionesRow & {
          items?: CotizacionesItemsRow[]
        }
        setCotizacion(header as CotizacionesRow)
        if (Array.isArray(itms)) setItems(itms)
      }
    } catch {
      // ignore
    }
  }

  async function patchHeader(patch: Partial<CotizacionesRow>) {
    try {
      const res = await fetch(`/api/cotizaciones/${cotizacion.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || "Error al guardar")
      }
      await refreshCotizacion()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar")
    }
  }

  async function createItem(body: {
    type: "service" | "special"
    servicio_id?: string
    nombre?: string
    descripcion?: string
    adultos: number
    menores: number
    dia_offset: number
    fecha: string | null
    precio_adulto_unit?: number
    precio_menor_unit?: number
    comision_pct?: number
  }) {
    try {
      const res = await fetch(`/api/cotizaciones/${cotizacion.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || "No se pudo agregar el item")
      }
      await refreshCotizacion()
      toast.success("Item agregado")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al agregar")
    }
  }

  async function updateItem(
    itemId: string,
    patch: { adultos?: number; menores?: number },
  ) {
    try {
      const res = await fetch(
        `/api/cotizaciones/${cotizacion.id}/items/${itemId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || "Error al actualizar")
      }
      await refreshCotizacion()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al actualizar")
    }
  }

  async function deleteItem(itemId: string) {
    try {
      const res = await fetch(
        `/api/cotizaciones/${cotizacion.id}/items/${itemId}`,
        { method: "DELETE" },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || "Error al eliminar")
      }
      await refreshCotizacion()
      toast.success("Item eliminado")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar")
    }
  }

  function handleAddService(diaOffset: number, fecha: string | null) {
    setPickerDia({ offset: diaOffset, fecha })
    setPickerOpen(true)
  }

  async function handlePickServicio(servicio: CotizadorServiciosRow) {
    if (!pickerDia) return
    await createItem({
      type: "service",
      servicio_id: servicio.id,
      adultos: 2,
      menores: 0,
      dia_offset: pickerDia.offset,
      fecha: pickerDia.fecha,
    })
  }

  function handleAddSpecial(
    diaOffset: number,
    fecha: string | null,
    kind: EspecialKind,
  ) {
    setEspecialCtx({ kind, diaOffset, fecha })
    setEspecialOpen(true)
  }

  async function handleConfirmEspecial(cantidad: number, precio: number) {
    if (!especialCtx) return
    const { kind, diaOffset, fecha } = especialCtx
    const label = kind === "equipaje" ? "Equipaje" : "Guía bilingüe"
    await createItem({
      type: "special",
      nombre: label,
      descripcion:
        kind === "equipaje"
          ? "Servicio adicional de equipaje"
          : "Guía bilingüe acompañante",
      adultos: cantidad,
      menores: 0,
      dia_offset: diaOffset,
      fecha,
      precio_adulto_unit: precio,
      precio_menor_unit: 0,
      comision_pct: 0,
    })
  }

  function handleSend() {
    startSending(async () => {
      try {
        const res = await fetch(`/api/cotizaciones/${cotizacion.id}/send`, {
          method: "POST",
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data?.message || "Error al enviar")
        }
        const data = await res.json()
        const url = data?.public_url ?? data?.url ?? data?.data?.public_url
        if (url) setPublicUrl(url)
        toast.success("Cotización marcada como enviada")
        await refreshCotizacion()
        router.refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al enviar")
      }
    })
  }

  async function handleArchivar() {
    await patchHeader({ estado: "archivada" } as Partial<CotizacionesRow>)
    toast.success("Cotización archivada")
  }

  async function handleVolverBorrador() {
    await patchHeader({ estado: "borrador" } as Partial<CotizacionesRow>)
    toast.success("Cotización vuelta a borrador")
  }

  // ─── Resolved public URL ─────────────────────────────────────
  const resolvedPublicUrl = useMemo(() => {
    if (publicUrl) return publicUrl
    if (typeof window === "undefined") return ""
    return `${window.location.origin}/cotizacion/${cotizacion.token}`
  }, [publicUrl, cotizacion.token])

  // ─── Itinerary text (whatsapp/email/copy) ────────────────────
  const itineraryText = useMemo(() => {
    const lines: string[] = []
    lines.push("🌄 *Cotización Apacheta Viajes*")
    if (cotizacion.cliente_nombre) lines.push(`👤 ${cotizacion.cliente_nombre}`)
    const contact = [
      cotizacion.cliente_email ? `📧 ${cotizacion.cliente_email}` : "",
      cotizacion.cliente_telefono ? `📞 ${cotizacion.cliente_telefono}` : "",
    ]
      .filter(Boolean)
      .join(" | ")
    if (contact) lines.push(contact)
    if (cotizacion.fecha_inicio || cotizacion.fecha_fin) {
      lines.push(
        `📅 ${formatDate(cotizacion.fecha_inicio)} al ${formatDate(cotizacion.fecha_fin)}`,
      )
    }
    lines.push("")

    days.forEach((fecha, i) => {
      const dayItems = itemsByDay.get(i) ?? []
      const fechaTxt = new Date(fecha + "T00:00:00").toLocaleDateString(
        "es-AR",
        { weekday: "long", day: "numeric", month: "long" },
      )
      lines.push(`*Día ${i + 1}: ${fechaTxt}*`)
      if (dayItems.length === 0) {
        lines.push("   (sin servicios)")
      } else {
        for (const s of dayItems) {
          lines.push(`• ${s.servicio_nombre}`)
          if (s.servicio_descripcion) lines.push(`   ${s.servicio_descripcion}`)
          if (s.is_special) {
            lines.push(`   Precio: ${formatMoney(s.subtotal_venta)}`)
          } else {
            lines.push(
              `   (${s.adultos} ad / ${s.menores} ch) → ${formatMoney(s.subtotal_venta)}`,
            )
          }
        }
      }
      lines.push("")
    })

    lines.push("💰 *RESUMEN*")
    lines.push(`Total con comisiones: ${formatMoney(cotizacion.total_venta)}`)
    if (cotizacion.aplica_impuesto) {
      lines.push(
        `Impuestos (${cotizacion.impuesto_pct}%): ${formatMoney(cotizacion.total_impuesto)}`,
      )
    } else {
      lines.push(`Impuestos (${cotizacion.impuesto_pct}%): No aplicado`)
    }
    lines.push(`*TOTAL FINAL: ${formatMoney(cotizacion.total_final)}*`)

    if (cotizacion.recomendaciones && cotizacion.recomendaciones.length > 0) {
      lines.push("")
      lines.push("💡 *RECOMENDACIONES*")
      for (const r of cotizacion.recomendaciones) lines.push(r)
    }

    lines.push("")
    lines.push(`🔗 ${resolvedPublicUrl}`)

    return lines.join("\n")
  }, [cotizacion, days, itemsByDay, resolvedPublicUrl])

  const totalItems = items.length
  const totalDias = days.length

  return (
    <>
      <div className="p-3 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto pb-32 lg:pb-8">
        {/* Header */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Button asChild variant="ghost" size="icon-sm" className="shrink-0">
              <Link href="/operador" aria-label="Volver">
                <ArrowLeft />
              </Link>
            </Button>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                {readonly ? "Cotización" : "Editor de cotización"}
              </p>
              <h1 className="font-playfair text-xl sm:text-2xl font-bold text-neutral-900 truncate">
                {cotizacion.cliente_nombre || "Sin cliente"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap pl-11 sm:pl-0">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${estadoBadge.bg} ${estadoBadge.text}`}
            >
              {estadoBadge.label}
            </span>
            {totalDias > 0 ? (
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                {totalDias} {totalDias === 1 ? "día" : "días"}
              </span>
            ) : null}
            {totalItems > 0 ? (
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                {totalItems} {totalItems === 1 ? "servicio" : "servicios"}
              </span>
            ) : null}
          </div>
        </header>

        <div className="grid gap-5 lg:gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div className="space-y-5 min-w-0">
            {/* Cliente */}
            <Card>
              <CardContent className="space-y-4 py-4 sm:py-5">
                <h2 className="font-semibold text-sm text-neutral-900">
                  Datos del cliente
                </h2>
                <ClienteInfoForm
                  initial={{
                    cliente_nombre: cotizacion.cliente_nombre,
                    cliente_email: cotizacion.cliente_email,
                    cliente_telefono: cotizacion.cliente_telefono,
                  }}
                  readonly={readonly}
                  onPatch={(patch) => patchHeader(patch as Partial<CotizacionesRow>)}
                />
              </CardContent>
            </Card>

            {/* Fechas */}
            <Card>
              <CardContent className="space-y-4 py-4 sm:py-5">
                <h2 className="font-semibold text-sm text-neutral-900">
                  Fechas del viaje
                </h2>
                <DateRangeSection
                  inicio={cotizacion.fecha_inicio}
                  fin={cotizacion.fecha_fin}
                  readonly={readonly}
                  onCommit={(patch) =>
                    patchHeader(patch as Partial<CotizacionesRow>)
                  }
                />
              </CardContent>
            </Card>

            {/* Días */}
            {days.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-sm text-neutral-500">
                  <p className="font-medium text-neutral-700">Sin fechas definidas</p>
                  <p className="text-xs mt-1">
                    Cargá fechas de inicio y fin arriba para generar los días del
                    itinerario.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between pt-1">
                  <h2 className="font-semibold text-sm text-neutral-900">
                    Itinerario día por día
                  </h2>
                  <span className="text-xs text-neutral-500">
                    {totalItems} {totalItems === 1 ? "servicio" : "servicios"} en total
                  </span>
                </div>
                {days.map((fecha, i) => (
                  <DiaCard
                    key={`${i}-${fecha}`}
                    diaOffset={i}
                    fecha={fecha}
                    items={itemsByDay.get(i) ?? []}
                    readonly={readonly}
                    onAddService={handleAddService}
                    onAddSpecial={handleAddSpecial}
                    onUpdateItem={updateItem}
                    onDeleteItem={deleteItem}
                  />
                ))}
              </div>
            )}

          </div>

          {/* Sidebar desktop */}
          <aside className="hidden lg:block lg:sticky lg:top-6 self-start space-y-4">
            <Card>
              <CardContent className="py-5 space-y-4">
                <h2 className="font-semibold text-sm text-neutral-900">
                  Totales
                </h2>
                <TotalesPanel
                  totalVenta={cotizacion.total_venta}
                  totalComision={cotizacion.total_comision}
                  totalNeto={cotizacion.total_neto}
                  totalImpuesto={cotizacion.total_impuesto}
                  totalFinal={cotizacion.total_final}
                  impuestoPct={cotizacion.impuesto_pct}
                  aplicaImpuesto={!!cotizacion.aplica_impuesto}
                  readonly={readonly}
                  onToggleImpuesto={(next) =>
                    patchHeader({ aplica_impuesto: next } as Partial<CotizacionesRow>)
                  }
                />
              </CardContent>
            </Card>

            {cotizacion.estado === "borrador" ? (
              <Card>
                <CardContent className="py-5 space-y-3">
                  <h2 className="font-semibold text-sm text-neutral-900">
                    Enviar cotización
                  </h2>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Una vez enviada, podés compartir el link público o usar los
                    botones de salida.
                  </p>
                  <Button
                    className="w-full"
                    onClick={handleSend}
                    disabled={isSending || items.length === 0}
                  >
                    <PaperPlaneTilt />
                    {isSending ? "Enviando…" : "Marcar como enviada"}
                  </Button>
                  {items.length === 0 ? (
                    <p className="text-[10px] text-neutral-400 text-center">
                      Agregá al menos un servicio.
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-5 space-y-3">
                  <h2 className="font-semibold text-sm text-neutral-900">
                    Compartir
                  </h2>
                  <SalidaActions
                    text={itineraryText}
                    publicUrl={resolvedPublicUrl}
                    clienteEmail={cotizacion.cliente_email}
                    clienteTelefono={cotizacion.cliente_telefono}
                  />
                  <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
                    {cotizacion.estado === "enviada" ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleVolverBorrador}
                        >
                          <ArrowCounterClockwise />
                          Volver a borrador
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleArchivar}
                        >
                          <Archive />
                          Archivar
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleVolverBorrador}
                      >
                        <ArrowCounterClockwise />
                        Volver a borrador
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>

        <SeleccionarServicioSheet
          open={pickerOpen}
          onOpenChange={(o) => {
            setPickerOpen(o)
            if (!o) setPickerDia(null)
          }}
          categorias={categorias}
          servicios={servicios}
          onPick={handlePickServicio}
        />

        <AgregarEspecialDialog
          open={especialOpen}
          onOpenChange={(o) => {
            setEspecialOpen(o)
            if (!o) setEspecialCtx(null)
          }}
          kind={especialCtx?.kind ?? null}
          onConfirm={handleConfirmEspecial}
        />
      </div>

      {/* Mobile sticky bottom — totals + actions */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden">
        <div
          className={`bg-white border-t border-neutral-200 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.08)] transition-[max-height] duration-300 overflow-hidden ${
            mobileTotalsOpen ? "max-h-[80vh]" : "max-h-[160px]"
          }`}
        >
          {/* Always visible: total + expand */}
          <button
            type="button"
            onClick={() => setMobileTotalsOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 cursor-pointer"
            aria-label={mobileTotalsOpen ? "Ocultar totales" : "Ver totales"}
            aria-expanded={mobileTotalsOpen}
          >
            <div className="text-left min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                Total final cliente
              </p>
              <p className="text-lg font-bold text-neutral-900">
                {formatMoney(cotizacion.total_final)}
              </p>
              <p className="text-[11px] text-primary font-medium">
                Tu comisión: {formatMoney(cotizacion.total_comision)}
              </p>
            </div>
            <CaretUp
              className={`h-5 w-5 text-neutral-500 transition-transform shrink-0 ${
                mobileTotalsOpen ? "rotate-180" : "rotate-0"
              }`}
              weight="bold"
            />
          </button>

          {/* Expanded: full totals + action */}
          {mobileTotalsOpen ? (
            <div className="px-4 pb-4 space-y-4 overflow-y-auto max-h-[calc(80vh-72px)]">
              <TotalesPanel
                totalVenta={cotizacion.total_venta}
                totalComision={cotizacion.total_comision}
                totalNeto={cotizacion.total_neto}
                totalImpuesto={cotizacion.total_impuesto}
                totalFinal={cotizacion.total_final}
                impuestoPct={cotizacion.impuesto_pct}
                aplicaImpuesto={!!cotizacion.aplica_impuesto}
                readonly={readonly}
                onToggleImpuesto={(next) =>
                  patchHeader({ aplica_impuesto: next } as Partial<CotizacionesRow>)
                }
              />

              <div className="border-t border-neutral-200 pt-4 space-y-2">
                {cotizacion.estado === "borrador" ? (
                  <Button
                    className="w-full"
                    onClick={handleSend}
                    disabled={isSending || items.length === 0}
                  >
                    <PaperPlaneTilt />
                    {isSending ? "Enviando…" : "Marcar como enviada"}
                  </Button>
                ) : (
                  <>
                    <SalidaActions
                      text={itineraryText}
                      publicUrl={resolvedPublicUrl}
                      clienteEmail={cotizacion.cliente_email}
                      clienteTelefono={cotizacion.cliente_telefono}
                    />
                    {cotizacion.estado === "enviada" ? (
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleVolverBorrador}
                        >
                          <ArrowCounterClockwise />
                          Borrador
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleArchivar}
                        >
                          <Archive />
                          Archivar
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={handleVolverBorrador}
                      >
                        <ArrowCounterClockwise />
                        Volver a borrador
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
