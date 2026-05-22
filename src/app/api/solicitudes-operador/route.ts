import { NextResponse } from "next/server"
import { z } from "zod"

import { createServerOperatorRequestsController } from "@/controllers/operator-requests/operator-requests.controller"
import {
  OperatorRequestsServiceException,
  OperatorRequestsValidationException,
} from "@/exceptions/operator-requests/operator-requests.exceptions"
import { submitOperatorRequestSchema } from "@/lib/operator-requests/schemas"
import { sendOperatorRequestRecibida } from "@/services/notifications/solicitud-operador-email.service"
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
    const payload = submitOperatorRequestSchema.parse(body)
    const controller = await createServerOperatorRequestsController()
    const solicitud = await controller.submit(user.id, payload)

    sendOperatorRequestRecibida(solicitud, {
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

    const controller = await createServerOperatorRequestsController()
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
  if (error instanceof OperatorRequestsValidationException) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  if (error instanceof OperatorRequestsServiceException) {
    console.error("solicitudes-operador failed", error)
    return NextResponse.json({ error: "No se pudo procesar la solicitud" }, { status: 500 })
  }
  console.error("solicitudes-operador unknown error", error)
  return NextResponse.json({ error: "Error desconocido" }, { status: 500 })
}
