import { NextResponse } from "next/server"

import { createAdminPaymentsController } from "@/controllers/payments/payments.controller"

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET?.trim()

  if (!cronSecret) {
    throw new Error("Missing environment variable: CRON_SECRET")
  }

  const authorization = request.headers.get("authorization")?.trim()
  const xCronSecret = request.headers.get("x-cron-secret")?.trim()

  return (
    authorization === `Bearer ${cronSecret}` || xCronSecret === cronSecret
  )
}

async function handleCronRequest(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const paymentsController = createAdminPaymentsController()
    const result = await paymentsController.expireOpenBankTransfers()

    return NextResponse.json(
      {
        processedAt: result.processedAt,
        expiredCount: result.expiredPayments.length,
        expiredPayments: result.expiredPayments,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Bank transfer expiration cron failed",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  return handleCronRequest(request)
}

export async function POST(request: Request) {
  return handleCronRequest(request)
}
