import { NextResponse } from "next/server"

import { createServerOperatorRequestsController } from "@/controllers/operator-requests/operator-requests.controller"
import { OperatorRequestsServiceException } from "@/exceptions/operator-requests/operator-requests.exceptions"
import type { OperatorRequestStatus } from "@/types/shared/enums"

const VALID_ESTADOS: ReadonlySet<OperatorRequestStatus> = new Set([
  "pendiente",
  "en_revision",
  "aprobada",
  "rechazada",
  "cancelada",
])

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const estadoParam = url.searchParams.get("estado")
    const controller = await createServerOperatorRequestsController()

    if (estadoParam && VALID_ESTADOS.has(estadoParam as OperatorRequestStatus)) {
      const solicitudes = await controller.list({ estado: estadoParam as OperatorRequestStatus })
      return NextResponse.json({ solicitudes }, { status: 200 })
    }

    const solicitudes = await controller.list()
    return NextResponse.json({ solicitudes }, { status: 200 })
  } catch (error) {
    if (error instanceof OperatorRequestsServiceException) {
      console.error("list solicitudes admin failed", error)
      return NextResponse.json({ error: "No se pudo listar solicitudes" }, { status: 500 })
    }
    console.error("list solicitudes admin unknown error", error)
    return NextResponse.json({ error: "Error desconocido" }, { status: 500 })
  }
}
