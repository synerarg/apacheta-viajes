import { NextResponse } from "next/server"

import { createServerSolicitudesOperadorController } from "@/controllers/solicitudes-operador/solicitudes-operador.controller"
import {
  SolicitudesOperadorNotFoundException,
  SolicitudesOperadorServiceException,
  SolicitudesOperadorValidationException,
} from "@/exceptions/solicitudes-operador/solicitudes-operador.exceptions"
import { sendSolicitudOperadorAprobada } from "@/services/notifications/solicitud-operador-email.service"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(
  _request: Request,
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

    const controller = await createServerSolicitudesOperadorController()
    const solicitud = await controller.approve(id, user.id)

    sendSolicitudOperadorAprobada(solicitud, {
      email: solicitud.email_contacto,
      greetingName: solicitud.nombre_comercial,
    }).catch((err) => console.error("send solicitud aprobada email failed", err))

    return NextResponse.json({ solicitud }, { status: 200 })
  } catch (error) {
    if (error instanceof SolicitudesOperadorNotFoundException) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    if (error instanceof SolicitudesOperadorValidationException) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    if (error instanceof SolicitudesOperadorServiceException) {
      console.error("approve solicitud failed", error)
      return NextResponse.json({ error: "No se pudo aprobar la solicitud" }, { status: 500 })
    }
    console.error("approve solicitud unknown error", error)
    return NextResponse.json({ error: "Error desconocido" }, { status: 500 })
  }
}
