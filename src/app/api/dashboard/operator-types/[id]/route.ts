import { NextResponse } from "next/server"
import { z } from "zod"

import { createServerOperatorTypesController } from "@/controllers/operator-types/operator-types.controller"
import {
  OperatorTypesNotFoundException,
  OperatorTypesServiceException,
  OperatorTypesValidationException,
} from "@/exceptions/operator-types/operator-types.exceptions"
import { upsertOperatorTypeSchema } from "@/lib/operator-types/schemas"

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const controller = await createServerOperatorTypesController()
    const tipo = await controller.getById(id)
    return NextResponse.json({ tipo }, { status: 200 })
  } catch (error) {
    return handleError(error)
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const payload = upsertOperatorTypeSchema.partial().parse(body)
    const controller = await createServerOperatorTypesController()
    const tipo = await controller.updateById(id, payload as never)
    return NextResponse.json({ tipo }, { status: 200 })
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const controller = await createServerOperatorTypesController()
    await controller.deleteById(id)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    return handleError(error)
  }
}

function handleError(error: unknown) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: "Datos inválidos", details: error.issues },
      { status: 400 },
    )
  }
  if (error instanceof OperatorTypesValidationException) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  if (error instanceof OperatorTypesNotFoundException) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }
  if (error instanceof OperatorTypesServiceException) {
    console.error("operator-types failed", error)
    return NextResponse.json(
      { error: "No se pudo procesar el tipo de operador" },
      { status: 500 },
    )
  }
  console.error("operator-types unknown error", error)
  return NextResponse.json({ error: "Error desconocido" }, { status: 500 })
}
