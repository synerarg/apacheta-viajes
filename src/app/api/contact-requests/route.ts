import { NextResponse } from "next/server"
import { z } from "zod"

import { adminClient } from "@/lib/supabase/admin-client"
import { createClient } from "@/lib/supabase/server"
import { createSolicitudesContactoRepository } from "@/repositories/solicitudes-contacto/solicitudes-contacto.repository"
import { createSolicitudesContactoService } from "@/services/solicitudes-contacto/solicitudes-contacto.service"
import type { DatabaseClient } from "@/types/database/database.types"

const contactRequestSchema = z.object({
  nombreCompleto: z.string().min(1),
  correoElectronico: z.string().email().optional(),
  tipoViaje: z.string().min(1).optional(),
  presupuestoEstimado: z.string().min(1).optional(),
  fechasEstimadas: z.string().min(1).optional(),
  numeroPasajeros: z.number().int().positive().optional(),
  mensaje: z.string().optional(),
  metadata: z
    .object({
      source: z.enum(["landing", "para-agencias", "contacto"]),
      agencyName: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
})

function buildMessage(input: z.infer<typeof contactRequestSchema>) {
  return [
    input.mensaje?.trim(),
    input.metadata?.agencyName
      ? `Agencia / Empresa: ${input.metadata.agencyName.trim()}`
      : null,
    input.metadata?.phone
      ? `Teléfono de contacto: ${input.metadata.phone.trim()}`
      : null,
    input.metadata?.source ? `Origen web: ${input.metadata.source}` : null,
  ]
    .filter(Boolean)
    .join("\n\n")
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = contactRequestSchema.parse(body)
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const resolvedEmail = payload.correoElectronico ?? user?.email ?? null

    if (!resolvedEmail) {
      return NextResponse.json(
        {
          error: "Se necesita un email de contacto para enviar la solicitud.",
        },
        { status: 400 },
      )
    }

    const solicitudesContactoService = createSolicitudesContactoService(
      createSolicitudesContactoRepository(adminClient as DatabaseClient),
    )
    const solicitud = await solicitudesContactoService.create({
      nombre_completo: payload.nombreCompleto,
      correo_electronico: resolvedEmail,
      tipo_viaje: payload.tipoViaje ?? null,
      presupuesto_estimado: payload.presupuestoEstimado ?? null,
      fechas_estimadas: payload.fechasEstimadas ?? null,
      numero_pasajeros: payload.numeroPasajeros ?? null,
      mensaje: buildMessage(payload) || null,
      estado: "nuevo",
    })

    return NextResponse.json(
      {
        id: solicitud.id,
        message: "Solicitud creada correctamente.",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof z.ZodError
            ? "Datos inválidos."
            : error instanceof Error
              ? error.message
              : "No se pudo crear la solicitud.",
      },
      { status: 400 },
    )
  }
}
