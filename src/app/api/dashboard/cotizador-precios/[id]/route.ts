import { NextResponse } from "next/server"

import { createServerQuoterPricesController } from "@/controllers/quoter-prices/quoter-prices.controller"
import { handleQuoterError } from "@/lib/quotes/errors"
import { upsertPrecioSchema } from "@/lib/quotes/schemas"

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const controller = await createServerQuoterPricesController()
    const precio = await controller.getById(id)
    return NextResponse.json({ precio }, { status: 200 })
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
    const payload = upsertPrecioSchema.partial().parse(body)
    const controller = await createServerQuoterPricesController()
    const precio = await controller.updateById(id, payload as never)
    return NextResponse.json({ precio }, { status: 200 })
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
    const controller = await createServerQuoterPricesController()
    await controller.deleteById(id)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    return handleQuoterError(error)
  }
}
