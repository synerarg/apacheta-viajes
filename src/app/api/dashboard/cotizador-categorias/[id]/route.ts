import { NextResponse } from "next/server"

import { createServerQuoterCategoriesController } from "@/controllers/quoter-categories/quoter-categories.controller"
import { handleQuoterError } from "@/lib/quotes/errors"
import { upsertCategoriaSchema } from "@/lib/quotes/schemas"

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const controller = await createServerQuoterCategoriesController()
    const categoria = await controller.getById(id)
    return NextResponse.json({ categoria }, { status: 200 })
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
    const payload = upsertCategoriaSchema.partial().parse(body)
    const controller = await createServerQuoterCategoriesController()
    const categoria = await controller.updateById(id, payload as never)
    return NextResponse.json({ categoria }, { status: 200 })
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
    const controller = await createServerQuoterCategoriesController()
    await controller.deleteById(id)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    return handleQuoterError(error)
  }
}
