import { NextResponse } from "next/server"

import { createServerQuotesController } from "@/controllers/quotes/quotes.controller"
import {
  authorizeQuote,
  ensureEditable,
  isAuthFailure,
} from "@/lib/quotes/authorize"
import { handleQuoterError } from "@/lib/quotes/errors"
import { quoteHeaderSchema } from "@/lib/quotes/schemas"

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const auth = await authorizeQuote(id)
    if (isAuthFailure(auth)) return auth

    const controller = await createServerQuotesController()
    const cotizacion = await controller.getWithItems(id)
    return NextResponse.json({ cotizacion }, { status: 200 })
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
    const auth = await authorizeQuote(id)
    if (isAuthFailure(auth)) return auth

    const blocked = ensureEditable(auth.cotizacion)
    if (blocked) return blocked

    const body = await request.json()
    const payload = quoteHeaderSchema.parse(body)
    const controller = await createServerQuotesController()
    await controller.updateHeader(id, payload)
    const cotizacion = await controller.getWithItems(id)
    return NextResponse.json({ cotizacion }, { status: 200 })
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
    const auth = await authorizeQuote(id)
    if (isAuthFailure(auth)) return auth

    const controller = await createServerQuotesController()
    await controller.deleteById(id)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    return handleQuoterError(error)
  }
}
