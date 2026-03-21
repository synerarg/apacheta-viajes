"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { FloppyDisk } from "@phosphor-icons/react"
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

interface ExperienciaFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
  initialData?: {
    nombre?: string
    descripcion?: string | null
    descripcion_corta?: string | null
    activo?: boolean | null
    destacado?: boolean | null
    imagen_url?: string | null
    ubicacion?: string | null
    categoria_id?: string | null
    destino_id?: string | null
    duracion_horas?: number | null
    precio?: number | null
    moneda?: Moneda | null
    latitud?: number | null
    longitud?: number | null
    orden?: number | null
    gallery?: string[]
  }
  categorias: CategoriasExperienciaRow[]
  destinos: DestinosRow[]
  canToggleDestacado: boolean
  isEdit?: boolean
}

const initialState: ActionState = {}
const MONEDAS: Moneda[] = ["ARS", "USD", "EUR", "BRL", "MXN", "CLP", "COP", "PEN", "UYU"]

export function ExperienciaForm({
  action,
  initialData,
  categorias,
  destinos,
  canToggleDestacado,
  isEdit = false,
}: ExperienciaFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState)
  const [selectedCategoria, setSelectedCategoria] = useState<string>(
    initialData?.categoria_id ?? "__none__",
  )
  const [selectedDestino, setSelectedDestino] = useState<string>(
    initialData?.destino_id ?? "__none__",
  )
  const [moneda, setMoneda] = useState<Moneda>(initialData?.moneda ?? "ARS")
  const [descripcionCorta, setDescripcionCorta] = useState(
    initialData?.descripcion_corta ?? "",
  )
  const [destacado, setDestacado] = useState(initialData?.destacado ?? false)
  const [activo, setActivo] = useState<string>(
    initialData?.activo === false ? "false" : "true",
  )
  const hasSubmitted = useRef(false)

  useEffect(() => {
    if (!hasSubmitted.current) {
      if (isPending) hasSubmitted.current = true
      return
    }
    if (isEdit && !isPending && !state?.error && !state?.fieldErrors) {
      toast.success("Experiencia actualizada correctamente")
    }
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state, isPending, isEdit])

  return (
    <form action={formAction} className="space-y-4">
      <FormSection title="General">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nombre">Nombre de la Experiencia</Label>
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
                value={selectedDestino === "__none__" ? "" : selectedDestino}
              />
              <Select value={selectedDestino} onValueChange={setSelectedDestino}>
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
            <Label htmlFor="ubicacion">Ubicación</Label>
            <Input id="ubicacion" name="ubicacion" defaultValue={initialData?.ubicacion ?? ""} />
          </div>

          <div className="space-y-1.5">
            <Label>Imagen Principal</Label>
            <FormImageUploader
              name="imagen_url"
              value={initialData?.imagen_url}
              folder="experiencias"
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

      <FormGalleryUploader
        name="gallery"
        initialUrls={initialData?.gallery ?? []}
        folder="experiencias/gallery"
      />

      <FormSection title="Clasificación">
        <input
          type="hidden"
          name="categoria_id"
          value={selectedCategoria === "__none__" ? "" : selectedCategoria}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategoria("__none__")}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              selectedCategoria === "__none__"
                ? "bg-primary text-white"
                : "border border-neutral-200 bg-white text-neutral-600 hover:border-primary hover:text-primary"
            }`}
          >
            Sin categoría
          </button>
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              type="button"
              onClick={() => setSelectedCategoria(categoria.id)}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                selectedCategoria === categoria.id
                  ? "bg-primary text-white"
                  : "border border-neutral-200 bg-white text-neutral-600 hover:border-primary hover:text-primary"
              }`}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>
      </FormSection>

      <FormSection title="Duración y Precio">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="duracion_horas">Duración (horas)</Label>
            <Input
              id="duracion_horas"
              name="duracion_horas"
              type="number"
              min={0}
              step={0.5}
              defaultValue={initialData?.duracion_horas ?? ""}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="precio">Precio</Label>
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-xs font-medium text-neutral-500">{moneda}</span>
              <Input
                id="precio"
                name="precio"
                type="number"
                min={0}
                defaultValue={initialData?.precio ?? ""}
              />
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="Ubicación geográfica">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="latitud">Latitud</Label>
            <Input
              id="latitud"
              name="latitud"
              type="number"
              step="any"
              defaultValue={initialData?.latitud ?? ""}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="longitud">Longitud</Label>
            <Input
              id="longitud"
              name="longitud"
              type="number"
              step="any"
              defaultValue={initialData?.longitud ?? ""}
            />
          </div>
        </div>
      </FormSection>

      <div className="flex items-center justify-end gap-3 py-4">
        <a
          href="/dashboard/experiencias"
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
