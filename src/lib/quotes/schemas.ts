import { z } from "zod"

const optionalString = z.preprocess((value) => {
  if (typeof value !== "string") return value
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}, z.string().min(1).optional())

// Cabecera (cliente / fechas / impuesto). Todos los campos son opcionales:
// solo se actualizan las claves enviadas (partial update).
// El email se guarda como texto libre para que el operador pueda completarlo
// progresivamente sin que el server rechace estados intermedios.
export const quoteHeaderSchema = z
  .object({
    cliente_nombre: optionalString,
    cliente_email: optionalString,
    cliente_telefono: optionalString,
    fecha_inicio: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato fecha YYYY-MM-DD")
      .optional()
      .nullable(),
    fecha_fin: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato fecha YYYY-MM-DD")
      .optional()
      .nullable(),
    aplica_impuesto: z.boolean().optional(),
    impuesto_pct: z.number().min(0).max(100).optional(),
    notas_internas: optionalString,
  })
  .refine(
    (data) => {
      if (!data.fecha_inicio || !data.fecha_fin) return true
      return data.fecha_fin >= data.fecha_inicio
    },
    {
      message: "fecha_fin no puede ser anterior a fecha_inicio",
      path: ["fecha_fin"],
    },
  )

export type QuoteHeaderInput = z.infer<typeof quoteHeaderSchema>

// Item normal (referencia a servicio del catálogo)
export const addItemSchema = z.object({
  type: z.literal("service"),
  servicio_id: z.string().uuid(),
  dia_offset: z.number().int().min(0).max(365),
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato fecha YYYY-MM-DD")
    .optional()
    .nullable(),
  adultos: z.number().int().min(1).max(99).default(1),
  menores: z.number().int().min(0).max(99).default(0),
  comision_pct: z.number().min(0).max(100).optional(),
  precio_adulto_unit: z.number().min(0).optional(),
  precio_menor_unit: z.number().min(0).optional(),
  temporada: z.string().min(1).optional(),
})

// Item especial (Plus equipaje, Plus guía, etc.)
export const addSpecialItemSchema = z.object({
  type: z.literal("special"),
  nombre: z.string().trim().min(1).max(200),
  descripcion: optionalString,
  precio_unit: z.number().min(0).max(100_000_000),
  adultos: z.number().int().min(1).max(99).default(1),
  menores: z.number().int().min(0).max(99).default(0),
  dia_offset: z.number().int().min(0).max(365),
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato fecha YYYY-MM-DD")
    .optional()
    .nullable(),
})

export const addItemRequestSchema = z.discriminatedUnion("type", [
  addItemSchema,
  addSpecialItemSchema,
])

export type AddItemInput = z.infer<typeof addItemSchema>
export type AddSpecialItemInput = z.infer<typeof addSpecialItemSchema>
export type AddItemRequest = z.infer<typeof addItemRequestSchema>

// Update item (overrides puntuales)
export const updateItemSchema = z.object({
  adultos: z.number().int().min(0).max(99).optional(),
  menores: z.number().int().min(0).max(99).optional(),
  precio_adulto_unit: z.number().min(0).max(100_000_000).optional(),
  precio_menor_unit: z.number().min(0).max(100_000_000).optional(),
  comision_pct: z.number().min(0).max(100).optional(),
  dia_offset: z.number().int().min(0).max(365).optional(),
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato fecha YYYY-MM-DD")
    .optional()
    .nullable(),
  servicio_nombre: z.string().trim().min(1).max(200).optional(),
  servicio_descripcion: optionalString,
})

export type UpdateItemInput = z.infer<typeof updateItemSchema>

// ============ Schemas catálogo ============

export const upsertCategoriaSchema = z.object({
  nombre: z.string().trim().min(1).max(200),
  region: optionalString,
  tipo: optionalString,
  orden: z.number().int().min(0).optional(),
  activo: z.boolean().optional(),
})

export const upsertServicioSchema = z.object({
  categoria_id: z.string().uuid().nullable().optional(),
  nombre: z.string().trim().min(1).max(200),
  descripcion: optionalString,
  comision_pct: z.number().min(0).max(100).optional(),
  no_price: z.boolean().optional(),
  is_special: z.boolean().optional(),
  orden: z.number().int().min(0).optional(),
  activo: z.boolean().optional(),
})

export const upsertPrecioSchema = z.object({
  servicio_id: z.string().uuid(),
  temporada: z.string().trim().min(1).max(50),
  vigencia_desde: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable(),
  vigencia_hasta: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable(),
  precio_adulto: z.number().min(0),
  precio_menor: z.number().min(0).optional().nullable(),
  moneda: z.string().min(1).max(10).optional(),
  comision_pct_override: z.number().min(0).max(100).optional().nullable(),
  notas: optionalString,
})

export type UpsertCategoryInput = z.infer<typeof upsertCategoriaSchema>
export type UpsertServiceInput = z.infer<typeof upsertServicioSchema>
export type UpsertPriceInput = z.infer<typeof upsertPrecioSchema>
