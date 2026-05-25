"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import type { HyperGuestReservationSummary } from "@/types/hyperguest/hyperguest.types"

interface HotelReservationsListProps {
  reservations: HyperGuestReservationSummary[]
}

function formatDate(value: string | null) {
  if (!value) return "-"
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value))
}

function formatTotal(amount: number | null, currency: string | null) {
  if (amount === null) return "-"
  const safeCurrency = currency?.trim() || "USD"
  return `${safeCurrency} ${amount.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function resolveStatusLabel(status: HyperGuestReservationSummary["status"]) {
  switch (status) {
    case "booked":
      return "Confirmada"
    case "cancel_started":
      return "Cancelando…"
    case "cancelled":
      return "Cancelada"
    default:
      return status
  }
}

function resolveStatusTone(status: HyperGuestReservationSummary["status"]) {
  switch (status) {
    case "booked":
      return "text-emerald-700"
    case "cancelled":
      return "text-subtle"
    default:
      return "text-amber-700"
  }
}

export function HotelReservationsList({
  reservations,
}: HotelReservationsListProps) {
  const router = useRouter()
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{
    bookingIntentId: string
    type: "success" | "error"
    message: string
  } | null>(null)

  async function handleCancel(reservation: HyperGuestReservationSummary) {
    if (pendingId) return
    const confirmed = window.confirm(
      `¿Cancelar la reserva en ${reservation.hotelName}? Esta acción no se puede deshacer.`,
    )
    if (!confirmed) return

    setPendingId(reservation.bookingIntentId)
    setFeedback(null)

    try {
      const response = await fetch("/api/hoteleria/hyperguest/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingIntentId: reservation.bookingIntentId,
          reason: "Cancelación solicitada desde Mis Reservas.",
        }),
      })

      const payload = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(payload.error ?? "No se pudo cancelar la reserva.")
      }

      setFeedback({
        bookingIntentId: reservation.bookingIntentId,
        type: "success",
        message: "Reserva cancelada correctamente.",
      })
      router.refresh()
    } catch (error) {
      setFeedback({
        bookingIntentId: reservation.bookingIntentId,
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo cancelar la reserva.",
      })
    } finally {
      setPendingId(null)
    }
  }

  if (reservations.length === 0) {
    return null
  }

  return (
    <section className="mb-12 text-left">
      <h2 className="mb-2 text-center font-serif text-3xl italic text-dark-brown md:text-4xl">
        Reservas de hotel
      </h2>
      <p className="mb-8 text-center font-sans text-sm text-subtle">
        Reservas hechas a través de nuestro motor de hotelería.
      </p>
      <div className="flex flex-col gap-4">
        {reservations.map((reservation) => {
          const isPending = pendingId === reservation.bookingIntentId
          const reservationFeedback =
            feedback?.bookingIntentId === reservation.bookingIntentId
              ? feedback
              : null

          return (
            <article
              key={reservation.bookingIntentId}
              className="border border-dark-brown/15 bg-white p-6"
            >
              <div className="mb-4 flex flex-col gap-3 border-b border-dark-brown/10 pb-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-sans text-xs uppercase tracking-[0.16em] text-primary">
                    {reservation.providerBookingId
                      ? `HG #${reservation.providerBookingId}`
                      : "Reserva pendiente"}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl text-dark-brown">
                    {reservation.hotelSlug ? (
                      <Link
                        href={`/hoteleria/${reservation.hotelSlug}`}
                        className="hover:text-primary"
                      >
                        {reservation.hotelName}
                      </Link>
                    ) : (
                      reservation.hotelName
                    )}
                  </h3>
                  {reservation.hotelLocation ? (
                    <p className="mt-1 font-sans text-sm text-subtle">
                      {reservation.hotelLocation}
                    </p>
                  ) : null}
                </div>
                <p
                  className={`font-sans text-sm font-bold ${resolveStatusTone(
                    reservation.status,
                  )}`}
                >
                  {resolveStatusLabel(reservation.status)}
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-4 font-sans text-sm text-dark-brown sm:grid-cols-4">
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.12em] text-subtle">
                    Check-in
                  </dt>
                  <dd className="font-medium">
                    {formatDate(reservation.checkIn)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.12em] text-subtle">
                    Check-out
                  </dt>
                  <dd className="font-medium">
                    {formatDate(reservation.checkOut)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.12em] text-subtle">
                    Huéspedes
                  </dt>
                  <dd className="font-medium">
                    {(reservation.adults ?? 0) + (reservation.children ?? 0)}{" "}
                    pax · {reservation.rooms ?? 1} hab.
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.12em] text-subtle">
                    Total
                  </dt>
                  <dd className="font-medium text-primary">
                    {formatTotal(reservation.totalAmount, reservation.currency)}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-sans text-xs text-subtle">
                  Creada el {formatDate(reservation.createdAt)}
                  {reservation.providerReference ? (
                    <>
                      {" "}· Ref. <span className="font-medium text-dark-brown">{reservation.providerReference}</span>
                    </>
                  ) : null}
                </p>
                {reservation.canCancel ? (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleCancel(reservation)}
                    className="inline-flex justify-center border border-primary px-5 py-2 font-sans text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-off-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPending ? "Cancelando…" : "Cancelar reserva"}
                  </button>
                ) : null}
              </div>

              {reservationFeedback ? (
                <p
                  className={`mt-3 font-sans text-sm ${
                    reservationFeedback.type === "success"
                      ? "text-emerald-700"
                      : "font-bold text-primary"
                  }`}
                >
                  {reservationFeedback.message}
                </p>
              ) : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}
