import { NextResponse } from "next/server"

import { createAdminHyperGuestController } from "@/controllers/hyperguest/hyperguest.controller"

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET?.trim()

  if (!cronSecret) {
    throw new Error("Missing environment variable: CRON_SECRET")
  }

  const authorization = request.headers.get("authorization")?.trim()
  const xCronSecret = request.headers.get("x-cron-secret")?.trim()

  return authorization === `Bearer ${cronSecret}` || xCronSecret === cronSecret
}

async function handleCronRequest(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    }

    const controller = createAdminHyperGuestController()
    const result = await controller.syncStaticData()

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("HyperGuest static sync failed", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo sincronizar la hoteleria.",
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
