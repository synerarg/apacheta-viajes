import { NextResponse } from "next/server"

import { createServerQuoterPricesController } from "@/controllers/quoter-prices/quoter-prices.controller"
import { handleQuoterError } from "@/lib/quotes/errors"
import { upsertPrecioSchema } from "@/lib/quotes/schemas"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const serviceId = url.searchParams.get("servicio_id")
    const controller = await createServerQuoterPricesController()
    if (serviceId) {
      const precios = await controller.findByService(serviceId)
      return NextResponse.json({ precios }, { status: 200 })
    }
    const precios = await controller.list()
    return NextResponse.json({ precios }, { status: 200 })
  } catch (error) {
    return handleQuoterError(error)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = upsertPrecioSchema.parse(body)
    const controller = await createServerQuoterPricesController()
    const precio = await controller.create(payload as never)
    return NextResponse.json({ precio }, { status: 201 })
  } catch (error) {
    return handleQuoterError(error)
  }
}
