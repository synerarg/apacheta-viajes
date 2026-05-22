"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
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
import type { OperatorTypesRow } from "@/types/operator-types/operator-types.types"

interface OperatorTypeFormProps {
  initialData?: Partial<OperatorTypesRow>
  isEdit?: boolean
}

type FieldErrors = Partial<Record<"nombre" | "comision_pct" | "orden", string>>

export function OperatorTypeForm({
  initialData,
  isEdit = false,
}: OperatorTypeFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [nombre, setNombre] = useState(initialData?.nombre ?? "")
  const [comisionPct, setComisionPct] = useState<string>(
    initialData?.comision_pct !== undefined && initialData?.comision_pct !== null
      ? String(initialData.comision_pct)
      : "0",
  )
  const [descripcion, setDescripcion] = useState(initialData?.descripcion ?? "")
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
    if (nombre.trim().length < 2) errors.nombre = "Mínimo 2 caracteres"
    const comisionNum = Number(comisionPct)
    if (!Number.isFinite(comisionNum) || comisionNum < 0 || comisionNum > 100) {
      errors.comision_pct = "Debe estar entre 0 y 100"
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})

    startTransition(async () => {
      try {
        const payload = {
          nombre: nombre.trim(),
          comision_pct: comisionNum,
          descripcion: descripcion.trim() || null,
          orden: orden ? Number(orden) : 0,
          activo: activo === "true",
        }

        const endpoint =
          isEdit && initialData?.id
            ? `/api/dashboard/operator-types/${initialData.id}`
            : "/api/dashboard/operator-types"

        const response = await fetch(endpoint, {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const data = (await response.json().catch(() => ({}))) as { error?: string }
          throw new Error(data.error ?? "No se pudo guardar el tipo de operador.")
        }

        toast.success(
          isEdit ? "Tipo actualizado correctamente" : "Tipo creado correctamente",
        )

        if (!isEdit) {
          router.push("/dashboard/operadores/tipos")
          router.refresh()
        } else {
          router.refresh()
        }
      } catch (error) {
        toast.error(
          getUserFacingErrorMessage(error, "No se pudo guardar el tipo de operador."),
        )
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormSection title="Tipo de operador">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              placeholder="Ej: Mayoristas"
            />
            {fieldErrors.nombre && (
              <p className="text-xs text-destructive">{fieldErrors.nombre}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="comision_pct">Comisión (%)</Label>
              <Input
                id="comision_pct"
                name="comision_pct"
                type="number"
                step="0.01"
                min={0}
                max={100}
                value={comisionPct}
                onChange={(event) => setComisionPct(event.target.value)}
                placeholder="Ej: 12.5"
              />
              {fieldErrors.comision_pct ? (
                <p className="text-xs text-destructive">{fieldErrors.comision_pct}</p>
              ) : (
                <p className="text-xs text-neutral-500">
                  Porcentaje de comisión que aplica a operadores de este tipo.
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
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              rows={3}
              value={descripcion}
              onChange={(event) => setDescripcion(event.target.value)}
              placeholder="Notas internas, condiciones especiales..."
            />
          </div>

          <div className="space-y-1.5 md:w-1/2">
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
            <p className="text-xs text-neutral-500">
              Solo los tipos activos aparecen en el formulario de solicitud.
            </p>
          </div>
        </div>
      </FormSection>

      <div className="flex items-center justify-end gap-3 py-4">
        <Link
          href="/dashboard/operadores/tipos"
          className="px-4 py-2 text-sm text-neutral-500 transition-colors hover:text-neutral-800"
        >
          Cancelar
        </Link>
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
