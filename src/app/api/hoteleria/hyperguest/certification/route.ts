import { NextResponse } from "next/server"
import { z } from "zod"

import { createAdminHyperGuestController } from "@/controllers/hyperguest/hyperguest.controller"
import { getHyperGuestConfig } from "@/lib/hyperguest/hyperguest.config"

const certificationSchema = z.object({
  action: z.enum(["sync-static", "booking-list"]),
  query: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
})

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET?.trim()

  if (!cronSecret) {
    throw new Error("Missing environment variable: CRON_SECRET")
  }

  const authorization = request.headers.get("authorization")?.trim()
  const xCronSecret = request.headers.get("x-cron-secret")?.trim()

  return authorization === `Bearer ${cronSecret}` || xCronSecret === cronSecret
}

function getCertificationReadiness() {
  const config = getHyperGuestConfig()

  return {
    propertyId: config.propertyId,
    isConfigured: Boolean(config.authToken && config.propertyId),
    staticSyncPath: "/api/cron/hyperguest/static-sync",
    availabilityPath: "/api/hoteleria/hyperguest/search",
    prebookPath: "/api/hoteleria/hyperguest/prebook",
    bookingPath: "/api/hoteleria/hyperguest/book",
    cancellationPath: "/api/hoteleria/hyperguest/cancel",
    providerEndpoints: {
      staticDataUrl: config.staticDataUrl,
      searchApiBaseUrl: config.searchApiBaseUrl,
      bookApiBaseUrl: config.bookApiBaseUrl,
      searchAvailabilityPath: config.searchAvailabilityPath,
      prebookPath: config.prebookPath,
      bookingPath: config.bookingPath,
      bookingListPath: config.bookingListPath,
      cancelPath: config.cancelPath,
    },
    certificationScenarios: [
      "Pre-book de 1 habitacion y 1 adulto antes de reservar.",
      "Reserva de 1 habitacion y 1 adulto.",
      "Reserva de 1 habitacion con 2 adultos, 1 menor y 1 infante.",
      "Reserva multihabitacion con 2 adultos y 1 adulto.",
      "Reserva multihabitacion con menores e infantes.",
      "Reserva multihabitacion con diferentes tipos de habitacion y tarifas.",
      "Reserva same-day de 1 habitacion con 2 adultos.",
      "Reserva con conversion de moneda.",
      "Reserva con nacionalidad especifica.",
      "Cancelacion de reserva reembolsable.",
      "Intento de cancelacion de reserva no reembolsable.",
    ],
  }
}

export async function GET(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    }

    return NextResponse.json(getCertificationReadiness(), { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo obtener el estado de certificacion.",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    }

    const body = await request.json()
    const payload = certificationSchema.parse(body)
    const controller = createAdminHyperGuestController()
    const result =
      payload.action === "sync-static"
        ? await controller.syncStaticData()
        : await controller.listProviderBookings(payload.query)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("HyperGuest certification action failed", error)

    return NextResponse.json(
      {
        error:
          error instanceof z.ZodError
            ? "La accion de certificacion no es valida."
            : error instanceof Error
              ? error.message
              : "No se pudo ejecutar la accion de certificacion.",
      },
      { status: error instanceof z.ZodError ? 400 : 500 },
    )
  }
}
