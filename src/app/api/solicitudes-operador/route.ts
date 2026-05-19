import { NextResponse } from "next/server"
import { z } from "zod"

import { createServerSolicitudesOperadorController } from "@/controllers/solicitudes-operador/solicitudes-operador.controller"
import {
  SolicitudesOperadorServiceException,
  SolicitudesOperadorValidationException,
} from "@/exceptions/solicitudes-operador/solicitudes-operador.exceptions"
import { submitSolicitudOperadorSchema } from "@/lib/solicitudes-operador/schemas"
import { sendSolicitudOperadorRecibida } from "@/services/notifications/solicitud-operador-email.service"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const payload = submitSolicitudOperadorSchema.parse(body)
    const controller = await createServerSolicitudesOperadorController()
    const solicitud = await controller.submit(user.id, payload)

    sendSolicitudOperadorRecibida(solicitud, {
      email: solicitud.email_contacto,
      greetingName: solicitud.nombre_comercial,
    }).catch((err) => console.error("send solicitud recibida email failed", err))

    return NextResponse.json({ solicitud }, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const controller = await createServerSolicitudesOperadorController()
    const solicitudes = await controller.listMine(user.id)

    return NextResponse.json({ solicitudes }, { status: 200 })
  } catch (error) {
    return handleError(error)
  }
}

function handleError(error: unknown) {
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: "Datos inválidos", details: error.issues }, { status: 400 })
  }
  if (error instanceof SolicitudesOperadorValidationException) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  if (error instanceof SolicitudesOperadorServiceException) {
    console.error("solicitudes-operador failed", error)
    return NextResponse.json({ error: "No se pudo procesar la solicitud" }, { status: 500 })
  }
  console.error("solicitudes-operador unknown error", error)
  return NextResponse.json({ error: "Error desconocido" }, { status: 500 })
}
