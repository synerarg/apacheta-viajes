import { NextResponse } from "next/server"

import { createServerQuoterCategoriesController } from "@/controllers/quoter-categories/quoter-categories.controller"
import { handleQuoterError } from "@/lib/quotes/errors"
import { upsertCategoriaSchema } from "@/lib/quotes/schemas"

export async function GET() {
  try {
    const controller = await createServerQuoterCategoriesController()
    const categorias = await controller.list()
    return NextResponse.json({ categorias }, { status: 200 })
  } catch (error) {
    return handleQuoterError(error)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = upsertCategoriaSchema.parse(body)
    const controller = await createServerQuoterCategoriesController()
    const categoria = await controller.create(payload as never)
    return NextResponse.json({ categoria }, { status: 201 })
  } catch (error) {
    return handleQuoterError(error)
  }
}
