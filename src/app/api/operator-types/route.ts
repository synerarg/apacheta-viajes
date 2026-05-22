import { NextResponse } from "next/server"

import { createServerOperatorTypesController } from "@/controllers/operator-types/operator-types.controller"

// Endpoint público (solo activos) — usado por el formulario de solicitud de operador.
export async function GET() {
  try {
    const controller = await createServerOperatorTypesController()
    const tipos = await controller.listActiveOrdered()
    return NextResponse.json({ tipos }, { status: 200 })
  } catch (error) {
    console.error("public operator-types failed", error)
    return NextResponse.json(
      { error: "No se pudieron cargar los tipos de operador" },
      { status: 500 },
    )
  }
}
