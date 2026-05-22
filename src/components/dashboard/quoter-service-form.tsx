"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { FloppyDisk } from "@phosphor-icons/react"
import { toast } from "sonner"

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
import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error"
import type { QuoterCategoriesRow } from "@/types/quoter-categories/quoter-categories.types"
import type { QuoterServicesRow } from "@/types/quoter-services/quoter-services.types"

interface QuoterServiceFormProps {
  categorias: QuoterCategoriesRow[]
  initialData?: Partial<QuoterServicesRow>
  isEdit?: boolean
}

type FieldErrors = Partial<
  Record<"nombre" | "categoria_id" | "comision_pct" | "orden", string>
>

export function QuoterServiceForm({
  categorias,
  initialData,
  isEdit = false,
}: QuoterServiceFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [categoryId, setCategoriaId] = useState<string>(
    initialData?.categoria_id ?? "__none__",
  )
  const [nombre, setNombre] = useState(initialData?.nombre ?? "")
  const [descripcion, setDescripcion] = useState(initialData?.descripcion ?? "")
  const [comisionPct, setComisionPct] = useState<string>(
    initialData?.comision_pct !== undefined
      ? String(initialData.comision_pct)
      : "0",
  )
  const [noPrice, setNoPrice] = useState(initialData?.no_price ?? false)
  const [isSpecial, setIsSpecial] = useState(initialData?.is_special ?? false)
  const [orden, setOrden] = useState<string>(
    initialData?.orden !== undefined && initialData?.orden !== null
      ? String(initialData.orden)
      : "0",
  )
  const [activo, setActivo] = useState<string>(
    initialData?.activo === false ? "false" : "true",
  )

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errors: FieldErrors = {}
    if (!nombre.trim()) errors.nombre = "El nombre es requerido"
    if (categoryId === "__none__") {
      errors.categoria_id = "Seleccioná una categoría"
    }
    const parsedComision = Number(comisionPct)
    if (!Number.isFinite(parsedComision) || parsedComision < 0) {
      errors.comision_pct = "Ingresá un porcentaje válido"
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})

    startTransition(async () => {
      try {
        const payload = {
          categoria_id: categoryId === "__none__" ? null : categoryId,
          nombre: nombre.trim(),
          descripcion: descripcion.trim() || null,
          comision_pct: parsedComision,
          no_price: noPrice,
          is_special: isSpecial,
          orden: orden ? Number(orden) : null,
          activo: activo === "true",
        }

        const endpoint =
          isEdit && initialData?.id
            ? `/api/dashboard/cotizador-servicios/${initialData.id}`
            : "/api/dashboard/cotizador-servicios"

        const response = await fetch(endpoint, {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const data = (await response.json().catch(() => ({}))) as {
            error?: string
          }
          throw new Error(data.error ?? "No se pudo guardar el servicio.")
        }

        toast.success(
          isEdit
            ? "Servicio actualizado correctamente"
            : "Servicio creado correctamente",
        )

        if (!isEdit) {
          router.push("/dashboard/cotizador/catalogo/servicios")
          router.refresh()
        } else {
          router.refresh()
        }
      } catch (error) {
        toast.error(
          getUserFacingErrorMessage(error, "No se pudo guardar el servicio."),
        )
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormSection title="Servicio">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Categoría</Label>
              <Select value={categoryId} onValueChange={setCategoriaId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Sin categoría</SelectItem>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                      {categoria.region ? ` · ${categoria.region}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.categoria_id && (
                <p className="text-xs text-destructive">
                  {fieldErrors.categoria_id}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                placeholder="Ej: Traslado IN/OUT Salta"
              />
              {fieldErrors.nombre && (
                <p className="text-xs text-destructive">
                  {fieldErrors.nombre}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              value={descripcion}
              onChange={(event) => setDescripcion(event.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="comision_pct">Comisión (%)</Label>
              <Input
                id="comision_pct"
                name="comision_pct"
                type="number"
                min={0}
                step="0.01"
                value={comisionPct}
                onChange={(event) => setComisionPct(event.target.value)}
              />
              {fieldErrors.comision_pct && (
                <p className="text-xs text-destructive">
                  {fieldErrors.comision_pct}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="orden">Orden</Label>
              <Input
                id="orden"
                name="orden"
                type="number"
                min={0}
                value={orden}
                onChange={(event) => setOrden(event.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Select value={activo} onValueChange={setActivo}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activo</SelectItem>
                  <SelectItem value="false">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Sin precio (consultar)</Label>
              <div className="flex h-8 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNoPrice((value) => !value)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    noPrice ? "bg-primary" : "bg-neutral-200"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      noPrice ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-xs text-neutral-600">
                  {noPrice ? "Sí — se cotiza a parte" : "No"}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Servicio especial</Label>
              <div className="flex h-8 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSpecial((value) => !value)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    isSpecial ? "bg-primary" : "bg-neutral-200"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      isSpecial ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-xs text-neutral-600">
                  {isSpecial ? "Sí" : "No"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </FormSection>

      <div className="flex items-center justify-end gap-3 py-4">
        <a
          href="/dashboard/cotizador/catalogo/servicios"
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
