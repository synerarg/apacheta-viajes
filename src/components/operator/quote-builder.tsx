"use client"

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
  ArrowLeft,
  WhatsappLogo,
  Copy,
  Archive,
  ArrowCounterClockwise,
  CaretUp,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { isoRange } from "@/lib/quoter/dates"
import type { QuotesRow } from "@/types/quotes/quotes.types"
import type { QuoteItemsRow } from "@/types/quote-items/quote-items.types"
import type { QuoterCategoriesRow } from "@/types/quoter-categories/quoter-categories.types"
import type { QuoterServicesRow } from "@/types/quoter-services/quoter-services.types"

import { AddSpecialDialog, type EspecialKind } from "./add-special-dialog"
import {
  ClientInfoForm,
  type ClientInfoFormHandle,
} from "./client-info-form"
import { DateRangeSection } from "./date-range-section"
import { DayCard } from "./day-card"
import { DeleteQuoteButton } from "./delete-quote-button"
import { SelectServiceSheet } from "./select-service-sheet"
import { TotalsPanel } from "./totals-panel"
import { DepartureActions } from "./departure-actions"

type Props = {
  cotizacion: QuotesRow
  items: QuoteItemsRow[]
  categorias: QuoterCategoriesRow[]
  servicios: QuoterServicesRow[]
  tierComisionPct: number
}

type QuoteWithItems = QuotesRow & { items?: QuoteItemsRow[] }

type QuoteApiResponse = {
  cotizacion?: QuoteWithItems
  data?: QuoteWithItems
}

function formatMoney(v: number) {
  return `$${Math.round(v || 0).toLocaleString("es-AR")}`
}

const ESTADO_BADGE: Record<
  QuotesRow["estado"],
  { bg: string; text: string; ring: string; dot: string; label: string }
> = {
  borrador: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    ring: "ring-amber-200",
    dot: "bg-amber-500",
    label: "Activa",
  },
  enviada: {
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    ring: "ring-emerald-200",
    dot: "bg-emerald-500",
    label: "Enviada",
  },
  archivada: {
    bg: "bg-neutral-100",
    text: "text-neutral-700",
    ring: "ring-neutral-200",
    dot: "bg-neutral-400",
    label: "Archivada",
  },
}

async function readApiResponse(res: Response): Promise<{
  data: QuoteWithItems | null
  error: string | null
  status: number
}> {
  const contentType = res.headers.get("content-type") ?? ""
  if (!contentType.includes("application/json")) {
    return {
      data: null,
      error: `Error del servidor (HTTP ${res.status}).`,
      status: res.status,
    }
  }
  let parsed: QuoteApiResponse & { error?: string; message?: string } = {}
  try {
    parsed = (await res.json()) as typeof parsed
  } catch {
    return { data: null, error: "Respuesta inválida del servidor.", status: res.status }
  }
  if (!res.ok) {
    return {
      data: null,
      error: parsed.error || parsed.message || `Error HTTP ${res.status}.`,
      status: res.status,
    }
  }
  const cot = parsed.cotizacion ?? parsed.data ?? null
  return { data: cot, error: null, status: res.status }
}

export function QuoteBuilder({
  cotizacion: initialCotizacion,
  items: initialItems,
  categorias,
  servicios,
  tierComisionPct,
}: Props) {
  const router = useRouter()
  const [cotizacion, setCotizacion] = useState<QuotesRow>(initialCotizacion)
  const [items, setItems] = useState<QuoteItemsRow[]>(initialItems)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerDia, setPickerDia] = useState<{ offset: number; fecha: string | null } | null>(null)
  const [especialOpen, setEspecialOpen] = useState(false)
  const [especialCtx, setEspecialCtx] = useState<
    { kind: EspecialKind; diaOffset: number; fecha: string | null } | null
  >(null)
  const [isSending, startSending] = useTransition()
  const [isMutating, setIsMutating] = useState(false)
  const [publicUrl, setPublicUrl] = useState<string | null>(null)
  const [mobileTotalsOpen, setMobileTotalsOpen] = useState(false)

  const clienteFormRef = useRef<ClientInfoFormHandle | null>(null)

  const readonly = cotizacion.estado !== "borrador"
  const estadoBadge =
    ESTADO_BADGE[cotizacion.estado] ?? {
      bg: "bg-neutral-100",
      text: "text-neutral-700",
      ring: "ring-neutral-200",
      dot: "bg-neutral-400",
      label: cotizacion.estado ?? "—",
    }

  const days = useMemo(
    () => isoRange(cotizacion.fecha_inicio, cotizacion.fecha_fin),
    [cotizacion.fecha_inicio, cotizacion.fecha_fin],
  )

  const itemsByDay = useMemo(() => {
    const map = new Map<number, QuoteItemsRow[]>()
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

  const applyResponse = useCallback((data: QuoteWithItems | null) => {
    if (!data) return
    const { items: itms, ...header } = data
    setCotizacion(header as QuotesRow)
    if (Array.isArray(itms)) setItems(itms)
  }, [])

  const refreshCotizacion = useCallback(async () => {
    try {
      const res = await fetch(`/api/cotizaciones/${cotizacion.id}`, {
        method: "GET",
        cache: "no-store",
      })
      const { data } = await readApiResponse(res)
      applyResponse(data)
    } catch {
      // ignore
    }
  }, [cotizacion.id, applyResponse])

  const pendingHeaderRef = useRef(0)

  async function patchHeader(patch: Record<string, unknown>): Promise<boolean> {
    // Asegurar que cualquier debounce pendiente del cliente se mande primero
    // para no perderse en el refresh que dispara este PATCH.
    clienteFormRef.current?.flush()

    // Optimistic update: aplicar el patch al state local inmediatamente
    // para que la UI (especialmente la grilla de días) responda al instante.
    const previous = cotizacion
    const optimistic = { ...previous } as QuotesRow & Record<string, unknown>
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined) continue
      ;(optimistic as Record<string, unknown>)[key] = value
    }
    setCotizacion(optimistic as QuotesRow)

    const requestId = ++pendingHeaderRef.current
    setIsMutating(true)
    try {
      const res = await fetch(`/api/cotizaciones/${cotizacion.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      })
      const { data, error } = await readApiResponse(res)
      // Si llegó una respuesta a un request más viejo, ignorarla
      if (requestId !== pendingHeaderRef.current) return true
      if (error) {
        setCotizacion(previous)
        toast.error(error)
        return false
      }
      applyResponse(data)
      return true
    } catch (err) {
      if (requestId === pendingHeaderRef.current) {
        setCotizacion(previous)
        toast.error(err instanceof Error ? err.message : "Error al guardar")
      }
      return false
    } finally {
      if (requestId === pendingHeaderRef.current) {
        setIsMutating(false)
      }
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
    precio_unit?: number
  }) {
    setIsMutating(true)
    try {
      const res = await fetch(`/api/cotizaciones/${cotizacion.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const { error } = await readApiResponse(res)
      if (error) {
        toast.error(error)
        return
      }
      await refreshCotizacion()
      toast.success("Servicio agregado")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al agregar")
    } finally {
      setIsMutating(false)
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
      const { error } = await readApiResponse(res)
      if (error) {
        toast.error(error)
        return
      }
      await refreshCotizacion()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al actualizar")
    }
  }

  async function deleteItem(itemId: string) {
    setIsMutating(true)
    try {
      const res = await fetch(
        `/api/cotizaciones/${cotizacion.id}/items/${itemId}`,
        { method: "DELETE" },
      )
      const { error } = await readApiResponse(res)
      if (error) {
        toast.error(error)
        return
      }
      await refreshCotizacion()
      toast.success("Servicio eliminado")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar")
    } finally {
      setIsMutating(false)
    }
  }

  function handleAddService(diaOffset: number, fecha: string | null) {
    setPickerDia({ offset: diaOffset, fecha })
    setPickerOpen(true)
  }

  async function handlePickServicio(servicio: QuoterServicesRow) {
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
      precio_unit: precio,
    })
  }

  function preflightSend(): boolean {
    if (items.length === 0) {
      toast.error("Agregá al menos un servicio antes de enviar.")
      return false
    }
    if (!cotizacion.fecha_inicio || !cotizacion.fecha_fin) {
      toast.error("Cargá las fechas del viaje antes de enviar.")
      return false
    }
    if (
      !cotizacion.cliente_nombre ||
      cotizacion.cliente_nombre.trim().length === 0
    ) {
      toast.error("Cargá el nombre del cliente antes de enviar.")
      return false
    }
    return true
  }

  async function sendCotizacion(): Promise<boolean> {
    const res = await fetch(`/api/cotizaciones/${cotizacion.id}/send`, {
      method: "POST",
    })
    const { data, error } = await readApiResponse(res)
    if (error) {
      toast.error(error)
      return false
    }
    if (data) applyResponse(data)
    return true
  }

  function buildWhatsAppUrl(text: string, phone: string | null | undefined) {
    const clean = (phone ?? "").replace(/\D/g, "")
    const encoded = encodeURIComponent(text)
    return clean
      ? `https://wa.me/${clean}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`
  }

  function handleSendWhatsApp(textToSend: string) {
    if (!preflightSend()) return
    clienteFormRef.current?.flush()
    const waUrl = buildWhatsAppUrl(textToSend, cotizacion.cliente_telefono)
    // Abrir WhatsApp inmediatamente (mismo gesto del usuario) para evitar bloqueo de pop-ups
    const waWindow = window.open(waUrl, "_blank")
    startSending(async () => {
      try {
        const ok = await sendCotizacion()
        if (!ok) {
          waWindow?.close()
          return
        }
        toast.success("Cotización enviada por WhatsApp")
        router.refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al enviar")
      }
    })
  }

  function handleSendCopy(textToCopy: string) {
    if (!preflightSend()) return
    clienteFormRef.current?.flush()
    startSending(async () => {
      try {
        const ok = await sendCotizacion()
        if (!ok) return
        try {
          await navigator.clipboard.writeText(textToCopy)
          toast.success("Cotización copiada al portapapeles")
        } catch {
          toast.error(
            "Cotización marcada como enviada, pero no pudimos copiar al portapapeles",
          )
        }
        router.refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al enviar")
      }
    })
  }

  async function changeEstado(estado: "borrador" | "archivada") {
    setIsMutating(true)
    try {
      const res = await fetch(`/api/cotizaciones/${cotizacion.id}/estado`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      })
      const { data, error } = await readApiResponse(res)
      if (error) {
        toast.error(error)
        return
      }
      if (data) applyResponse(data)
      toast.success(
        estado === "archivada"
          ? "Cotización archivada"
          : "Cotización vuelta a borrador",
      )
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al cambiar el estado")
    } finally {
      setIsMutating(false)
    }
  }

  const resolvedPublicUrl = useMemo(() => {
    if (publicUrl) return publicUrl
    if (typeof window === "undefined") return ""
    return `${window.location.origin}/cotizacion/${cotizacion.token}`
  }, [publicUrl, cotizacion.token])

  useEffect(() => {
    if (cotizacion.estado === "enviada" && !publicUrl && typeof window !== "undefined") {
      setPublicUrl(`${window.location.origin}/cotizacion/${cotizacion.token}`)
    }
  }, [cotizacion.estado, cotizacion.token, publicUrl])

  const itineraryText = useMemo(() => {
    // Buenas prácticas WhatsApp:
    // - *bold* sólo para títulos y precio final
    // - _italic_ para descripciones largas
    // - separadores con caracteres unicode para airear secciones
    // - URLs siempre en su propia línea (mejora la preview)
    const SEPARATOR = "━━━━━━━━━━━━━━━━━━━━"
    const lines: string[] = []

    function pushBlank() {
      lines.push("")
    }

    function capitalize(text: string) {
      return text.length ? text[0].toUpperCase() + text.slice(1) : text
    }

    function formatLongDate(iso: string) {
      const raw = new Date(iso + "T00:00:00").toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
      return capitalize(raw)
    }

    function formatShortDate(iso: string | null) {
      if (!iso) return ""
      const raw = new Date(iso + "T00:00:00").toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      return raw
    }

    function pluralize(n: number, singular: string, plural: string) {
      return `${n} ${n === 1 ? singular : plural}`
    }

    // ─── Encabezado de marca ─────────────────────────────────
    lines.push("*APACHETA VIAJES*")
    lines.push("_Cotización personalizada_")
    pushBlank()
    lines.push(SEPARATOR)
    pushBlank()

    // ─── Datos del cliente ───────────────────────────────────
    if (cotizacion.cliente_nombre) {
      lines.push(`*Cliente:* ${cotizacion.cliente_nombre}`)
    }
    if (cotizacion.cliente_email) {
      lines.push(`*Email:* ${cotizacion.cliente_email}`)
    }
    if (cotizacion.cliente_telefono) {
      lines.push(`*Teléfono:* ${cotizacion.cliente_telefono}`)
    }
    if (cotizacion.cliente_nombre || cotizacion.cliente_email || cotizacion.cliente_telefono) {
      pushBlank()
    }

    // ─── Fechas del viaje ────────────────────────────────────
    if (cotizacion.fecha_inicio && cotizacion.fecha_fin) {
      lines.push(
        `*Fechas:* ${formatShortDate(cotizacion.fecha_inicio)} → ${formatShortDate(cotizacion.fecha_fin)}`,
      )
      const totalDays = days.length
      if (totalDays > 0) {
        const noches = Math.max(totalDays - 1, 0)
        lines.push(
          `${pluralize(totalDays, "día", "días")} / ${pluralize(noches, "noche", "noches")}`,
        )
      }
      pushBlank()
    }

    lines.push(SEPARATOR)
    pushBlank()

    // ─── Itinerario día por día ─────────────────────────────
    days.forEach((fecha, i) => {
      const dayItems = itemsByDay.get(i) ?? []
      lines.push(`*DÍA ${i + 1}*  ·  ${formatLongDate(fecha)}`)
      pushBlank()

      if (dayItems.length === 0) {
        lines.push("_Sin servicios cargados_")
      } else {
        dayItems.forEach((s, index) => {
          lines.push(`*› ${s.servicio_nombre}*`)
          if (s.servicio_descripcion) {
            lines.push(`_${s.servicio_descripcion}_`)
          }
          if (s.is_special) {
            lines.push(`Precio: *${formatMoney(s.subtotal_venta)}*`)
          } else {
            const personas: string[] = []
            if (s.adultos > 0) personas.push(pluralize(s.adultos, "adulto", "adultos"))
            if (s.menores > 0) personas.push(pluralize(s.menores, "menor", "menores"))
            const personasTxt = personas.join(" + ") || "—"
            lines.push(`${personasTxt} · *${formatMoney(s.subtotal_venta)}*`)
          }
          if (index < dayItems.length - 1) pushBlank()
        })
      }
      pushBlank()
      lines.push(SEPARATOR)
      pushBlank()
    })

    // ─── Resumen económico ───────────────────────────────────
    lines.push("*RESUMEN*")
    pushBlank()
    lines.push(`Subtotal servicios: ${formatMoney(cotizacion.total_venta)}`)
    if (cotizacion.aplica_impuesto) {
      lines.push(
        `Impuestos (${cotizacion.impuesto_pct}%): ${formatMoney(cotizacion.total_impuesto)}`,
      )
    } else {
      lines.push(`Impuestos (${cotizacion.impuesto_pct}%): no aplicados`)
    }
    pushBlank()
    lines.push(`*TOTAL FINAL: ${formatMoney(cotizacion.total_final)}*`)

    // ─── Footer ──────────────────────────────────────────────
    pushBlank()
    lines.push(SEPARATOR)
    pushBlank()
    if (resolvedPublicUrl) {
      lines.push("*Ver cotización online:*")
      lines.push(resolvedPublicUrl)
      pushBlank()
    }
    lines.push("_Quedamos a tu disposición._")
    lines.push("_Apacheta Viajes_")

    return lines.join("\n")
  }, [cotizacion, days, itemsByDay, resolvedPublicUrl])

  const totalItems = items.length
  const totalDias = days.length

  return (
    <>
      <div className="p-3 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto pb-32 lg:pb-8">
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
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${estadoBadge.bg} ${estadoBadge.text} ${estadoBadge.ring}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${estadoBadge.dot}`} />
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
          <div className="space-y-5 min-w-0">
            <Card>
              <CardContent className="space-y-4 py-4 sm:py-5">
                <h2 className="font-semibold text-sm text-neutral-900">
                  Datos del cliente
                </h2>
                <ClientInfoForm
                  ref={clienteFormRef}
                  initial={{
                    cliente_nombre: cotizacion.cliente_nombre,
                    cliente_email: cotizacion.cliente_email,
                    cliente_telefono: cotizacion.cliente_telefono,
                  }}
                  readonly={readonly}
                  onPatch={(patch) => patchHeader(patch).then(() => undefined)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4 py-4 sm:py-5">
                <h2 className="font-semibold text-sm text-neutral-900">
                  Fechas del viaje
                </h2>
                <DateRangeSection
                  inicio={cotizacion.fecha_inicio}
                  fin={cotizacion.fecha_fin}
                  readonly={readonly}
                  onCommit={(patch) => patchHeader(patch).then(() => undefined)}
                />
              </CardContent>
            </Card>

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
                  <DayCard
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

          <aside className="hidden lg:block lg:sticky lg:top-6 self-start space-y-4">
            <Card>
              <CardContent className="py-5 space-y-4">
                <h2 className="font-semibold text-sm text-neutral-900">
                  Totales
                </h2>
                <TotalsPanel
                  items={items}
                  days={days}
                  totalComision={cotizacion.total_comision}
                  totalImpuesto={cotizacion.total_impuesto}
                  totalFinal={cotizacion.total_final}
                  impuestoPct={cotizacion.impuesto_pct}
                  aplicaImpuesto={!!cotizacion.aplica_impuesto}
                  readonly={readonly}
                  onToggleImpuesto={(next) =>
                    patchHeader({ aplica_impuesto: next })
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
                    Mandala por WhatsApp al cliente o copiala al portapapeles
                    para pegarla donde quieras. Al hacerlo, la cotización pasa
                    al estado <strong>Enviada</strong>.
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => handleSendWhatsApp(itineraryText)}
                    disabled={
                      isSending ||
                      isMutating ||
                      items.length === 0 ||
                      !cotizacion.fecha_inicio ||
                      !cotizacion.fecha_fin ||
                      !cotizacion.cliente_nombre
                    }
                  >
                    <WhatsappLogo />
                    {isSending ? "Enviando…" : "Enviar por WhatsApp"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSendCopy(itineraryText)}
                    disabled={
                      isSending ||
                      isMutating ||
                      items.length === 0 ||
                      !cotizacion.fecha_inicio ||
                      !cotizacion.fecha_fin ||
                      !cotizacion.cliente_nombre
                    }
                  >
                    <Copy />
                    {isSending ? "Procesando…" : "Copiar al portapapeles"}
                  </Button>
                  {items.length === 0 ? (
                    <p className="text-[10px] text-neutral-400 text-center">
                      Agregá al menos un servicio.
                    </p>
                  ) : !cotizacion.cliente_telefono ? (
                    <p className="text-[11px] text-neutral-400 leading-relaxed text-center">
                      Sin teléfono del cliente cargado: WhatsApp se va a abrir
                      sin contacto preseleccionado.
                    </p>
                  ) : null}
                  <div className="pt-3 border-t border-neutral-100">
                    <DeleteQuoteButton
                      quoteId={cotizacion.id}
                      clienteNombre={cotizacion.cliente_nombre}
                      redirectTo="/operador"
                      disabled={isSending || isMutating}
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-5 space-y-3">
                  <h2 className="font-semibold text-sm text-neutral-900">
                    Compartir
                  </h2>
                  <DepartureActions
                    text={itineraryText}
                    publicUrl={resolvedPublicUrl}
                    clienteTelefono={cotizacion.cliente_telefono}
                  />
                  <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
                    {cotizacion.estado === "enviada" ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isMutating}
                          onClick={() => changeEstado("borrador")}
                        >
                          <ArrowCounterClockwise />
                          Volver a borrador
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isMutating}
                          onClick={() => changeEstado("archivada")}
                        >
                          <Archive />
                          Archivar
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isMutating}
                        onClick={() => changeEstado("borrador")}
                      >
                        <ArrowCounterClockwise />
                        Volver a borrador
                      </Button>
                    )}
                  </div>
                  <div className="pt-3 border-t border-neutral-100">
                    <DeleteQuoteButton
                      quoteId={cotizacion.id}
                      clienteNombre={cotizacion.cliente_nombre}
                      redirectTo="/operador"
                      disabled={isMutating}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>

        <SelectServiceSheet
          open={pickerOpen}
          onOpenChange={(o) => {
            setPickerOpen(o)
            if (!o) setPickerDia(null)
          }}
          categorias={categorias}
          servicios={servicios}
          tierComisionPct={tierComisionPct}
          onPick={handlePickServicio}
        />

        <AddSpecialDialog
          open={especialOpen}
          onOpenChange={(o) => {
            setEspecialOpen(o)
            if (!o) setEspecialCtx(null)
          }}
          kind={especialCtx?.kind ?? null}
          onConfirm={handleConfirmEspecial}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden">
        <div
          className={`bg-white border-t border-neutral-200 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.08)] transition-[max-height] duration-300 overflow-hidden ${
            mobileTotalsOpen ? "max-h-[80vh]" : "max-h-[160px]"
          }`}
        >
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

          {mobileTotalsOpen ? (
            <div className="px-4 pb-4 space-y-4 overflow-y-auto max-h-[calc(80vh-72px)]">
              <TotalsPanel
                items={items}
                days={days}
                totalComision={cotizacion.total_comision}
                totalImpuesto={cotizacion.total_impuesto}
                totalFinal={cotizacion.total_final}
                impuestoPct={cotizacion.impuesto_pct}
                aplicaImpuesto={!!cotizacion.aplica_impuesto}
                readonly={readonly}
                onToggleImpuesto={(next) =>
                  patchHeader({ aplica_impuesto: next })
                }
              />

              <div className="border-t border-neutral-200 pt-4 space-y-2">
                {cotizacion.estado === "borrador" ? (
                  <>
                    <Button
                      className="w-full"
                      onClick={() => handleSendWhatsApp(itineraryText)}
                      disabled={
                        isSending ||
                        isMutating ||
                        items.length === 0 ||
                        !cotizacion.fecha_inicio ||
                        !cotizacion.fecha_fin ||
                        !cotizacion.cliente_nombre
                      }
                    >
                      <WhatsappLogo />
                      {isSending ? "Enviando…" : "Enviar por WhatsApp"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleSendCopy(itineraryText)}
                      disabled={
                        isSending ||
                        isMutating ||
                        items.length === 0 ||
                        !cotizacion.fecha_inicio ||
                        !cotizacion.fecha_fin ||
                        !cotizacion.cliente_nombre
                      }
                    >
                      <Copy />
                      {isSending ? "Procesando…" : "Copiar al portapapeles"}
                    </Button>
                  </>
                ) : (
                  <>
                    <DepartureActions
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
                          disabled={isMutating}
                          onClick={() => changeEstado("borrador")}
                        >
                          <ArrowCounterClockwise />
                          Borrador
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isMutating}
                          onClick={() => changeEstado("archivada")}
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
                        disabled={isMutating}
                        onClick={() => changeEstado("borrador")}
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
