"use client"

import { useActionState, useEffect, useMemo, useRef, useState } from "react"
import { FloppyDisk, Plus, Trash } from "@phosphor-icons/react"
import { toast } from "sonner"

import type {
  ActionState,
  TarifaFormItem,
} from "@/app/dashboard/traslados/actions"
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
import type { DestinosRow } from "@/types/destinos/destinos.types"
import type { Moneda } from "@/types/shared/enums"
import type {
  TrasladoModalidad,
  TrasladoTipoServicio,
  TrasladoVehiculoTipo,
} from "@/types/traslados/traslados.types"

interface TrasladoFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
  initialData?: {
    nombre?: string
    descripcion?: string | null
    descripcion_corta?: string | null
    origen?: string | null
    destino?: string | null
    tipo_servicio?: TrasladoTipoServicio | null
    modalidad?: TrasladoModalidad | null
    vehiculo_tipo?: TrasladoVehiculoTipo | null
    capacidad_max?: number | null
    base_minima_pax?: number | null
    precio_desde?: number | null
    moneda?: Moneda | null
    duracion_minutos?: number | null
    incluye_equipaje?: boolean | null
    incluye_iva?: boolean | null
    impuestos_adicionales_pct?: number | null
    imagen_url?: string | null
    destino_id?: string | null
    activo?: boolean | null
    destacado?: boolean | null
    orden?: number | null
    gallery?: string[]
  }
  destinos: DestinosRow[]
  tarifasIniciales?: TarifaFormItem[]
  isEdit?: boolean
}

const initialState: ActionState = {}
const MONEDAS: Moneda[] = [
  "ARS",
  "USD",
  "EUR",
  "BRL",
  "MXN",
  "CLP",
  "COP",
  "PEN",
  "UYU",
]

const TIPO_SERVICIO_OPTIONS: { value: TrasladoTipoServicio; label: string }[] = [
  { value: "regular", label: "Regular" },
  { value: "privado", label: "Privado" },
]

const MODALIDAD_OPTIONS: { value: TrasladoModalidad; label: string }[] = [
  { value: "ida", label: "Solo ida" },
  { value: "ida_vuelta", label: "Ida y vuelta" },
  { value: "punto_a_punto", label: "Punto a punto" },
]

const VEHICULO_OPTIONS: { value: TrasladoVehiculoTipo; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "combi", label: "Combi" },
  { value: "minibus", label: "Minibus" },
  { value: "camioneta_4x4", label: "Camioneta 4x4" },
  { value: "bus", label: "Bus" },
]

const SUGERENCIAS_LUGARES = [
  "Salta Capital",
  "Jujuy",
  "Tucumán",
  "Purmamarca",
  "Tilcara",
  "Cafayate",
]

function emptyTarifa(): TarifaFormItem {
  return {
    vigencia_label: "",
    vigencia_desde: null,
    vigencia_hasta: null,
    precio_adulto: null,
    precio_nino: null,
    moneda: "ARS",
    comision_pct: null,
    notas: null,
  }
}

export function TrasladoForm({
  action,
  initialData,
  destinos,
  tarifasIniciales = [],
  isEdit = false,
}: TrasladoFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState)

  const [selectedDestino, setSelectedDestino] = useState<string>(
    initialData?.destino_id ?? "__none__",
  )
  const [moneda, setMoneda] = useState<Moneda>(initialData?.moneda ?? "ARS")
  const [tipoServicio, setTipoServicio] = useState<TrasladoTipoServicio>(
    initialData?.tipo_servicio ?? "regular",
  )
  const [modalidad, setModalidad] = useState<TrasladoModalidad>(
    initialData?.modalidad ?? "ida",
  )
  const [vehiculoTipo, setVehiculoTipo] = useState<string>(
    initialData?.vehiculo_tipo ?? "__none__",
  )
  const [descripcionCorta, setDescripcionCorta] = useState(
    initialData?.descripcion_corta ?? "",
  )
  const [destacado, setDestacado] = useState(initialData?.destacado ?? false)
  const [activo, setActivo] = useState<string>(
    initialData?.activo === false ? "false" : "true",
  )
  const [incluyeEquipaje, setIncluyeEquipaje] = useState(
    initialData?.incluye_equipaje ?? false,
  )
  const [incluyeIva, setIncluyeIva] = useState(
    initialData?.incluye_iva ?? false,
  )

  const [tarifas, setTarifas] = useState<TarifaFormItem[]>(tarifasIniciales)
  const hasSubmitted = useRef(false)

  useEffect(() => {
    if (!hasSubmitted.current) {
      if (isPending) hasSubmitted.current = true
      return
    }
    if (isEdit && !isPending && !state?.error && !state?.fieldErrors) {
      toast.success("Traslado actualizado correctamente")
    }
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state, isPending, isEdit])

  const tarifasJson = useMemo(() => JSON.stringify(tarifas), [tarifas])

  function updateTarifa(index: number, patch: Partial<TarifaFormItem>) {
    setTarifas((current) =>
      current.map((item, idx) => (idx === index ? { ...item, ...patch } : item)),
    )
  }

  function removeTarifa(index: number) {
    setTarifas((current) => current.filter((_, idx) => idx !== index))
  }

  function addTarifa() {
    setTarifas((current) => [...current, emptyTarifa()])
  }

  return (
    <form action={formAction} className="space-y-4">
      <FormSection title="General">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nombre">Nombre del Traslado</Label>
            <Input
              id="nombre"
              name="nombre"
              defaultValue={initialData?.nombre ?? ""}
              placeholder="Ej: Traslado Aeropuerto Salta - Hotel"
            />
            {state?.fieldErrors?.nombre && (
              <p className="text-xs text-destructive">
                {state.fieldErrors.nombre}
              </p>
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
                  descripcionCorta.length > 150
                    ? "text-amber-500"
                    : "text-muted-foreground"
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
                  onClick={() => setDestacado((value) => !value)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    destacado ? "bg-primary" : "bg-neutral-200"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      destacado ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <input
                  type="hidden"
                  name="destacado"
                  value={destacado ? "true" : "false"}
                />
                <span className="text-xs text-neutral-600">
                  {destacado ? "Destacado" : "No destacado"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Destino vinculado</Label>
              <input
                type="hidden"
                name="destino_id"
                value={selectedDestino === "__none__" ? "" : selectedDestino}
              />
              <Select
                value={selectedDestino}
                onValueChange={setSelectedDestino}
              >
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
              folder="traslados"
              label=""
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Descripción">
        <div className="space-y-1.5">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            name="descripcion"
            defaultValue={initialData?.descripcion ?? ""}
            rows={6}
          />
        </div>
      </FormSection>

      <FormSection title="Servicio">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="origen">Origen</Label>
              <Input
                id="origen"
                name="origen"
                defaultValue={initialData?.origen ?? ""}
                placeholder="Ej: Salta Capital"
                list="traslado-lugares-sugeridos"
              />
              {state?.fieldErrors?.origen && (
                <p className="text-xs text-destructive">
                  {state.fieldErrors.origen}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="destino">Destino</Label>
              <Input
                id="destino"
                name="destino"
                defaultValue={initialData?.destino ?? ""}
                placeholder="Ej: Purmamarca"
                list="traslado-lugares-sugeridos"
              />
              {state?.fieldErrors?.destino && (
                <p className="text-xs text-destructive">
                  {state.fieldErrors.destino}
                </p>
              )}
            </div>
          </div>

          <datalist id="traslado-lugares-sugeridos">
            {SUGERENCIAS_LUGARES.map((lugar) => (
              <option key={lugar} value={lugar} />
            ))}
          </datalist>

          <p className="text-xs text-neutral-500">
            Sugerencias: {SUGERENCIAS_LUGARES.join(" · ")}
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Tipo de servicio</Label>
              <input
                type="hidden"
                name="tipo_servicio"
                value={tipoServicio}
              />
              <Select
                value={tipoServicio}
                onValueChange={(value) =>
                  setTipoServicio(value as TrasladoTipoServicio)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPO_SERVICIO_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Modalidad</Label>
              <input type="hidden" name="modalidad" value={modalidad} />
              <Select
                value={modalidad}
                onValueChange={(value) =>
                  setModalidad(value as TrasladoModalidad)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODALIDAD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Vehículo</Label>
              <input
                type="hidden"
                name="vehiculo_tipo"
                value={vehiculoTipo === "__none__" ? "" : vehiculoTipo}
              />
              <Select value={vehiculoTipo} onValueChange={setVehiculoTipo}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sin especificar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Sin especificar</SelectItem>
                  {VEHICULO_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="capacidad_max">Capacidad máxima</Label>
              <Input
                id="capacidad_max"
                name="capacidad_max"
                type="number"
                min={0}
                defaultValue={initialData?.capacidad_max ?? ""}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="base_minima_pax">Base mínima pax</Label>
              <Input
                id="base_minima_pax"
                name="base_minima_pax"
                type="number"
                min={1}
                defaultValue={initialData?.base_minima_pax ?? 1}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="duracion_minutos">Duración (minutos)</Label>
              <Input
                id="duracion_minutos"
                name="duracion_minutos"
                type="number"
                min={0}
                defaultValue={initialData?.duracion_minutos ?? ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Incluye equipaje</Label>
              <div className="flex h-8 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIncluyeEquipaje((value) => !value)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    incluyeEquipaje ? "bg-primary" : "bg-neutral-200"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      incluyeEquipaje ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <input
                  type="hidden"
                  name="incluye_equipaje"
                  value={incluyeEquipaje ? "true" : "false"}
                />
                <span className="text-xs text-neutral-600">
                  {incluyeEquipaje ? "Sí" : "No"}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Incluye IVA</Label>
              <div className="flex h-8 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIncluyeIva((value) => !value)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    incluyeIva ? "bg-primary" : "bg-neutral-200"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      incluyeIva ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <input
                  type="hidden"
                  name="incluye_iva"
                  value={incluyeIva ? "true" : "false"}
                />
                <span className="text-xs text-neutral-600">
                  {incluyeIva ? "Sí" : "No"}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="impuestos_adicionales_pct">
                Impuestos adicionales (%)
              </Label>
              <Input
                id="impuestos_adicionales_pct"
                name="impuestos_adicionales_pct"
                type="number"
                min={0}
                step="0.01"
                defaultValue={initialData?.impuestos_adicionales_pct ?? 1.2}
              />
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="Precio base">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="precio_desde">Precio desde</Label>
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-xs font-medium text-neutral-500">
                {moneda}
              </span>
              <Input
                id="precio_desde"
                name="precio_desde"
                type="number"
                min={0}
                step="0.01"
                defaultValue={initialData?.precio_desde ?? 0}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Moneda</Label>
            <input type="hidden" name="moneda" value={moneda} />
            <Select
              value={moneda}
              onValueChange={(value) => setMoneda(value as Moneda)}
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
      </FormSection>

      <FormSection
        title="Tarifas por vigencia (temporada)"
        right={
          <button
            type="button"
            onClick={addTarifa}
            className="inline-flex cursor-pointer items-center gap-1.5 bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar tarifa
          </button>
        }
      >
        <input type="hidden" name="tarifas" value={tarifasJson} />

        {tarifas.length === 0 ? (
          <p className="py-6 text-center text-sm text-neutral-500">
            No hay tarifas cargadas. Agregá una temporada con su vigencia y
            precios.
          </p>
        ) : (
          <div className="space-y-4">
            {tarifas.map((tarifa, index) => (
              <div
                key={index}
                className="space-y-3 border border-neutral-200 bg-neutral-50 p-3 sm:p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-neutral-600">
                    Tarifa #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTarifa(index)}
                    className="inline-flex cursor-pointer items-center gap-1 text-xs text-red-600 transition-colors hover:text-red-700"
                  >
                    <Trash className="h-3.5 w-3.5" />
                    Eliminar
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="space-y-1.5 md:col-span-1">
                    <Label>Etiqueta de vigencia</Label>
                    <Input
                      value={tarifa.vigencia_label ?? ""}
                      onChange={(event) =>
                        updateTarifa(index, {
                          vigencia_label: event.target.value || null,
                        })
                      }
                      placeholder="Ej: Oct 2025 - Mar 2026"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Desde</Label>
                    <Input
                      type="date"
                      value={tarifa.vigencia_desde ?? ""}
                      onChange={(event) =>
                        updateTarifa(index, {
                          vigencia_desde: event.target.value || null,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Hasta</Label>
                    <Input
                      type="date"
                      value={tarifa.vigencia_hasta ?? ""}
                      onChange={(event) =>
                        updateTarifa(index, {
                          vigencia_hasta: event.target.value || null,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                  <div className="space-y-1.5">
                    <Label>Precio adulto</Label>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={tarifa.precio_adulto ?? ""}
                      onChange={(event) =>
                        updateTarifa(index, {
                          precio_adulto:
                            event.target.value === ""
                              ? null
                              : Number(event.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Precio niño</Label>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={tarifa.precio_nino ?? ""}
                      onChange={(event) =>
                        updateTarifa(index, {
                          precio_nino:
                            event.target.value === ""
                              ? null
                              : Number(event.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Moneda</Label>
                    <Select
                      value={tarifa.moneda}
                      onValueChange={(value) =>
                        updateTarifa(index, { moneda: value as Moneda })
                      }
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
                  <div className="space-y-1.5">
                    <Label>Comisión (%)</Label>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={tarifa.comision_pct ?? ""}
                      onChange={(event) =>
                        updateTarifa(index, {
                          comision_pct:
                            event.target.value === ""
                              ? null
                              : Number(event.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Notas</Label>
                  <Textarea
                    rows={2}
                    value={tarifa.notas ?? ""}
                    onChange={(event) =>
                      updateTarifa(index, {
                        notas: event.target.value || null,
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </FormSection>

      <FormGalleryUploader
        name="gallery"
        initialUrls={initialData?.gallery ?? []}
        folder="traslados/gallery"
      />

      <div className="flex items-center justify-end gap-3 py-4">
        <a
          href="/dashboard/traslados"
          className="px-4 py-2 text-sm text-neutral-500 transition-colors hover:text-neutral-800"
        >
          Cancelar
        </a>
        <button
          type="submit"
          disabled={isPending}
          className="flex cursor-pointer items-center gap-2 bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          <FloppyDisk className="h-4 w-4" />
          {isPending ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  )
}
