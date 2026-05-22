import { z } from "zod"

const optionalString = z.preprocess((value) => {
  if (typeof value !== "string") return value
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}, z.string().min(1).optional())

export const upsertOperatorTypeSchema = z.object({
  nombre: z.string().trim().min(2).max(120),
  comision_pct: z.coerce
    .number({ message: "La comisión debe ser un número" })
    .min(0, "La comisión no puede ser negativa")
    .max(100, "La comisión no puede superar 100%"),
  descripcion: optionalString.nullable().optional(),
  activo: z.boolean().optional(),
  orden: z.coerce.number().int().min(0).optional(),
})

export type UpsertOperatorTypeInput = z.infer<typeof upsertOperatorTypeSchema>
