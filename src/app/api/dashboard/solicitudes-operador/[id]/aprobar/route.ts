import { NextResponse } from "next/server"
import { z } from "zod"

import { createServerOperatorRequestsController } from "@/controllers/operator-requests/operator-requests.controller"
import {
  OperatorRequestsNotFoundException,
  OperatorRequestsServiceException,
  OperatorRequestsValidationException,
} from "@/exceptions/operator-requests/operator-requests.exceptions"
import { approveRequestSchema } from "@/lib/operator-requests/schemas"
import { sendOperatorRequestAprobada } from "@/services/notifications/solicitud-operador-email.service"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { tipo_operador_id } = approveRequestSchema.parse(body)

    const controller = await createServerOperatorRequestsController()
    const solicitud = await controller.approve(id, user.id, tipo_operador_id)

    sendOperatorRequestAprobada(solicitud, {
      email: solicitud.email_contacto,
      greetingName: solicitud.nombre_comercial,
    }).catch((err) => console.error("send solicitud aprobada email failed", err))

    return NextResponse.json({ solicitud }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.issues },
        { status: 400 },
      )
    }
    if (error instanceof OperatorRequestsNotFoundException) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    if (error instanceof OperatorRequestsValidationException) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    if (error instanceof OperatorRequestsServiceException) {
      console.error("approve solicitud failed", error)
      return NextResponse.json({ error: "No se pudo aprobar la solicitud" }, { status: 500 })
    }
    console.error("approve solicitud unknown error", error)
    return NextResponse.json({ error: "Error desconocido" }, { status: 500 })
  }
}
