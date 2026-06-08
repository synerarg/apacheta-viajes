"use client"

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import { ChevronDown, ChevronUp, Minus, Plus } from "lucide-react"

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
const OFFERS_VISIBLE_DEFAULT = 4

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

function formatAmount(value: number | null | undefined) {
  if (value === null || value === undefined) return null
  return value.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
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

function PaxCounter({
  label,
  value,
  min = 0,
  max = 9,
  onChange,
}: {
  label: string
  value: number
  min?: number
  max?: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-sans text-sm text-dark-brown">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-7 w-7 items-center justify-center border border-dark-brown/20 text-dark-brown transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Reducir ${label}`}
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-4 text-center font-sans text-sm font-medium text-dark-brown">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex h-7 w-7 items-center justify-center border border-dark-brown/20 text-dark-brown transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Aumentar ${label}`}
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

export function HotelAvailabilityForm({ hotelId }: HotelAvailabilityFormProps) {
  const [checkIn, setCheckIn] = useState(getDefaultDate(14))
  const [checkOut, setCheckOut] = useState(getDefaultDate(15))
  const [occupancy, setOccupancy] = useState<RoomOccupancy[]>([{ ...EMPTY_ROOM }])
  const [showPaxPanel, setShowPaxPanel] = useState(false)

  const [availability, setAvailability] = useState<AvailabilityResult | null>(null)
  const [selectedOfferIds, setSelectedOfferIds] = useState<string[]>([])
  const [showAllOffers, setShowAllOffers] = useState(false)
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null)
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
  const [showExtraContact, setShowExtraContact] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [cardExpiryMonth, setCardExpiryMonth] = useState("")
  const [cardExpiryYear, setCardExpiryYear] = useState("")

  const abortRef = useRef<AbortController | null>(null)
  const hasMountedRef = useRef(false)
  const paxPanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }
    abortRef.current?.abort()
    abortRef.current = null
    setAvailability(null)
    setSelectedOfferIds([])
    setHasPrebooked(false)
    setBookResult(null)
    setStatusMessage(null)
    setErrorMessage(null)
    setShowAllOffers(false)
    setExpandedOffer(null)
  }, [checkIn, checkOut, occupancy, hotelId])

  useEffect(() => {
    return () => { abortRef.current?.abort() }
  }, [])

  useEffect(() => {
    if (!showPaxPanel) return
    function handleClick(e: MouseEvent) {
      if (paxPanelRef.current && !paxPanelRef.current.contains(e.target as Node)) {
        setShowPaxPanel(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showPaxPanel])

  const totalAdults = occupancy.reduce((s, r) => s + r.adults, 0)
  const totalChildren = occupancy.reduce((s, r) => s + r.childrenAges.length, 0)

  const paxSummary = [
    `${totalAdults} adulto${totalAdults !== 1 ? "s" : ""}`,
    totalChildren > 0 ? `${totalChildren} niño${totalChildren !== 1 ? "s" : ""}` : null,
    occupancy.length > 1 ? `${occupancy.length} hab.` : null,
  ].filter(Boolean).join(", ")

  const offers = useMemo(() => availability?.offers ?? [], [availability])
  const offersById = useMemo(() => {
    const map = new Map<string, AvailabilityOffer>()
    offers.forEach((offer, index) => map.set(offerKey(offer, index), offer))
    return map
  }, [offers])
  const offerDetailsById = useMemo(() => {
    const map = new Map<string, OfferDetails>()
    offers.forEach((offer, index) => map.set(offerKey(offer, index), extractOfferDetails(offer.raw)))
    return map
  }, [offers])

  const visibleOffers = showAllOffers ? offers : offers.slice(0, OFFERS_VISIBLE_DEFAULT)
  const hiddenCount = Math.max(0, offers.length - OFFERS_VISIBLE_DEFAULT)

  function updateRoom(index: number, patch: Partial<RoomOccupancy>) {
    setOccupancy(current => current.map((room, i) => i === index ? { ...room, ...patch } : room))
  }

  function setRoomChildrenCount(index: number, count: number) {
    setOccupancy(current => current.map((room, i) => {
      if (i !== index) return room
      const safeCount = Math.max(0, Math.floor(count))
      const ages = room.childrenAges.slice(0, safeCount)
      while (ages.length < safeCount) ages.push(7)
      return { ...room, childrenAges: ages }
    }))
  }

  function setRoomChildAge(roomIndex: number, childIndex: number, age: number) {
    setOccupancy(current => current.map((room, i) => {
      if (i !== roomIndex) return room
      const ages = [...room.childrenAges]
      ages[childIndex] = Math.max(0, Math.min(17, Math.floor(age)))
      return { ...room, childrenAges: ages }
    }))
  }

  function addRoom() {
    setOccupancy(current => [...current, { ...EMPTY_ROOM }])
  }

  function removeRoom(index: number) {
    setOccupancy(current => current.length > 1 ? current.filter((_, i) => i !== index) : current)
    setSelectedOfferIds(current => current.filter((_, i) => i !== index))
  }

  function toggleSelectedOffer(roomIndex: number, key: string) {
    setSelectedOfferIds(current => {
      const next = [...current]
      next[roomIndex] = key
      return next
    })
  }

  function getSelectedOffers() {
    return selectedOfferIds
      .map(key => key ? offersById.get(key) : null)
      .filter((offer): offer is AvailabilityOffer => Boolean(offer))
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!checkIn || !checkOut) { setErrorMessage("Indicá fechas de check-in y check-out."); return }
    if (isDateInPast(checkIn)) { setErrorMessage("La fecha de check-in no puede ser anterior a hoy."); return }
    if (checkOut <= checkIn) { setErrorMessage("El check-out debe ser posterior al check-in."); return }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setIsLoading(true)
    setErrorMessage(null)
    setStatusMessage(null)
    setAvailability(null)
    setShowAllOffers(false)
    setExpandedOffer(null)

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
          nationality: "AR",
          currency: "ARS",
        }),
      })
      const payload = await readJsonResponse<AvailabilityResult>(response)
      if (controller.signal.aborted) return
      setAvailability(payload)
      setSelectedOfferIds(Array.from({ length: occupancy.length }, () =>
        payload.offers[0] ? offerKey(payload.offers[0], 0) : "",
      ))
      if (payload.offers.length === 0) {
        setStatusMessage("No encontramos tarifas para esas fechas. Probá con otras.")
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      if (controller.signal.aborted) return
      setErrorMessage(error instanceof Error ? error.message : "No se pudo consultar la disponibilidad.")
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null
        setIsLoading(false)
      }
    }
  }

  async function handlePrebook() {
    if (!availability || isLoading) return
    const selected = getSelectedOffers()
    if (selected.length < occupancy.length) {
      setErrorMessage("Seleccioná una tarifa para cada habitación antes de continuar.")
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
          selectedOffers: selected.map(offer => offer.raw),
        }),
      })
      await readJsonResponse<PrebookResult>(response)
      setHasPrebooked(true)
      setStatusMessage(null)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo iniciar la pre-reserva.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleBook() {
    if (!availability || isLoading) return

    const missingField = (
      [
        ["nombre", guestFirstName],
        ["apellido", guestLastName],
        ["email", guestEmail],
        ["teléfono", guestPhone],
      ] as const
    ).find(([, value]) => value.trim().length === 0)

    if (missingField) { setErrorMessage(`Completá el campo "${missingField[0]}".`); return }
    if (!/^\S+@\S+\.\S+$/.test(guestEmail)) { setErrorMessage("Ingresá un email válido."); return }
    if (!guestBirthDate) { setErrorMessage("La fecha de nacimiento es requerida."); return }

    if (!cardNumber.replace(/\s+/g, "")) { setErrorMessage("Ingresá el número de tarjeta."); return }
    if (!cardCvv) { setErrorMessage("Ingresá el CVV."); return }
    if (!cardExpiryMonth || !cardExpiryYear) { setErrorMessage("Ingresá la fecha de vencimiento."); return }

    const selectedForBook = getSelectedOffers()
    if (selectedForBook.length < occupancy.length) {
      setErrorMessage("Volvé a seleccionar una tarifa.")
      return
    }

    setIsLoading(true)
    setErrorMessage(null)
    setStatusMessage(null)

    try {
      const refreshResponse = await fetch("/api/hoteleria/hyperguest/prebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingIntentId: availability.bookingIntent.id,
          selectedOffers: selectedForBook.map(offer => offer.raw),
        }),
      })
      await readJsonResponse<PrebookResult>(refreshResponse)

      const trimmedRequests = specialRequests.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0)
      const normalizedCard = cardNumber.replace(/\s+/g, "")

      const response = await fetch("/api/hoteleria/hyperguest/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingIntentId: availability.bookingIntent.id,
          guest: {
            firstName: guestFirstName.trim(),
            lastName: guestLastName.trim(),
            title: "MR",
            birthDate: guestBirthDate || null,
            email: guestEmail.trim(),
            phone: guestPhone.trim(),
            contact: {
              address: guestAddress.trim() || "N/A",
              city: guestCity.trim() || "N/A",
              country: guestCountry.toUpperCase(),
              email: guestEmail.trim(),
              phone: guestPhone.trim(),
              state: guestState.trim() || null,
              zip: guestZip.trim() || null,
            },
          },
          specialRequests: trimmedRequests.length > 0 ? trimmedRequests : undefined,
          paymentDetails: {
            type: "credit_card" as const,
            details: {
              number: normalizedCard,
              cvv: cardCvv.trim(),
              expiry: { month: cardExpiryMonth.trim(), year: cardExpiryYear.trim() },
            },
          },
        }),
      })

      const payload = await readJsonResponse<BookResult>(response)
      setBookResult(payload)
      setStatusMessage(
        payload.bookingIntent.provider_booking_id
          ? `Reserva confirmada. Código: ${payload.bookingIntent.provider_booking_id}`
          : "Reserva enviada. En breve recibirás la confirmación.",
      )
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo confirmar la reserva.")
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
          reason: "Cancelación solicitada por el huésped.",
        }),
      })
      await readJsonResponse<CancelResult>(response)
      setStatusMessage("Reserva cancelada correctamente.")
      setBookResult(null)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo cancelar la reserva.")
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass =
    "mt-1.5 w-full border border-dark-brown/20 bg-off-white px-3 py-2.5 font-sans text-sm text-dark-brown placeholder:text-dark-brown/40 focus:border-dark-brown/50 focus:outline-none"
  const labelClass = "block font-sans text-xs uppercase tracking-[0.12em] text-subtle"

  return (
    <div className="space-y-5">
      {errorMessage ? (
        <p className="border border-primary/20 bg-primary/5 px-4 py-3 font-sans text-sm text-primary">
          {errorMessage}
        </p>
      ) : null}

      {/* Search form */}
      {!bookResult ? (
        <form className="space-y-4" onSubmit={handleSearch}>
          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Check-in</label>
              <input
                type="date"
                value={checkIn}
                min={getTodayDate()}
                onChange={(e) => {
                  const next = e.target.value
                  setCheckIn(next)
                  if (next && checkOut && next >= checkOut) {
                    const d = new Date(`${next}T00:00:00`)
                    d.setDate(d.getDate() + 1)
                    setCheckOut(formatLocalDate(d))
                  }
                }}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Check-out</label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || getTodayDate()}
                onChange={(e) => setCheckOut(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Pax selector */}
          <div ref={paxPanelRef} className="relative">
            <label className={labelClass}>Huéspedes</label>
            <button
              type="button"
              onClick={() => setShowPaxPanel(v => !v)}
              className="mt-1.5 flex w-full items-center justify-between border border-dark-brown/20 bg-off-white px-3 py-2.5 font-sans text-sm text-dark-brown"
            >
              <span>{paxSummary}</span>
              {showPaxPanel ? <ChevronUp className="h-4 w-4 shrink-0 text-subtle" /> : <ChevronDown className="h-4 w-4 shrink-0 text-subtle" />}
            </button>

            {showPaxPanel ? (
              <div className="absolute left-0 right-0 top-full z-20 border border-dark-brown/15 bg-white shadow-md">
                <div className="divide-y divide-dark-brown/8 p-4">
                  {occupancy.map((room, roomIndex) => (
                    <div key={roomIndex} className="space-y-3 py-3 first:pt-0 last:pb-0">
                      {occupancy.length > 1 ? (
                        <div className="flex items-center justify-between">
                          <p className="font-sans text-xs uppercase tracking-[0.14em] text-subtle">
                            Habitación {roomIndex + 1}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeRoom(roomIndex)}
                            className="font-sans text-xs text-primary hover:underline"
                          >
                            Quitar
                          </button>
                        </div>
                      ) : null}
                      <PaxCounter
                        label="Adultos"
                        value={room.adults}
                        min={1}
                        onChange={(v) => updateRoom(roomIndex, { adults: v })}
                      />
                      <PaxCounter
                        label="Niños (2–17 años)"
                        value={room.childrenAges.length}
                        onChange={(v) => setRoomChildrenCount(roomIndex, v)}
                      />
                      {room.childrenAges.length > 0 ? (
                        <div className="ml-4 space-y-2">
                          {room.childrenAges.map((age, childIndex) => (
                            <div key={childIndex} className="flex items-center justify-between gap-3">
                              <span className="font-sans text-xs text-subtle">Edad niño {childIndex + 1}</span>
                              <select
                                value={age}
                                onChange={(e) => setRoomChildAge(roomIndex, childIndex, Number(e.target.value))}
                                className="border border-dark-brown/20 bg-off-white px-2 py-1 font-sans text-sm text-dark-brown"
                              >
                                {Array.from({ length: 16 }, (_, i) => i + 2).map(a => (
                                  <option key={a} value={a}>{a} años</option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      ) : null}
                      <PaxCounter
                        label="Infantes (0–1 año)"
                        value={room.infants}
                        onChange={(v) => updateRoom(roomIndex, { infants: v })}
                      />
                    </div>
                  ))}
                </div>
                <div className="border-t border-dark-brown/10 p-3">
                  <button
                    type="button"
                    onClick={addRoom}
                    className="font-sans text-xs uppercase tracking-[0.14em] text-primary hover:underline"
                  >
                    + Agregar habitación
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary py-3.5 font-sans text-sm font-bold tracking-wide text-off-white transition-colors hover:bg-primary/85 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && !availability ? "Buscando..." : "Consultar disponibilidad"}
          </button>
        </form>
      ) : null}

      {/* Results: offer list */}
      {offers.length > 0 && !hasPrebooked && !bookResult ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-sans text-xs uppercase tracking-[0.14em] text-subtle">
              {occupancy.length > 1 ? "Tarifas disponibles" : `${offers.length} tarifa${offers.length !== 1 ? "s" : ""} encontrada${offers.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {occupancy.map((_, roomIndex) => (
            <div key={roomIndex} className="space-y-2">
              {occupancy.length > 1 ? (
                <p className="font-sans text-xs text-subtle">Habitación {roomIndex + 1}</p>
              ) : null}
              <div className="space-y-2">
                {visibleOffers.map((offer, index) => {
                  const value = offerKey(offer, index)
                  const details = offerDetailsById.get(value)
                  const isSelected = selectedOfferIds[roomIndex] === value
                  const isExpanded = expandedOffer === value

                  return (
                    <div
                      key={value}
                      className={`border transition-colors ${isSelected ? "border-primary" : "border-dark-brown/15"}`}
                    >
                      <label className={`flex cursor-pointer items-start gap-3 p-4 ${isSelected ? "bg-primary/[0.03]" : ""}`}>
                        <input
                          type="radio"
                          name={`offer-${roomIndex}`}
                          value={value}
                          checked={isSelected}
                          onChange={() => toggleSelectedOffer(roomIndex, value)}
                          className="mt-0.5 shrink-0 accent-primary"
                        />
                        <div className="flex flex-1 flex-wrap items-start justify-between gap-x-3 gap-y-1">
                          <div className="min-w-0 flex-1">
                            <p className="font-sans text-sm font-medium text-dark-brown">{offer.roomName}</p>
                            {details ? (
                              <>
                                <p className="font-sans text-xs text-subtle">{details.boardLabel}</p>
                                {details.beddingDescription || details.roomSize ? (
                                  <p className="mt-0.5 font-sans text-xs text-dark-brown/50">
                                    {[details.beddingDescription, details.roomSize ? `${details.roomSize} m²` : null].filter(Boolean).join(" · ")}
                                  </p>
                                ) : null}
                              </>
                            ) : offer.boardName ? (
                              <p className="font-sans text-xs text-subtle">{offer.boardName}</p>
                            ) : null}
                          </div>
                          <div className="text-right">
                            {offer.totalAmount ? (
                              <p className="font-sans text-base font-bold text-primary">
                                {offer.currency ?? "USD"} {formatAmount(offer.totalAmount)}
                              </p>
                            ) : null}
                            {details ? (
                              <p className={`font-sans text-xs font-medium ${details.isRefundable ? "text-emerald-700" : "text-amber-700"}`}>
                                {details.isRefundable ? "Cancelación gratuita" : "No reembolsable"}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </label>

                      {/* Expandable details */}
                      {details ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setExpandedOffer(isExpanded ? null : value)}
                            className="flex w-full items-center gap-1 border-t border-dark-brown/10 px-4 py-2 font-sans text-xs text-subtle hover:text-dark-brown"
                          >
                            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            {isExpanded ? "Ocultar detalles" : "Ver políticas y detalles"}
                          </button>

                          {isExpanded ? (
                            <div className="space-y-3 border-t border-dark-brown/10 px-4 pb-4 pt-3 font-sans text-xs text-subtle">
                              {details.cancellationPolicies.length > 0 ? (
                                <div>
                                  <p className="mb-1 font-bold uppercase tracking-[0.12em]">Política de cancelación</p>
                                  <ul className="list-disc space-y-1 pl-4">
                                    {details.cancellationPolicies.map((policy, i) => {
                                      const window = policy.fromCheckIn
                                        ? `dentro de ${policy.fromCheckIn} previos al check-in`
                                        : policy.daysBefore !== null
                                          ? `dentro de los ${policy.daysBefore} días previos`
                                          : "en cualquier momento"
                                      const penalty =
                                        policy.amount === null ? "penalidad según política"
                                        : policy.penaltyType === "nights" ? `${policy.amount} noche${Number(policy.amount) !== 1 ? "s" : ""} de penalidad`
                                        : policy.penaltyType === "percent" ? `${policy.amount}% de penalidad`
                                        : `${policy.amount} ${policy.penaltyType ?? ""} de penalidad`
                                      return <li key={i}>{penalty} si se cancela {window}.</li>
                                    })}
                                  </ul>
                                </div>
                              ) : null}

                              {(details.taxes.filter(t => t.relation === "display").length > 0 || details.fees.filter(f => f.relation === "display").length > 0) ? (
                                <div>
                                  <p className="mb-1 font-bold uppercase tracking-[0.12em]">Cargos adicionales</p>
                                  <ul className="list-disc space-y-0.5 pl-4">
                                    {details.taxes.filter(t => t.relation === "display").map((t, i) => (
                                      <li key={i}>{t.description} — {t.currency} {formatAmount(t.amount)}</li>
                                    ))}
                                    {details.fees.filter(f => f.relation === "display").map((f, i) => (
                                      <li key={i}>{f.description} — {f.currency} {formatAmount(f.amount)}</li>
                                    ))}
                                  </ul>
                                </div>
                              ) : null}

                              {details.nightlyBreakdown.length > 1 ? (
                                <div>
                                  <p className="mb-1 font-bold uppercase tracking-[0.12em]">Desglose por noche</p>
                                  <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5 pl-0">
                                    {details.nightlyBreakdown.map((night, i) => (
                                      <li key={i} className="flex justify-between">
                                        <span>{night.date}</span>
                                        <span className="font-medium text-dark-brown">{night.currency ?? offer.currency} {formatAmount(night.net ?? night.sell)}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : null}

                              {details.ratePlanRemarks.length > 0 ? (
                                <div>
                                  <p className="mb-1 font-bold uppercase tracking-[0.12em]">Notas de la tarifa</p>
                                  <ul className="list-disc space-y-1 pl-4">
                                    {details.ratePlanRemarks.map((r, i) => <li key={i} className="whitespace-pre-line">{r}</li>)}
                                  </ul>
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  )
                })}

                {!showAllOffers && hiddenCount > 0 ? (
                  <button
                    type="button"
                    onClick={() => setShowAllOffers(true)}
                    className="w-full border border-dark-brown/15 py-3 font-sans text-xs uppercase tracking-[0.14em] text-subtle transition-colors hover:border-dark-brown/30 hover:text-dark-brown"
                  >
                    Ver {hiddenCount} tarifa{hiddenCount !== 1 ? "s" : ""} más
                  </button>
                ) : null}
              </div>
            </div>
          ))}

          <button
            type="button"
            disabled={isLoading}
            onClick={handlePrebook}
            className="w-full bg-primary py-3.5 font-sans text-sm font-bold tracking-wide text-off-white transition-colors hover:bg-primary/85 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Verificando..." : "Continuar con esta tarifa"}
          </button>
        </div>
      ) : null}

      {/* Status after search / no offers */}
      {statusMessage && !bookResult && !hasPrebooked ? (
        <p className="font-sans text-sm text-subtle">{statusMessage}</p>
      ) : null}

      {/* Guest form */}
      {hasPrebooked && !bookResult ? (
        <div className="space-y-5 border border-dark-brown/15 bg-white/60 p-5">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.14em] text-subtle">Datos del huésped</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Nombre</label>
              <input
                value={guestFirstName}
                onChange={e => setGuestFirstName(e.target.value)}
                placeholder="Juan"
                autoComplete="given-name"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Apellido</label>
              <input
                value={guestLastName}
                onChange={e => setGuestLastName(e.target.value)}
                placeholder="Pérez"
                autoComplete="family-name"
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={guestEmail}
                onChange={e => setGuestEmail(e.target.value)}
                placeholder="juan@ejemplo.com"
                autoComplete="email"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Teléfono</label>
              <input
                type="tel"
                value={guestPhone}
                onChange={e => setGuestPhone(e.target.value)}
                placeholder="+54 9 11 XXXX XXXX"
                autoComplete="tel"
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Fecha de nacimiento <span className="normal-case text-primary/70">*</span></label>
            <input
              type="date"
              value={guestBirthDate}
              onChange={e => setGuestBirthDate(e.target.value)}
              autoComplete="bday"
              className={inputClass}
              required
            />
          </div>

          <button
            type="button"
            onClick={() => setShowExtraContact(v => !v)}
            className="flex items-center gap-1 font-sans text-xs text-subtle hover:text-dark-brown"
          >
            {showExtraContact ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {showExtraContact ? "Ocultar datos de contacto adicionales" : "Agregar dirección de contacto"}
          </button>

          {showExtraContact ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Dirección</label>
                <input
                  value={guestAddress}
                  onChange={e => setGuestAddress(e.target.value)}
                  placeholder="Av. Corrientes 1234"
                  autoComplete="street-address"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Ciudad</label>
                <input
                  value={guestCity}
                  onChange={e => setGuestCity(e.target.value)}
                  placeholder="Buenos Aires"
                  autoComplete="address-level2"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>País</label>
                <input
                  value={guestCountry}
                  onChange={e => setGuestCountry(e.target.value.toUpperCase().slice(0, 2))}
                  placeholder="AR"
                  maxLength={2}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Provincia / Estado</label>
                <input
                  value={guestState}
                  onChange={e => setGuestState(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Código postal</label>
                <input
                  value={guestZip}
                  onChange={e => setGuestZip(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          ) : null}

          <div>
            <label className={labelClass}>Pedidos especiales <span className="normal-case text-dark-brown/40">(opcional)</span></label>
            <textarea
              value={specialRequests}
              onChange={e => setSpecialRequests(e.target.value)}
              rows={2}
              placeholder="Ej.: late check-in, cama matrimonial, piso alto"
              className={`${inputClass} resize-none`}
            />
            <p className="mt-1 font-sans text-xs text-subtle">No están garantizados — son hints al hotel.</p>
          </div>

          <div className="space-y-3 border-t border-dark-brown/10 pt-4">
            <p className="font-sans text-xs uppercase tracking-[0.14em] text-subtle">Datos de pago</p>
            <div>
              <label className={labelClass}>Número de tarjeta</label>
              <input
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="•••• •••• •••• ••••"
                className={inputClass}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>CVV</label>
                <input
                  value={cardCvv}
                  onChange={e => setCardCvv(e.target.value)}
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="•••"
                  maxLength={4}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Mes</label>
                <input
                  value={cardExpiryMonth}
                  onChange={e => setCardExpiryMonth(e.target.value)}
                  inputMode="numeric"
                  autoComplete="cc-exp-month"
                  placeholder="MM"
                  maxLength={2}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Año</label>
                <input
                  value={cardExpiryYear}
                  onChange={e => setCardExpiryYear(e.target.value)}
                  inputMode="numeric"
                  autoComplete="cc-exp-year"
                  placeholder="AAAA"
                  maxLength={4}
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleBook}
            className="w-full bg-primary py-3.5 font-sans text-sm font-bold tracking-wide text-off-white transition-colors hover:bg-primary/85 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Procesando reserva..." : "Confirmar reserva"}
          </button>
        </div>
      ) : null}

      {/* Booking confirmation */}
      {bookResult ? (
        <div className="space-y-4 border border-dark-brown/15 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
              <svg className="h-3 w-3 text-off-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-sans text-sm font-bold text-dark-brown">{statusMessage ?? "Reserva confirmada"}</p>
              {bookResult.bookingIntent.provider_booking_id ? (
                <p className="mt-0.5 font-sans text-xs text-subtle">
                  Referencia HyperGuest: #{bookResult.bookingIntent.provider_booking_id}
                </p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={handleCancel}
            className="w-full border border-dark-brown/20 py-3 font-sans text-sm text-dark-brown transition-colors hover:bg-dark-brown/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Cancelando..." : "Cancelar esta reserva"}
          </button>
        </div>
      ) : null}

      {/* Final status after cancel */}
      {statusMessage && (bookResult === null && hasPrebooked) ? (
        <p className="font-sans text-sm text-subtle">{statusMessage}</p>
      ) : null}
    </div>
  )
}
