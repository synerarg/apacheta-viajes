import { NextResponse } from "next/server"

import { createServerQuoterServicesController } from "@/controllers/quoter-services/quoter-services.controller"
import { handleQuoterError } from "@/lib/quotes/errors"
import { upsertServicioSchema } from "@/lib/quotes/schemas"

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const controller = await createServerQuoterServicesController()
    const servicio = await controller.getById(id)
    return NextResponse.json({ servicio }, { status: 200 })
  } catch (error) {
    return handleQuoterError(error)
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const payload = upsertServicioSchema.partial().parse(body)
    const controller = await createServerQuoterServicesController()
    const servicio = await controller.updateById(id, payload as never)
    return NextResponse.json({ servicio }, { status: 200 })
  } catch (error) {
    return handleQuoterError(error)
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const controller = await createServerQuoterServicesController()
    await controller.deleteById(id)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    return handleQuoterError(error)
  }
}
