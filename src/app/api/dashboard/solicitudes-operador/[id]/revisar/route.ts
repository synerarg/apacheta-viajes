import { NextResponse } from "next/server"

import { createServerOperatorRequestsController } from "@/controllers/operator-requests/operator-requests.controller"
import {
  OperatorRequestsNotFoundException,
  OperatorRequestsServiceException,
  OperatorRequestsValidationException,
} from "@/exceptions/operator-requests/operator-requests.exceptions"
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

    const controller = await createServerOperatorRequestsController()
    const solicitud = await controller.markInReview(id, user.id)

    return NextResponse.json({ solicitud }, { status: 200 })
  } catch (error) {
    if (error instanceof OperatorRequestsNotFoundException) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    if (error instanceof OperatorRequestsValidationException) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    if (error instanceof OperatorRequestsServiceException) {
      console.error("revisar solicitud failed", error)
      return NextResponse.json({ error: "No se pudo marcar en revisión" }, { status: 500 })
    }
    console.error("revisar solicitud unknown error", error)
    return NextResponse.json({ error: "Error desconocido" }, { status: 500 })
  }
}
