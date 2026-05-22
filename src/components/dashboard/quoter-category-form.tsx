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
import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error"
import type { QuoterCategoriesRow } from "@/types/quoter-categories/quoter-categories.types"

const TIPOS: { value: string; label: string }[] = [
  { value: "traslado", label: "Traslado" },
  { value: "excursion", label: "Excursión" },
  { value: "promo", label: "Promo" },
  { value: "circuito", label: "Circuito" },
  { value: "tren", label: "Tren" },
]

interface QuoterCategoryFormProps {
  initialData?: Partial<QuoterCategoriesRow>
  isEdit?: boolean
}

type FieldErrors = Partial<Record<"nombre" | "region" | "tipo" | "orden", string>>

export function QuoterCategoryForm({
  initialData,
  isEdit = false,
}: QuoterCategoryFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [nombre, setNombre] = useState(initialData?.nombre ?? "")
  const [region, setRegion] = useState(initialData?.region ?? "")
  const [tipo, setTipo] = useState<string>(initialData?.tipo ?? "__none__")
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
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})

    startTransition(async () => {
      try {
        const payload = {
          nombre: nombre.trim(),
          region: region.trim() || null,
          tipo: tipo === "__none__" ? null : tipo,
          orden: orden ? Number(orden) : null,
          activo: activo === "true",
        }

        const endpoint =
          isEdit && initialData?.id
            ? `/api/dashboard/cotizador-categorias/${initialData.id}`
            : "/api/dashboard/cotizador-categorias"

        const response = await fetch(endpoint, {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const data = (await response.json().catch(() => ({}))) as {
            error?: string
          }
          throw new Error(data.error ?? "No se pudo guardar la categoría.")
        }

        toast.success(
          isEdit
            ? "Categoría actualizada correctamente"
            : "Categoría creada correctamente",
        )

        if (!isEdit) {
          router.push("/dashboard/cotizador/catalogo")
          router.refresh()
        } else {
          router.refresh()
        }
      } catch (error) {
        toast.error(
          getUserFacingErrorMessage(error, "No se pudo guardar la categoría."),
        )
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormSection title="Categoría">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              placeholder="Ej: Traslados Salta"
            />
            {fieldErrors.nombre && (
              <p className="text-xs text-destructive">{fieldErrors.nombre}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="region">Región</Label>
              <Input
                id="region"
                name="region"
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                placeholder="Ej: NOA"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sin tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Sin tipo</SelectItem>
                  {TIPOS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
        </div>
      </FormSection>

      <div className="flex items-center justify-end gap-3 py-4">
        <a
          href="/dashboard/cotizador/catalogo"
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
