"use client"

import { useMemo, useState, type FormEvent } from "react"

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

function getDefaultDate(offsetDays: number) {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)

  return date.toISOString().slice(0, 10)
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

  const [guestFirstName, setGuestFirstName] = useState("Test")
  const [guestLastName, setGuestLastName] = useState("Apacheta")
  const [guestEmail, setGuestEmail] = useState("test@apacheta.com")
  const [guestPhone, setGuestPhone] = useState("+541112345678")
  const [guestAddress, setGuestAddress] = useState("Av. Siempre Viva 123")
  const [guestCity, setGuestCity] = useState("Buenos Aires")
  const [guestState, setGuestState] = useState("CABA")
  const [guestZip, setGuestZip] = useState("C1000")
  const [guestCountry, setGuestCountry] = useState("AR")
  const [guestBirthDate, setGuestBirthDate] = useState("1990-01-01")

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
    setIsLoading(true)
    setErrorMessage(null)
    setStatusMessage(null)
    resetAfterSearch()

    try {
      const response = await fetch("/api/hoteleria/hyperguest/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      setAvailability(payload)
      setSelectedOfferIds(
        Array.from({ length: occupancy.length }, () =>
          payload.offers[0] ? offerKey(payload.offers[0], 0) : "",
        ),
      )
      setStatusMessage(
        payload.offers.length > 0
          ? `Encontramos ${payload.offers.length} tarifa(s).`
          : "No encontramos tarifas para esa configuracion.",
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo consultar la disponibilidad.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  function getSelectedOffers() {
    return selectedOfferIds
      .map((key) => (key ? offersById.get(key) : null))
      .filter((offer): offer is AvailabilityOffer => Boolean(offer))
  }

  async function handlePrebook() {
    if (!availability) return

    const selected = getSelectedOffers()

    if (selected.length === 0) {
      setErrorMessage("Selecciona al menos una tarifa para continuar.")
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

    setIsLoading(true)
    setErrorMessage(null)
    setStatusMessage(null)

    try {
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
              onChange={(event) => setCheckIn(event.target.value)}
              className="mt-2 w-full border border-dark-brown/20 bg-off-white px-3 py-3 font-sans text-sm text-dark-brown"
              required
            />
          </label>
          <label className="block font-sans text-sm text-dark-brown">
            Check-out
            <input
              type="date"
              value={checkOut}
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

      {offers.length > 0 ? (
        <div className="space-y-4">
          {occupancy.map((_, roomIndex) => (
            <div key={roomIndex} className="space-y-2">
              <p className="font-sans text-xs uppercase tracking-[0.18em] text-subtle">
                Tarifa para habitacion {roomIndex + 1}
              </p>
              <div className="space-y-2">
                {offers.map((offer, index) => {
                  const value = offerKey(offer, index)

                  return (
                    <label
                      key={value}
                      className="flex cursor-pointer items-start gap-3 border border-dark-brown/15 p-3 font-sans text-sm text-dark-brown"
                    >
                      <input
                        type="radio"
                        name={`hotel-offer-${roomIndex}`}
                        value={value}
                        checked={selectedOfferIds[roomIndex] === value}
                        onChange={() => toggleSelectedOffer(roomIndex, value)}
                        className="mt-1"
                      />
                      <span className="flex-1">
                        <span className="block font-bold">{offer.roomName}</span>
                        {offer.boardName ? (
                          <span className="block text-subtle">{offer.boardName}</span>
                        ) : null}
                        {offer.totalAmount ? (
                          <span className="block text-primary">
                            {offer.currency ?? currency}{" "}
                            {offer.totalAmount.toLocaleString("es-AR")}
                          </span>
                        ) : (
                          <span className="block text-primary">
                            Tarifa disponible
                          </span>
                        )}
                      </span>
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
