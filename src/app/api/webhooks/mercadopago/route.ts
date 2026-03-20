import { NextResponse } from "next/server"

import { createAdminPaymentsController } from "@/controllers/payments/payments.controller"
import {
  assertMercadoPagoWebhookSecretInProduction,
  validateMercadoPagoWebhookSignature,
} from "@/lib/mercadopago/webhook"

function resolvePaymentId(requestUrl: URL, body: unknown) {
  const paymentIdFromQuery =
    requestUrl.searchParams.get("data.id") ??
    requestUrl.searchParams.get("id")

  if (paymentIdFromQuery) {
    return paymentIdFromQuery
  }

  if (
    body &&
    typeof body === "object" &&
    "data" in body &&
    body.data &&
    typeof body.data === "object" &&
    "id" in body.data &&
    body.data.id
  ) {
    return String(body.data.id)
  }

  return null
}

export async function POST(request: Request) {
  assertMercadoPagoWebhookSecretInProduction()

  const requestUrl = new URL(request.url)
  const body = await request.json().catch(() => null)
  const paymentId = resolvePaymentId(requestUrl, body)

  if (!paymentId) {
    return NextResponse.json({ received: true }, { status: 200 })
  }

  try {
    const validation = validateMercadoPagoWebhookSignature({
      dataId: paymentId,
      signatureHeader: request.headers.get("x-signature"),
      requestIdHeader: request.headers.get("x-request-id"),
    })

    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: `Invalid Mercado Pago webhook signature: ${validation.reason}`,
        },
        { status: 401 },
      )
    }

    const paymentsController = createAdminPaymentsController()
    const result = await paymentsController.handleMercadoPagoWebhook(paymentId)

    return NextResponse.json(
      {
        received: true,
        result,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Webhook failed",
      },
      { status: 400 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok" }, { status: 200 })
}
