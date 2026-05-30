import { z } from "zod"

const optionalString = z
  .preprocess((value) => {
    if (typeof value !== "string") return value
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
  }, z.string().min(1).optional())

export const submitOperatorRequestSchema = z.object({
  nombre_comercial: z.string().trim().min(2).max(120),
  documento: optionalString,
  telefono_contacto: z.string().trim().min(6).max(40),
  email_contacto: z.string().trim().email(),
  sitio_web: z
    .preprocess((value) => {
      if (typeof value !== "string") return value
      const trimmed = value.trim()
      return trimmed.length > 0 ? trimmed : undefined
    }, z.string().url().optional()),
  redes_sociales: z
    .record(z.string(), z.string().trim().min(1))
    .optional()
    .nullable(),
  experiencia_descripcion: optionalString,
  zona_operacion: optionalString,
  motivacion: optionalString,
  documentacion_urls: z.array(z.string().url()).optional().nullable(),
})

export type SubmitOperatorRequestInput = z.infer<typeof submitOperatorRequestSchema>

export const rejectRequestSchema = z.object({
  motivo: z.string().trim().min(3).max(1000),
})

// El tipo de operador lo asigna exclusivamente el administrador al aprobar la
// solicitud; el operador ya no lo elige en el registro.
export const approveRequestSchema = z.object({
  tipo_operador_id: z.string().uuid("Tipo de operador inválido").optional(),
})
