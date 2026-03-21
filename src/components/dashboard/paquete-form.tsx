"use client"

import { useActionState, useEffect, useMemo, useRef, useState } from "react"
import { FloppyDisk, Plus, Trash } from "@phosphor-icons/react"
import { toast } from "sonner"

import type { ActionState } from "@/app/dashboard/paquetes/actions"
import { FormGalleryUploader } from "@/components/dashboard/form-gallery-uploader"
import { FormImageUploader } from "@/components/dashboard/form-image-uploader"
import { FormSection } from "@/components/dashboard/form-section"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { CategoriasExperienciaRow } from "@/types/categorias-experiencia/categorias-experiencia.types"
import type { DestinosRow } from "@/types/destinos/destinos.types"
import type { Moneda } from "@/types/shared/enums"

interface PackageDateDraft {
  id?: string
  clientId: string
  fecha_inicio: string
  fecha_fin: string
  precio_por_persona: number
  moneda: Moneda
  cupo_total: number
  cupo_disponible: number
  activo: boolean
}

interface PackageItineraryDraft {
  id?: string
  clientId: string
  dia_numero: number
  titulo: string
  descripcion: string
}

interface PaqueteFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
  initialData?: {
    nombre?: string
    descripcion_corta?: string | null
    descripcion?: string | null
    activo?: boolean | null
    destacado?: boolean | null
    imagen_url?: string | null
    duracion_dias?: number
    precio_desde?: number
    moneda?: Moneda | null
    destino_id?: string | null
    orden?: number | null
    incluye_alojamiento?: boolean | null
    incluye_traslado?: boolean | null
    incluye_comidas?: boolean | null
    incluye_guia?: boolean | null
    incluye_entradas?: boolean | null
    categoria_ids?: string[]
    fechas?: Array<{
      id?: string
      fecha_inicio: string
      fecha_fin: string
      precio_por_persona: number
      moneda?: Moneda | null
      cupo_total: number
      cupo_disponible: number
      activo?: boolean | null
    }>
    itinerario?: Array<{
      id?: string
      dia_numero: number
      titulo: string
      descripcion: string
    }>
    gallery?: string[]
  }
  categorias: CategoriasExperienciaRow[]
  destinos: DestinosRow[]
  canToggleDestacado: boolean
  isEdit?: boolean
}

const initialState: ActionState = {}
const MONEDAS: Moneda[] = ["ARS", "USD", "EUR", "BRL", "MXN", "CLP", "COP", "PEN", "UYU"]

function createClientId() {
  return Math.random().toString(36).slice(2, 10)
}

function createEmptyDate(moneda: Moneda): PackageDateDraft {
  return {
    clientId: createClientId(),
    fecha_inicio: "",
    fecha_fin: "",
    precio_por_persona: 0,
    moneda,
    cupo_total: 1,
    cupo_disponible: 1,
    activo: true,
  }
}

function createEmptyItineraryDay(nextDay: number): PackageItineraryDraft {
  return {
    clientId: createClientId(),
    dia_numero: nextDay,
    titulo: "",
    descripcion: "",
  }
}

function serializeDateDraft(date: PackageDateDraft) {
  return {
    id: date.id,
    fecha_inicio: date.fecha_inicio,
    fecha_fin: date.fecha_fin,
    precio_por_persona: date.precio_por_persona,
    moneda: date.moneda,
    cupo_total: date.cupo_total,
    cupo_disponible: date.cupo_disponible,
    activo: date.activo,
  }
}

function serializeItineraryDraft(item: PackageItineraryDraft) {
  return {
    id: item.id,
    dia_numero: item.dia_numero,
    titulo: item.titulo,
    descripcion: item.descripcion,
  }
}

export function PaqueteForm({
  action,
  initialData,
  categorias,
  destinos,
  canToggleDestacado,
  isEdit = false,
}: PaqueteFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState)
  const [descripcionCorta, setDescripcionCorta] = useState(
    initialData?.descripcion_corta ?? "",
  )
  const [duracionDias, setDuracionDias] = useState(initialData?.duracion_dias ?? 1)
  const [destacado, setDestacado] = useState(initialData?.destacado ?? false)
  const [activo, setActivo] = useState<string>(
    initialData?.activo === false ? "false" : "true",
  )
  const [moneda, setMoneda] = useState<Moneda>(initialData?.moneda ?? "ARS")
  const [destinoId, setDestinoId] = useState(initialData?.destino_id ?? "__none__")
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    initialData?.categoria_ids ?? [],
  )
  const [includes, setIncludes] = useState({
    alojamiento: initialData?.incluye_alojamiento ?? false,
    traslado: initialData?.incluye_traslado ?? false,
    comidas: initialData?.incluye_comidas ?? false,
    guia: initialData?.incluye_guia ?? false,
    entradas: initialData?.incluye_entradas ?? false,
  })
  const [fechas, setFechas] = useState<PackageDateDraft[]>(
    (initialData?.fechas ?? []).map((date) => ({
      id: date.id,
      clientId: createClientId(),
      fecha_inicio: date.fecha_inicio,
      fecha_fin: date.fecha_fin,
      precio_por_persona: date.precio_por_persona,
      moneda: date.moneda ?? initialData?.moneda ?? "ARS",
      cupo_total: date.cupo_total,
      cupo_disponible: date.cupo_disponible,
      activo: date.activo !== false,
    })),
  )
  const [itinerary, setItinerary] = useState<PackageItineraryDraft[]>(
    (initialData?.itinerario ?? [])
      .sort((left, right) => left.dia_numero - right.dia_numero)
      .map((item) => ({
        id: item.id,
        clientId: createClientId(),
        dia_numero: item.dia_numero,
        titulo: item.titulo,
        descripcion: item.descripcion,
      })),
  )
  const hasSubmitted = useRef(false)

  useEffect(() => {
    if (!hasSubmitted.current) {
      if (isPending) hasSubmitted.current = true
      return
    }
    if (isEdit && !isPending && !state?.error && !state?.fieldErrors) {
      toast.success("Paquete actualizado correctamente")
    }
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state, isPending, isEdit])

  const noches = Math.max(0, duracionDias - 1)
  const serializedFechas = useMemo(
    () => JSON.stringify(fechas.map(serializeDateDraft)),
    [fechas],
  )
  const serializedItinerary = useMemo(
    () => JSON.stringify(itinerary.map(serializeItineraryDraft)),
    [itinerary],
  )

  function toggleCategory(categoryId: string) {
    setSelectedCategoryIds((currentValue) =>
      currentValue.includes(categoryId)
        ? currentValue.filter((currentId) => currentId !== categoryId)
        : [...currentValue, categoryId],
    )
  }

  function addDate() {
    setFechas((currentDates) => [...currentDates, createEmptyDate(moneda)])
  }

  function updateDate(
    clientId: string,
    field: keyof PackageDateDraft,
    value: string | number | boolean,
  ) {
    setFechas((currentDates) =>
      currentDates.map((date) =>
        date.clientId === clientId ? { ...date, [field]: value } : date,
      ),
    )
  }

  function removeDate(clientId: string) {
    setFechas((currentDates) =>
      currentDates.filter((date) => date.clientId !== clientId),
    )
  }

  function addItineraryDay() {
    const nextDay =
      itinerary.length === 0
        ? 1
        : Math.max(...itinerary.map((item) => item.dia_numero)) + 1
    setItinerary((currentItems) => [
      ...currentItems,
      createEmptyItineraryDay(nextDay),
    ])
  }

  function updateItineraryDay(
    clientId: string,
    field: keyof PackageItineraryDraft,
    value: string | number,
  ) {
    setItinerary((currentItems) =>
      currentItems.map((item) =>
        item.clientId === clientId ? { ...item, [field]: value } : item,
      ),
    )
  }

  function removeItineraryDay(clientId: string) {
    setItinerary((currentItems) =>
      currentItems.filter((item) => item.clientId !== clientId),
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      <FormSection title="General">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nombre">Nombre del Paquete</Label>
            <Input id="nombre" name="nombre" defaultValue={initialData?.nombre ?? ""} />
            {state?.fieldErrors?.nombre && (
              <p className="text-xs text-destructive">{state.fieldErrors.nombre}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="descripcion_corta">Descripción Corta</Label>
            <Textarea
              id="descripcion_corta"
              name="descripcion_corta"
              value={descripcionCorta}
              onChange={(event) => setDescripcionCorta(event.target.value)}
              maxLength={160}
              rows={2}
            />
            <div className="flex justify-end">
              <span
                className={`text-xs ${
                  descripcionCorta.length > 150 ? "text-amber-500" : "text-muted-foreground"
                }`}
              >
                {descripcionCorta.length}/160
              </span>
            </div>
            {state?.fieldErrors?.descripcion_corta && (
              <p className="text-xs text-destructive">
                {state.fieldErrors.descripcion_corta}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Estado</Label>
              <input type="hidden" name="activo" value={activo} />
              <Select value={activo} onValueChange={setActivo}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activo</SelectItem>
                  <SelectItem value="false">Borrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Destacado</Label>
              <div className="flex h-8 items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!canToggleDestacado && !destacado) return
                    setDestacado((currentValue) => !currentValue)
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
                    destacado ? "bg-primary" : "bg-neutral-200"
                  } ${!canToggleDestacado && !destacado ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      destacado ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <input type="hidden" name="destacado" value={destacado ? "true" : "false"} />
                <span className="text-xs text-neutral-600">
                  {destacado ? "Mostrar en página de inicio" : "No destacado"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Moneda</Label>
              <input type="hidden" name="moneda" value={moneda} />
              <Select value={moneda} onValueChange={(value) => setMoneda(value as Moneda)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONEDAS.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Destino</Label>
              <input
                type="hidden"
                name="destino_id"
                value={destinoId === "__none__" ? "" : destinoId}
              />
              <Select value={destinoId} onValueChange={setDestinoId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sin destino" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Sin destino</SelectItem>
                  {destinos.map((destino) => (
                    <SelectItem key={destino.id} value={destino.id}>
                      {destino.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="orden">Orden</Label>
              <Input
                id="orden"
                name="orden"
                type="number"
                min={0}
                defaultValue={initialData?.orden ?? 0}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Imagen Principal</Label>
            <FormImageUploader
              name="imagen_url"
              value={initialData?.imagen_url}
              folder="paquetes"
              label=""
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Detalles del Paquete">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              defaultValue={initialData?.descripcion ?? ""}
              rows={6}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="duracion_dias">Días</Label>
              <Input
                id="duracion_dias"
                name="duracion_dias"
                type="number"
                min={1}
                value={duracionDias}
                onChange={(event) => setDuracionDias(Math.max(1, Number(event.target.value)))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Noches</Label>
              <Input value={noches} readOnly className="bg-neutral-50 text-neutral-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="precio_desde">Precio base</Label>
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-xs font-medium text-neutral-500">{moneda}</span>
              <Input
                id="precio_desde"
                name="precio_desde"
                type="number"
                min={0}
                defaultValue={initialData?.precio_desde ?? 0}
              />
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="Incluye">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            { key: "alojamiento", label: "Alojamiento", field: "incluye_alojamiento" },
            { key: "traslado", label: "Traslados", field: "incluye_traslado" },
            { key: "comidas", label: "Comidas", field: "incluye_comidas" },
            { key: "guia", label: "Guía", field: "incluye_guia" },
            { key: "entradas", label: "Entradas", field: "incluye_entradas" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between border border-neutral-200 px-4 py-3"
            >
              <span className="text-sm text-neutral-700">{item.label}</span>
              <button
                type="button"
                onClick={() =>
                  setIncludes((currentValue) => ({
                    ...currentValue,
                    [item.key]: !currentValue[item.key as keyof typeof currentValue],
                  }))
                }
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer ${
                  includes[item.key as keyof typeof includes] ? "bg-primary" : "bg-neutral-200"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    includes[item.key as keyof typeof includes] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <input
                type="hidden"
                name={item.field}
                value={includes[item.key as keyof typeof includes] ? "true" : "false"}
              />
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="Categorías">
        <input type="hidden" name="categoria_ids" value={JSON.stringify(selectedCategoryIds)} />
        <div className="flex flex-wrap gap-2">
          {categorias.map((categoria) => {
            const selected = selectedCategoryIds.includes(categoria.id)
            return (
              <button
                key={categoria.id}
                type="button"
                onClick={() => toggleCategory(categoria.id)}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  selected
                    ? "bg-primary text-white"
                    : "border border-neutral-200 bg-white text-neutral-600 hover:border-primary hover:text-primary"
                }`}
              >
                {categoria.nombre}
              </button>
            )
          })}
        </div>
      </FormSection>

      <FormGalleryUploader
        name="gallery"
        initialUrls={initialData?.gallery ?? []}
        folder="paquetes/gallery"
      />

      <FormSection title="Salidas">
        <input type="hidden" name="dates" value={serializedFechas} />
        <div className="space-y-4">
          {fechas.length === 0 ? (
            <p className="text-sm text-neutral-500">Todavía no agregaste fechas de salida.</p>
          ) : null}
          {fechas.map((date) => (
            <div key={date.clientId} className="space-y-4 border border-neutral-200 p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="space-y-1.5">
                  <Label>Fecha inicio</Label>
                  <Input
                    type="date"
                    value={date.fecha_inicio}
                    onChange={(event) => updateDate(date.clientId, "fecha_inicio", event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Fecha fin</Label>
                  <Input
                    type="date"
                    value={date.fecha_fin}
                    onChange={(event) => updateDate(date.clientId, "fecha_fin", event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Precio por persona</Label>
                  <Input
                    type="number"
                    min={0}
                    value={date.precio_por_persona}
                    onChange={(event) =>
                      updateDate(date.clientId, "precio_por_persona", Number(event.target.value))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Moneda</Label>
                  <Select
                    value={date.moneda}
                    onValueChange={(value) => updateDate(date.clientId, "moneda", value as Moneda)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONEDAS.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-1.5">
                  <Label>Cupo total</Label>
                  <Input
                    type="number"
                    min={1}
                    value={date.cupo_total}
                    onChange={(event) => updateDate(date.clientId, "cupo_total", Number(event.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Cupo disponible</Label>
                  <Input
                    type="number"
                    min={0}
                    value={date.cupo_disponible}
                    onChange={(event) =>
                      updateDate(date.clientId, "cupo_disponible", Number(event.target.value))
                    }
                  />
                </div>
                <div className="flex items-end justify-between gap-4">
                  <div className="flex items-center gap-3 pb-2">
                    <button
                      type="button"
                      onClick={() => updateDate(date.clientId, "activo", !date.activo)}
                      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer ${
                        date.activo ? "bg-primary" : "bg-neutral-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                          date.activo ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span className="text-xs text-neutral-600">{date.activo ? "Activa" : "Inactiva"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDate(date.clientId)}
                    className="inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-red-500 cursor-pointer"
                  >
                    <Trash className="h-4 w-4" />
                    Quitar
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addDate}
            className="inline-flex items-center gap-2 border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Agregar salida
          </button>
        </div>
      </FormSection>

      <FormSection title="Itinerario">
        <input type="hidden" name="itinerary" value={serializedItinerary} />
        <div className="space-y-4">
          {itinerary.length === 0 ? (
            <p className="text-sm text-neutral-500">Todavía no agregaste días al itinerario.</p>
          ) : null}
          {itinerary.map((item) => (
            <div key={item.clientId} className="space-y-4 border border-neutral-200 p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[120px_1fr]">
                <div className="space-y-1.5">
                  <Label>Día</Label>
                  <Input
                    type="number"
                    min={1}
                    value={item.dia_numero}
                    onChange={(event) =>
                      updateItineraryDay(item.clientId, "dia_numero", Number(event.target.value))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Título</Label>
                  <Input
                    value={item.titulo}
                    onChange={(event) => updateItineraryDay(item.clientId, "titulo", event.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Descripción</Label>
                <Textarea
                  rows={4}
                  value={item.descripcion}
                  onChange={(event) =>
                    updateItineraryDay(item.clientId, "descripcion", event.target.value)
                  }
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeItineraryDay(item.clientId)}
                  className="inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-red-500 cursor-pointer"
                >
                  <Trash className="h-4 w-4" />
                  Quitar día
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addItineraryDay}
            className="inline-flex items-center gap-2 border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Agregar día
          </button>
        </div>
      </FormSection>

      <div className="flex items-center justify-end gap-3 py-4">
        <a
          href="/dashboard/paquetes"
          className="px-4 py-2 text-sm text-neutral-500 transition-colors hover:text-neutral-800"
        >
          Cancelar
        </a>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-60 cursor-pointer"
        >
          <FloppyDisk className="h-4 w-4" />
          {isPending ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  )
}
