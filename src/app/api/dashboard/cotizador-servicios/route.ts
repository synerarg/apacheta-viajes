import { NextResponse } from "next/server"

import { createServerQuoterServicesController } from "@/controllers/quoter-services/quoter-services.controller"
import { handleQuoterError } from "@/lib/quotes/errors"
import { upsertServicioSchema } from "@/lib/quotes/schemas"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const categoryId = url.searchParams.get("categoria_id")
    const controller = await createServerQuoterServicesController()

    if (categoryId) {
      const servicios = await controller.findActiveByCategory(categoryId)
      return NextResponse.json({ servicios }, { status: 200 })
    }
    const servicios = await controller.list()
    return NextResponse.json({ servicios }, { status: 200 })
  } catch (error) {
    return handleQuoterError(error)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = upsertServicioSchema.parse(body)
    const controller = await createServerQuoterServicesController()
    const servicio = await controller.create(payload as never)
    return NextResponse.json({ servicio }, { status: 201 })
  } catch (error) {
    return handleQuoterError(error)
  }
}
