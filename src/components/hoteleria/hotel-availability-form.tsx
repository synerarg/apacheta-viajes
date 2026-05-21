"use client"

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react"

import {
  extractOfferDetails,
  type OfferDetails,
} from "@/lib/hyperguest/offer-display"

interface HotelAvailabilityFormProps {
  hotelId: string
}

interface RoomOccupancy {
  adults: number
  childrenAges: number[]
  infants: number
}

interface AvailabilityOffer {
  id: string | null
  roomId: string | null
  rateId: string | null
  roomName: string
  boardName: string | null
  currency: string | null
  totalAmount: number | null
  raw: Record<string, unknown>
}

interface AvailabilityResult {
  bookingIntent: { id: string }
  offers: AvailabilityOffer[]
}

interface PrebookResult {
  bookingIntent: { id: string }
}

interface BookResult {
  bookingIntent: {
    id: string
    provider_booking_id: string | null
    provider_reference: string | null
  }
}

interface CancelResult {
  bookingIntent: { id: string }
}

const EMPTY_ROOM: RoomOccupancy = { adults: 1, childrenAges: [], infants: 0 }

function formatLocalDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getDefaultDate(offsetDays: number) {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  return formatLocalDate(date)
}

function getTodayDate() {
  return formatLocalDate(new Date())
}

function isDateInPast(value: string) {
  return value < getTodayDate()
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T & { error?: string }

  if (!response.ok) {
    throw new Error(payload.error ?? "No se pudo completar la operacion.")
  }

  return payload
}

function offerKey(offer: AvailabilityOffer, index: number) {
  return offer.id ?? `offer-${index}`
}

export function HotelAvailabilityForm({ hotelId }: HotelAvailabilityFormProps) {
  const [checkIn, setCheckIn] = useState(getDefaultDate(14))
  const [checkOut, setCheckOut] = useState(getDefaultDate(15))
  const [occupancy, setOccupancy] = useState<RoomOccupancy[]>([
    { ...EMPTY_ROOM },
  ])
  const [nationality, setNationality] = useState("AR")
  const [currency, setCurrency] = useState("ARS")
  const [availability, setAvailability] = useState<AvailabilityResult | null>(
    null,
  )
  const [selectedOfferIds, setSelectedOfferIds] = useState<string[]>([])
  const [hasPrebooked, setHasPrebooked] = useState(false)
  const [bookResult, setBookResult] = useState<BookResult | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [guestFirstName, setGuestFirstName] = useState("")
  const [guestLastName, setGuestLastName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [guestAddress, setGuestAddress] = useState("")
  const [guestCity, setGuestCity] = useState("")
  const [guestState, setGuestState] = useState("")
  const [guestZip, setGuestZip] = useState("")
  const [guestCountry, setGuestCountry] = useState("AR")
  const [guestBirthDate, setGuestBirthDate] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [cardNumber, setCardNumber] = useState("4111111111111111")
  const [cardCvv, setCardCvv] = useState("123")
  const [cardExpiryMonth, setCardExpiryMonth] = useState("1")
  const [cardExpiryYear, setCardExpiryYear] = useState("2028")

  const abortRef = useRef<AbortController | null>(null)
  const hasMountedRef = useRef(false)

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }

    abortRef.current?.abort()
    abortRef.current = null

    setAvailability((prev) => (prev ? null : prev))
    setSelectedOfferIds((prev) => (prev.length > 0 ? [] : prev))
    setHasPrebooked((prev) => (prev ? false : prev))
    setBookResult((prev) => (prev ? null : prev))
    setStatusMessage(
      "Los criterios cambiaron. Volvé a consultar disponibilidad.",
    )
    setErrorMessage(null)
  }, [checkIn, checkOut, nationality, currency, occupancy, hotelId])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const offers = useMemo(
    () => availability?.offers ?? [],
    [availability],
  )
  const offersById = useMemo(() => {
    const map = new Map<string, AvailabilityOffer>()
    offers.forEach((offer, index) => {
      map.set(offerKey(offer, index), offer)
    })
    return map
  }, [offers])
  const offerDetailsById = useMemo(() => {
    const map = new Map<string, OfferDetails>()
    offers.forEach((offer, index) => {
      map.set(offerKey(offer, index), extractOfferDetails(offer.raw))
    })
    return map
  }, [offers])
  const propertyRemarks = useMemo(() => {
    const first = offers[0]
    if (!first) return []
    return extractOfferDetails(first.raw).propertyRemarks
  }, [offers])

  function resetAfterSearch() {
    setHasPrebooked(false)
    setBookResult(null)
  }

  function updateRoom(index: number, patch: Partial<RoomOccupancy>) {
    setOccupancy((current) =>
      current.map((room, i) => (i === index ? { ...room, ...patch } : room)),
    )
  }

  function setRoomChildrenCount(index: number, count: number) {
    setOccupancy((current) =>
      current.map((room, i) => {
        if (i !== index) return room

        const safeCount = Math.max(0, Math.floor(count))
        const ages = room.childrenAges.slice(0, safeCount)

        while (ages.length < safeCount) {
          ages.push(7)
        }

        return { ...room, childrenAges: ages }
      }),
    )
  }

  function setRoomChildAge(roomIndex: number, childIndex: number, age: number) {
    setOccupancy((current) =>
      current.map((room, i) => {
        if (i !== roomIndex) return room

        const ages = [...room.childrenAges]
        ages[childIndex] = Math.max(0, Math.min(17, Math.floor(age)))

        return { ...room, childrenAges: ages }
      }),
    )
  }

  function addRoom() {
    setOccupancy((current) => [...current, { ...EMPTY_ROOM }])
  }

  function removeRoom(index: number) {
    setOccupancy((current) =>
      current.length > 1 ? current.filter((_, i) => i !== index) : current,
    )
    setSelectedOfferIds((current) => current.filter((_, i) => i !== index))
  }

  function toggleSelectedOffer(roomIndex: number, key: string) {
    setSelectedOfferIds((current) => {
      const next = [...current]
      next[roomIndex] = key
      return next
    })
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!checkIn || !checkOut) {
      setErrorMessage("Indicá fechas de check-in y check-out.")
      return
    }

    if (isDateInPast(checkIn)) {
      setErrorMessage("La fecha de check-in no puede ser anterior a hoy.")
      return
    }

    if (checkOut <= checkIn) {
      setErrorMessage("El check-out debe ser posterior al check-in.")
      return
    }

    const invalidRoom = occupancy.findIndex(
      (room) => room.adults < 1 || room.childrenAges.some((age) => age < 0 || age > 17),
    )
    if (invalidRoom !== -1) {
      setErrorMessage(
        `Revisá los datos de la habitación ${invalidRoom + 1} (mínimo 1 adulto, edades 0-17).`,
      )
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsLoading(true)
    setErrorMessage(null)
    setStatusMessage(null)
    resetAfterSearch()

    try {
      const response = await fetch("/api/hoteleria/hyperguest/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          hotelId,
          checkIn,
          checkOut,
          rooms: occupancy.length,
          adults: occupancy[0]?.adults ?? 1,
          children: occupancy[0]?.childrenAges.length ?? 0,
          infants: occupancy[0]?.infants ?? 0,
          occupancy,
          nationality,
          currency,
        }),
      })
      const payload = await readJsonResponse<AvailabilityResult>(response)

      if (controller.signal.aborted) return

      setAvailability(payload)
      setSelectedOfferIds(
        Array.from({ length: occupancy.length }, () =>
          payload.offers[0] ? offerKey(payload.offers[0], 0) : "",
        ),
      )
      setStatusMessage(
        payload.offers.length > 0
          ? `Encontramos ${payload.offers.length} tarifa(s).`
          : "No encontramos tarifas para esa configuración.",
      )
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      if (controller.signal.aborted) return
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo consultar la disponibilidad.",
      )
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null
        setIsLoading(false)
      }
    }
  }

  function getSelectedOffers() {
    return selectedOfferIds
      .map((key) => (key ? offersById.get(key) : null))
      .filter((offer): offer is AvailabilityOffer => Boolean(offer))
  }

  async function handlePrebook() {
    if (!availability) return
    if (isLoading) return

    const selected = getSelectedOffers()

    if (selected.length < occupancy.length) {
      setErrorMessage(
        "Seleccioná una tarifa para cada habitación antes de continuar.",
      )
      return
    }

    setIsLoading(true)
    setErrorMessage(null)
    setStatusMessage(null)

    try {
      const response = await fetch("/api/hoteleria/hyperguest/prebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingIntentId: availability.bookingIntent.id,
          selectedOffers: selected.map((offer) => offer.raw),
        }),
      })

      await readJsonResponse<PrebookResult>(response)
      setHasPrebooked(true)
      setStatusMessage(
        "Pre-reserva confirmada. Completa los datos del huesped y reserva.",
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo iniciar la pre-reserva.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function handleBook() {
    if (!availability) return
    if (isLoading) return

    const missingField = (
      [
        ["nombre", guestFirstName],
        ["apellido", guestLastName],
        ["email", guestEmail],
        ["teléfono", guestPhone],
        ["dirección", guestAddress],
        ["ciudad", guestCity],
        ["país", guestCountry],
      ] as const
    ).find(([, value]) => value.trim().length === 0)

    if (missingField) {
      setErrorMessage(`Completá el campo "${missingField[0]}" del huésped.`)
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(guestEmail)) {
      setErrorMessage("Ingresá un email válido.")
      return
    }

    const selectedForBook = getSelectedOffers()

    if (selectedForBook.length < occupancy.length) {
      setErrorMessage(
        "Volvé a seleccionar una tarifa para cada habitación.",
      )
      return
    }

    setIsLoading(true)
    setErrorMessage(null)
    setStatusMessage(null)

    try {
      // HG invalidates the prebook session after a short TTL (BN.502 on /book
      // when the guest spends too long on the guest/card form). Re-run prebook
      // right before booking so the session is fresh.
      const refreshResponse = await fetch(
        "/api/hoteleria/hyperguest/prebook",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingIntentId: availability.bookingIntent.id,
            selectedOffers: selectedForBook.map((offer) => offer.raw),
          }),
        },
      )

      await readJsonResponse<PrebookResult>(refreshResponse)

      const trimmedRequests = specialRequests
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0)

      const normalizedCardNumber = cardNumber.replace(/\s+/g, "")
      const paymentDetails = normalizedCardNumber
        ? {
            type: "credit_card" as const,
            details: {
              number: normalizedCardNumber,
              cvv: cardCvv.trim(),
              expiry: {
                month: cardExpiryMonth.trim(),
                year: cardExpiryYear.trim(),
              },
            },
          }
        : undefined

      const response = await fetch("/api/hoteleria/hyperguest/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingIntentId: availability.bookingIntent.id,
          guest: {
            firstName: guestFirstName,
            lastName: guestLastName,
            title: "MR",
            birthDate: guestBirthDate || null,
            email: guestEmail,
            phone: guestPhone,
            contact: {
              address: guestAddress,
              city: guestCity,
              country: guestCountry.toUpperCase(),
              email: guestEmail,
              phone: guestPhone,
              state: guestState,
              zip: guestZip,
            },
          },
          specialRequests:
            trimmedRequests.length > 0 ? trimmedRequests : undefined,
          paymentDetails,
        }),
      })

      const payload = await readJsonResponse<BookResult>(response)
      setBookResult(payload)
      setStatusMessage(
        payload.bookingIntent.provider_booking_id
          ? `Reserva confirmada (HG #${payload.bookingIntent.provider_booking_id}).`
          : "Reserva enviada. Esperando confirmacion del proveedor.",
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo confirmar la reserva.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCancel() {
    if (!availability) return

    setIsLoading(true)
    setErrorMessage(null)
    setStatusMessage(null)

    try {
      const response = await fetch("/api/hoteleria/hyperguest/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingIntentId: availability.bookingIntent.id,
          reason: "Cancelacion solicitada desde la UI.",
        }),
      })

      await readJsonResponse<CancelResult>(response)
      setStatusMessage("Reserva cancelada correctamente.")
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo cancelar la reserva.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form className="grid gap-4" onSubmit={handleSearch}>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block font-sans text-sm text-dark-brown">
            Check-in
            <input
              type="date"
              value={checkIn}
              min={getTodayDate()}
              onChange={(event) => {
                const next = event.target.value
                setCheckIn(next)
                if (next && checkOut && next >= checkOut) {
                  const nextDay = new Date(`${next}T00:00:00`)
                  nextDay.setDate(nextDay.getDate() + 1)
                  setCheckOut(formatLocalDate(nextDay))
                }
              }}
              className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
              required
            />
          </label>
          <label className="block font-sans text-sm text-dark-brown">
            Check-out
            <input
              type="date"
              value={checkOut}
              min={checkIn || getTodayDate()}
              onChange={(event) => setCheckOut(event.target.value)}
              className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
              required
            />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block font-sans text-sm text-dark-brown">
            Nacionalidad (ISO 2)
            <input
              type="text"
              value={nationality}
              onChange={(event) =>
                setNationality(event.target.value.toUpperCase().slice(0, 2))
              }
              className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
              maxLength={2}
              required
            />
          </label>
          <label className="block font-sans text-sm text-dark-brown">
            Moneda (ISO 3)
            <input
              type="text"
              value={currency}
              onChange={(event) =>
                setCurrency(event.target.value.toUpperCase().slice(0, 3))
              }
              className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
              maxLength={3}
              required
            />
          </label>
        </div>

        <div className="space-y-3">
          {occupancy.map((room, roomIndex) => (
            <div
              key={roomIndex}
              className="space-y-3 border border-dark-brown/15 p-3"
            >
              <div className="flex items-center justify-between">
                <p className="font-sans text-xs uppercase tracking-[0.18em] text-subtle">
                  Habitacion {roomIndex + 1}
                </p>
                {occupancy.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeRoom(roomIndex)}
                    className="font-sans text-xs uppercase text-primary"
                  >
                    Quitar
                  </button>
                ) : null}
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="block font-sans text-sm text-dark-brown">
                  Adultos
                  <input
                    type="number"
                    min={1}
                    value={room.adults}
                    onChange={(event) =>
                      updateRoom(roomIndex, {
                        adults: Math.max(1, Number(event.target.value)),
                      })
                    }
                    className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
                    required
                  />
                </label>
                <label className="block font-sans text-sm text-dark-brown">
                  Niños
                  <input
                    type="number"
                    min={0}
                    value={room.childrenAges.length}
                    onChange={(event) =>
                      setRoomChildrenCount(roomIndex, Number(event.target.value))
                    }
                    className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
                  />
                </label>
                <label className="block font-sans text-sm text-dark-brown">
                  Infantes
                  <input
                    type="number"
                    min={0}
                    value={room.infants}
                    onChange={(event) =>
                      updateRoom(roomIndex, {
                        infants: Math.max(0, Number(event.target.value)),
                      })
                    }
                    className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
                  />
                </label>
              </div>
              {room.childrenAges.length > 0 ? (
                <div className="grid gap-2 sm:grid-cols-3">
                  {room.childrenAges.map((age, childIndex) => (
                    <label
                      key={childIndex}
                      className="block font-sans text-xs text-subtle"
                    >
                      Edad niño {childIndex + 1}
                      <input
                        type="number"
                        min={0}
                        max={17}
                        value={age}
                        onChange={(event) =>
                          setRoomChildAge(
                            roomIndex,
                            childIndex,
                            Number(event.target.value),
                          )
                        }
                        className="mt-1 w-full border border-dark-brown/20 bg-off-white px-3 py-2 font-sans text-sm text-dark-brown"
                      />
                    </label>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          <button
            type="button"
            onClick={addRoom}
            className="font-sans text-xs uppercase tracking-[0.18em] text-primary"
          >
            + Agregar habitacion
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center bg-primary px-6 py-4 text-center font-sans text-sm font-bold text-off-white transition-colors hover:bg-primary/85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Consultando..." : "Consultar disponibilidad"}
        </button>
      </form>

      {propertyRemarks.length > 0 ? (
        <div className="border border-dark-brown/15 bg-white/60 p-4">
          <p className="mb-2 font-sans text-xs uppercase tracking-[0.18em] text-subtle">
            Información del establecimiento
          </p>
          <ul className="list-disc space-y-1 pl-5 font-sans text-sm text-dark-brown">
            {propertyRemarks.map((remark, index) => (
              <li key={index} className="whitespace-pre-line">
                {remark}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {offers.length > 0 ? (
        <div className="space-y-4">
          {occupancy.map((_, roomIndex) => (
            <div key={roomIndex} className="space-y-2">
              <p className="font-sans text-xs uppercase tracking-[0.18em] text-subtle">
                Tarifa para habitacion {roomIndex + 1}
              </p>
              <div className="space-y-3">
                {offers.map((offer, index) => {
                  const value = offerKey(offer, index)
                  const details = offerDetailsById.get(value)
                  const isSelected = selectedOfferIds[roomIndex] === value

                  return (
                    <label
                      key={value}
                      className={`flex cursor-pointer items-start gap-3 border p-4 font-sans text-sm text-dark-brown transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-dark-brown/15"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`hotel-offer-${roomIndex}`}
                        value={value}
                        checked={isSelected}
                        onChange={() => toggleSelectedOffer(roomIndex, value)}
                        className="mt-1"
                      />
                      <OfferCard
                        offer={offer}
                        details={details}
                        fallbackCurrency={currency}
                      />
                    </label>
                  )
                })}
              </div>
            </div>
          ))}

          <button
            type="button"
            disabled={isLoading}
            onClick={handlePrebook}
            className="inline-flex w-full justify-center border border-dark-brown/20 px-6 py-4 text-center font-sans text-sm font-bold text-dark-brown transition-colors hover:bg-dark-brown/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {hasPrebooked ? "Pre-reserva lista" : "Iniciar pre-reserva"}
          </button>
        </div>
      ) : null}

      {hasPrebooked ? (
        <div className="space-y-4 border border-dark-brown/15 p-4">
          <p className="font-sans text-xs uppercase tracking-[0.18em] text-subtle">
            Datos del huesped principal
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block font-sans text-sm text-dark-brown">
              Nombre
              <input
                value={guestFirstName}
                onChange={(event) => setGuestFirstName(event.target.value)}
                className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
                required
              />
            </label>
            <label className="block font-sans text-sm text-dark-brown">
              Apellido
              <input
                value={guestLastName}
                onChange={(event) => setGuestLastName(event.target.value)}
                className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
                required
              />
            </label>
            <label className="block font-sans text-sm text-dark-brown">
              Email
              <input
                type="email"
                value={guestEmail}
                onChange={(event) => setGuestEmail(event.target.value)}
                className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
                required
              />
            </label>
            <label className="block font-sans text-sm text-dark-brown">
              Telefono
              <input
                value={guestPhone}
                onChange={(event) => setGuestPhone(event.target.value)}
                className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
                required
              />
            </label>
            <label className="block font-sans text-sm text-dark-brown">
              Direccion
              <input
                value={guestAddress}
                onChange={(event) => setGuestAddress(event.target.value)}
                className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
                required
              />
            </label>
            <label className="block font-sans text-sm text-dark-brown">
              Ciudad
              <input
                value={guestCity}
                onChange={(event) => setGuestCity(event.target.value)}
                className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
                required
              />
            </label>
            <label className="block font-sans text-sm text-dark-brown">
              Provincia / Estado
              <input
                value={guestState}
                onChange={(event) => setGuestState(event.target.value)}
                className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
              />
            </label>
            <label className="block font-sans text-sm text-dark-brown">
              Codigo postal
              <input
                value={guestZip}
                onChange={(event) => setGuestZip(event.target.value)}
                className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
              />
            </label>
            <label className="block font-sans text-sm text-dark-brown">
              Pais (ISO 2)
              <input
                value={guestCountry}
                onChange={(event) =>
                  setGuestCountry(event.target.value.toUpperCase().slice(0, 2))
                }
                className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
                maxLength={2}
                required
              />
            </label>
            <label className="block font-sans text-sm text-dark-brown">
              Fecha de nacimiento
              <input
                type="date"
                value={guestBirthDate}
                onChange={(event) => setGuestBirthDate(event.target.value)}
                className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
              />
            </label>
          </div>
          <label className="block font-sans text-sm text-dark-brown">
            Pedidos especiales (uno por línea, opcional)
            <textarea
              value={specialRequests}
              onChange={(event) => setSpecialRequests(event.target.value)}
              rows={3}
              placeholder="Ej.: late check-in, cama matrimonial, piso alto"
              className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
            />
            <span className="mt-1 block font-sans text-xs text-subtle">
              Se envían como hints a HyperGuest. No están garantizados por el hotel.
            </span>
          </label>

          <div className="space-y-3 border border-dark-brown/15 bg-white/60 p-4">
            <p className="font-sans text-xs uppercase tracking-[0.18em] text-subtle">
              Datos de la tarjeta
            </p>
            <p className="font-sans text-xs text-subtle">
              Solo en testing contra la Certification Property (19912). HyperGuest provee tarjeta de prueba — no usar tarjeta real.
            </p>
            <label className="block font-sans text-sm text-dark-brown">
              Número de tarjeta
              <input
                value={cardNumber}
                onChange={(event) => setCardNumber(event.target.value)}
                inputMode="numeric"
                autoComplete="off"
                className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
                required
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="block font-sans text-sm text-dark-brown">
                CVV
                <input
                  value={cardCvv}
                  onChange={(event) => setCardCvv(event.target.value)}
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={4}
                  className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
                  required
                />
              </label>
              <label className="block font-sans text-sm text-dark-brown">
                Mes (1-12)
                <input
                  value={cardExpiryMonth}
                  onChange={(event) => setCardExpiryMonth(event.target.value)}
                  inputMode="numeric"
                  maxLength={2}
                  className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
                  required
                />
              </label>
              <label className="block font-sans text-sm text-dark-brown">
                Año
                <input
                  value={cardExpiryYear}
                  onChange={(event) => setCardExpiryYear(event.target.value)}
                  inputMode="numeric"
                  maxLength={4}
                  className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
                  required
                />
              </label>
            </div>
          </div>

          <button
            type="button"
            disabled={isLoading || Boolean(bookResult)}
            onClick={handleBook}
            className="inline-flex w-full justify-center bg-primary px-6 py-4 text-center font-sans text-sm font-bold text-off-white transition-colors hover:bg-primary/85 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {bookResult ? "Reserva creada" : "Confirmar reserva"}
          </button>
        </div>
      ) : null}

      {bookResult ? (
        <button
          type="button"
          disabled={isLoading}
          onClick={handleCancel}
          className="inline-flex w-full justify-center border border-primary px-6 py-4 text-center font-sans text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-off-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancelar reserva
        </button>
      ) : null}

      {statusMessage ? (
        <p className="font-sans text-sm text-dark-brown">{statusMessage}</p>
      ) : null}
      {errorMessage ? (
        <p className="font-sans text-sm font-bold text-primary">{errorMessage}</p>
      ) : null}
    </div>
  )
}

interface OfferCardProps {
  offer: AvailabilityOffer
  details: OfferDetails | undefined
  fallbackCurrency: string
}

function formatAmount(value: number | null | undefined) {
  if (value === null || value === undefined) return null
  return value.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function OfferCard({ offer, details, fallbackCurrency }: OfferCardProps) {
  if (!details) {
    return (
      <div className="flex-1">
        <p className="font-bold">{offer.roomName}</p>
        {offer.totalAmount ? (
          <p className="text-primary">
            {offer.currency ?? fallbackCurrency}{" "}
            {formatAmount(offer.totalAmount)}
          </p>
        ) : (
          <p className="text-primary">Tarifa disponible</p>
        )}
      </div>
    )
  }

  const currency = details.currency ?? offer.currency ?? fallbackCurrency
  const totalNet = details.netAmount ?? offer.totalAmount
  const totalSell = details.sellAmount
  const displayTaxes = details.taxes.filter((tax) => tax.relation === "display")
  const includedTaxes = details.taxes.filter(
    (tax) => tax.relation === "included",
  )
  const displayFees = details.fees.filter((fee) => fee.relation === "display")
  const includedFees = details.fees.filter((fee) => fee.relation === "included")

  return (
    <div className="flex-1 space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="font-bold">{offer.roomName}</p>
          <p className="text-subtle">
            {details.boardLabel}
            {details.rateName && details.rateName !== details.boardLabel ? (
              <> · {details.rateName}</>
            ) : null}
          </p>
          {details.beddingDescription || details.roomSize ? (
            <p className="text-xs text-subtle">
              {[
                details.beddingDescription,
                details.roomSize ? `${details.roomSize} m²` : null,
                details.maxOccupancy
                  ? `Cap. ${details.maxOccupancy} pax`
                  : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          ) : null}
        </div>
        <div className="text-right">
          {totalNet !== null && totalNet !== undefined ? (
            <p className="font-bold text-primary">
              {currency} {formatAmount(totalNet)}
            </p>
          ) : null}
          {totalSell !== null &&
          totalSell !== undefined &&
          totalSell !== totalNet ? (
            <p className="text-xs text-subtle">
              Sell: {currency} {formatAmount(totalSell)}
            </p>
          ) : null}
          {details.searchCurrencyAmount !== null &&
          details.searchCurrency &&
          details.searchCurrency !== currency ? (
            <p className="text-xs text-subtle">
              ≈ {details.searchCurrency}{" "}
              {formatAmount(details.searchCurrencyAmount)}
            </p>
          ) : null}
          <p
            className={`text-xs font-bold ${
              details.isRefundable ? "text-emerald-700" : "text-amber-700"
            }`}
          >
            {details.isRefundable ? "Reembolsable" : "No reembolsable"}
          </p>
        </div>
      </div>

      {displayTaxes.length > 0 || displayFees.length > 0 ? (
        <div className="border-t border-dark-brown/10 pt-2 text-xs text-subtle">
          <p className="font-bold uppercase tracking-[0.14em]">
            No incluido en la tarifa
          </p>
          <ul className="mt-1 list-disc pl-5">
            {displayTaxes.map((tax, index) => (
              <li key={`dtax-${index}`}>
                {tax.description} — {tax.currency} {formatAmount(tax.amount)}
              </li>
            ))}
            {displayFees.map((fee, index) => (
              <li key={`dfee-${index}`}>
                {fee.description} — {fee.currency} {formatAmount(fee.amount)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {includedTaxes.length > 0 || includedFees.length > 0 ? (
        <div className="text-xs text-subtle">
          <p className="font-bold uppercase tracking-[0.14em]">
            Incluido en la tarifa
          </p>
          <ul className="mt-1 list-disc pl-5">
            {includedTaxes.map((tax, index) => (
              <li key={`itax-${index}`}>
                {tax.description} — {tax.currency} {formatAmount(tax.amount)}
              </li>
            ))}
            {includedFees.map((fee, index) => (
              <li key={`ifee-${index}`}>
                {fee.description} — {fee.currency} {formatAmount(fee.amount)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {details.cancellationPolicies.length > 0 ? (
        <div className="border-t border-dark-brown/10 pt-2 text-xs text-subtle">
          <p className="font-bold uppercase tracking-[0.14em]">
            Política de cancelación
          </p>
          <ul className="mt-1 list-disc pl-5">
            {details.cancellationPolicies.map((policy, index) => {
              const window = policy.fromCheckIn
                ? `dentro de ${policy.fromCheckIn} previos al check-in`
                : policy.daysBefore !== null
                  ? `dentro de los ${policy.daysBefore} días previos`
                  : "en cualquier momento"
              const penalty =
                policy.amount === null
                  ? "penalidad según política"
                  : policy.penaltyType === "nights"
                    ? `${policy.amount} noche(s) de penalidad`
                    : `${policy.amount} ${policy.penaltyType ?? ""} de penalidad`

              return (
                <li key={`pol-${index}`}>
                  {penalty} si se cancela {window}.
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}

      {details.ratePlanRemarks.length > 0 ? (
        <div className="border-t border-dark-brown/10 pt-2 text-xs text-subtle">
          <p className="font-bold uppercase tracking-[0.14em]">
            Notas de la tarifa
          </p>
          <ul className="mt-1 list-disc whitespace-pre-line pl-5">
            {details.ratePlanRemarks.map((remark, index) => (
              <li key={`rem-${index}`}>{remark}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {details.nightlyBreakdown.length > 1 ? (
        <div className="border-t border-dark-brown/10 pt-2 text-xs text-subtle">
          <p className="font-bold uppercase tracking-[0.14em]">
            Desglose por noche
          </p>
          <ul className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-3">
            {details.nightlyBreakdown.map((night, index) => (
              <li key={`night-${index}`}>
                {night.date}: {currency} {formatAmount(night.net ?? night.sell)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
