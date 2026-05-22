import { NextResponse } from "next/server"

import { createServerQuotesController } from "@/controllers/quotes/quotes.controller"
import {
  authorizeQuote,
  isAuthFailure,
} from "@/lib/quotes/authorize"
import { handleQuoterError } from "@/lib/quotes/errors"

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const auth = await authorizeQuote(id)
    if (isAuthFailure(auth)) return auth

    const controller = await createServerQuotesController()
    const cotizacion = await controller.markAsSent(id)
    return NextResponse.json({ cotizacion }, { status: 200 })
  } catch (error) {
    return handleQuoterError(error)
  }
}
