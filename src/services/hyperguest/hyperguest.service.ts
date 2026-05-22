import { HotelsNotFoundException, HotelsServiceException } from "@/exceptions/hotels/hotels.exceptions"
import {
  cancelHyperGuestBooking,
  createHyperGuestBooking,
  getHyperGuestPropertyStaticData,
  getHyperGuestStaticHotels,
  listHyperGuestBookings,
  prebookHyperGuestReservation,
  searchHyperGuestAvailability,
} from "@/lib/hyperguest/client"
import { assertHyperGuestConfigured } from "@/lib/hyperguest/hyperguest.config"
import type { HyperGuestRepository } from "@/repositories/hyperguest/hyperguest.repository"
import type { HotelsRepository } from "@/repositories/hotels/hotels.repository"
import type { HotelsInsert } from "@/types/hotels/hotels.types"
import type {
  HyperGuestAvailabilityInput,
  HyperGuestBookInput,
  HyperGuestCancelInput,
  HyperGuestGuestContact,
  HyperGuestGuestDetails,
  HyperGuestJson,
  HyperGuestPrebookInput,
  HyperGuestRoomOccupancy,
} from "@/types/hyperguest/hyperguest.types"

type UnknownRecord = Record<string, unknown>

interface HyperGuestNormalizedOffer {
  id: string | null
  roomId: string | null
  rateId: string | null
  roomName: string
  boardName: string | null
  currency: string | null
  totalAmount: number | null
  raw: UnknownRecord
}

const PRICE_KEYS = [
  "total",
  "totalAmount",
  "amount",
  "price",
  "sell",
  "bar",
  "net",
]

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function toStringValue(value: unknown) {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim()
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value)
  }

  return null
}

function toNumberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.-]/g, ""))

    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

function getFirstString(record: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = toStringValue(record[key])

    if (value) {
      return value
    }
  }

  return null
}

function getFirstNumber(record: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = toNumberValue(record[key])

    if (value !== null) {
      return value
    }
  }

  return null
}

function getNestedRecord(record: UnknownRecord, keys: string[]) {
  let current: unknown = record

  for (const key of keys) {
    if (!isRecord(current)) {
      return null
    }

    current = current[key]
  }

  return isRecord(current) ? current : null
}

function getNestedNumber(record: UnknownRecord, keys: string[]) {
  let current: unknown = record

  for (const key of keys) {
    if (!isRecord(current)) {
      return null
    }

    current = current[key]
  }

  return toNumberValue(current)
}

function getNestedString(record: UnknownRecord, keys: string[]) {
  let current: unknown = record

  for (const key of keys) {
    if (!isRecord(current)) {
      return null
    }

    current = current[key]
  }

  return toStringValue(current)
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

function recordMatchesProperty(record: UnknownRecord, propertyId: string) {
  const idKeys = [
    "id",
    "hotelId",
    "hotel_id",
    "propertyId",
    "property_id",
    "code",
  ]

  return idKeys.some((key) => toStringValue(record[key]) === propertyId)
}

function findRecords(
  value: unknown,
  predicate: (record: UnknownRecord) => boolean,
  depth = 0,
): UnknownRecord[] {
  if (depth > 8) {
    return []
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => findRecords(item, predicate, depth + 1))
  }

  if (!isRecord(value)) {
    return []
  }

  const current = predicate(value) ? [value] : []
  const nested = Object.values(value).flatMap((item) =>
    findRecords(item, predicate, depth + 1),
  )

  return [...current, ...nested]
}

function findFirstNestedString(value: unknown, keys: string[], depth = 0): string | null {
  if (depth > 8) {
    return null
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const nested = findFirstNestedString(item, keys, depth + 1)

      if (nested) {
        return nested
      }
    }

    return null
  }

  if (!isRecord(value)) {
    return null
  }

  const direct = getFirstString(value, keys)

  if (direct) {
    return direct
  }

  for (const item of Object.values(value)) {
    const nested = findFirstNestedString(item, keys, depth + 1)

    if (nested) {
      return nested
    }
  }

  return null
}

function findFirstImageUrl(record: UnknownRecord) {
  const direct = getFirstString(record, [
    "image",
    "imageUrl",
    "image_url",
    "mainImage",
    "photo",
    "photoUrl",
    "thumbnail",
  ])

  if (direct) {
    return direct
  }

  const imageCollections = [record.images, record.photos, record.media]

  for (const collection of imageCollections) {
    const imageUrl = findFirstNestedString(collection, [
      "url",
      "uri",
      "imageUrl",
      "image_url",
      "href",
    ])

    if (imageUrl) {
      return imageUrl
    }
  }

  return null
}

function isCertificationProperty(record: UnknownRecord, propertyId: string) {
  const name = getFirstString(record, ["name", "hotelName", "hotel_name", "title"])
  const description = findFirstNestedString(record.descriptions, ["description"])

  return (
    propertyId === "19912" ||
    Boolean(name?.toLowerCase().includes("certification")) ||
    Boolean(description?.toLowerCase().includes("certifications only"))
  )
}

function normalizeHotelPayload(record: UnknownRecord, propertyId: string): HotelsInsert {
  const name =
    getFirstString(record, ["name", "hotelName", "hotel_name", "title"]) ??
    `Hotel HyperGuest ${propertyId}`
  const city = getFirstString(record, ["city", "locality", "destination"])
  const province = getFirstString(record, ["state", "province", "region", "country"])
  const address = getFirstString(record, ["address", "addressLine", "street"])
  const description =
    getFirstString(record, ["description", "longDescription"]) ??
    findFirstNestedString(record.descriptions, ["description"]) ??
    "Hotel disponible mediante integración HyperGuest."
  const shortDescription =
    getFirstString(record, ["shortDescription", "summary"]) ??
    description.slice(0, 160)

  return {
    nombre: name,
    slug: slugify(name) || `hyperguest-${propertyId}`,
    descripcion: description,
    descripcion_corta: shortDescription,
    estrellas: getFirstNumber(record, ["stars", "starRating", "rating"]),
    direccion: address,
    ciudad: city,
    provincia: province,
    latitud: getFirstNumber(record, ["latitude", "lat"]),
    longitud: getFirstNumber(record, ["longitude", "lng", "lon"]),
    imagen_url: findFirstImageUrl(record),
    activo: true,
  }
}

function normalizeAvailabilityOffers(response: unknown): HyperGuestNormalizedOffer[] {
  const content = isRecord(response) && isRecord(response.content) ? response.content : response
  const results = isRecord(content) && Array.isArray(content.results) ? content.results : []
  const structuredOffers = results.flatMap((result) => {
    if (!isRecord(result) || !Array.isArray(result.rooms)) {
      return []
    }

    return result.rooms.flatMap((room) => {
      if (!isRecord(room) || !Array.isArray(room.ratePlans)) {
        return []
      }

      return room.ratePlans.flatMap((ratePlan) => {
        if (!isRecord(ratePlan)) {
          return []
        }

        const paymentAmount = getNestedRecord(ratePlan, [
          "payment",
          "chargeAmount",
        ])
        const amount =
          getNestedNumber(ratePlan, ["payment", "chargeAmount", "price"]) ??
          getNestedNumber(ratePlan, ["prices", "sell", "price"]) ??
          getNestedNumber(ratePlan, ["prices", "bar", "price"]) ??
          getNestedNumber(ratePlan, ["prices", "net", "price"])
        const currency =
          getNestedString(ratePlan, ["payment", "chargeAmount", "currency"]) ??
          getNestedString(ratePlan, ["prices", "sell", "currency"]) ??
          getNestedString(ratePlan, ["prices", "bar", "currency"]) ??
          getNestedString(ratePlan, ["prices", "net", "currency"])

        // Skip offers where HG didn't return a usable price — sending those
        // forward would just make /booking/pre-book fail validation.
        if (amount === null || amount <= 0 || !currency) {
          return []
        }

        const raw = {
          propertyId: result.propertyId,
          roomId: room.roomId,
          roomCode: room.roomTypeCode,
          ratePlanId: ratePlan.ratePlanId,
          rateCode: ratePlan.ratePlanCode,
          expectedPrice: paymentAmount
            ? {
                amount:
                  getFirstNumber(paymentAmount, ["price", "amount"]) ?? amount,
                currency:
                  getFirstString(paymentAmount, ["currency"]) ?? currency,
              }
            : {
                amount,
                currency,
              },
          // propertyRemarks / propertyInfo are duplicated on every offer so the
          // UI can render property-level context without holding the full
          // search response in client state.
          propertyRemarks: Array.isArray(result.remarks) ? result.remarks : [],
          propertyInfo: result.propertyInfo ?? null,
          room,
          ratePlan,
        }

        return [
          {
            id: [
              toStringValue(room.roomId),
              toStringValue(ratePlan.ratePlanId),
            ]
              .filter(Boolean)
              .join(":"),
            roomId: toStringValue(room.roomId),
            rateId: toStringValue(ratePlan.ratePlanId),
            roomName:
              getFirstString(room, ["roomName", "roomTypeCode"]) ?? "Habitacion",
            boardName: getFirstString(ratePlan, ["board", "ratePlanName"]),
            currency,
            totalAmount: amount,
            raw,
          },
        ]
      })
    })
  })

  if (structuredOffers.length > 0) {
    return structuredOffers.slice(0, 20)
  }

  const candidates = findRecords(response, (record) =>
    PRICE_KEYS.some((key) => toNumberValue(record[key]) !== null),
  )

  return candidates.slice(0, 20).map((record, index) => ({
    id: getFirstString(record, ["id", "offerId", "ratePlanId", "bookingCode"]),
    roomId: getFirstString(record, ["roomId", "room_id", "roomCode"]),
    rateId: getFirstString(record, ["rateId", "rate_id", "ratePlanId"]),
    roomName:
      getFirstString(record, ["roomName", "room_name", "name", "title"]) ??
      `Opcion ${index + 1}`,
    boardName: getFirstString(record, ["boardName", "board", "mealPlan"]),
    currency: getFirstString(record, ["currency", "currencyCode"]),
    totalAmount: getFirstNumber(record, PRICE_KEYS),
    raw: record,
  }))
}

function extractBookingId(response: unknown) {
  return findFirstNestedString(response, [
    "bookingId",
    "booking_id",
    "reservationId",
    "reservation_id",
    "id",
  ])
}

function extractBookingReference(response: unknown) {
  return findFirstNestedString(response, [
    "reference",
    "confirmationNumber",
    "confirmation_number",
    "locator",
    "pnr",
  ])
}

function extractTotalAmount(response: unknown) {
  // Prefer the agent-charging total from prebook/book responses; HG mirrors
  // any priceChange into payment.chargeAmount, so this matches what the
  // guest is actually billed.
  const rooms = extractPrebookResponseRooms(response)

  if (rooms.length > 0) {
    const total = rooms.reduce<number | null>((sum, room) => {
      const amount =
        getNestedNumber(room, ["payment", "chargeAmount", "price"]) ??
        getNestedNumber(room, ["prices", "sell", "price"]) ??
        getNestedNumber(room, ["prices", "net", "price"])

      if (amount === null) {
        return sum
      }

      return (sum ?? 0) + amount
    }, null)

    if (total !== null) {
      return total
    }
  }

  const candidates = findRecords(response, (record) =>
    PRICE_KEYS.some((key) => toNumberValue(record[key]) !== null),
  )

  return candidates.length > 0 ? getFirstNumber(candidates[0], PRICE_KEYS) : null
}

function buildPaxFromIntent(intent: {
  adults: number | null
  children: number | null
  rooms: number | null
  search_payload: HyperGuestJson | null
}) {
  const searchPayload = isRecord(intent.search_payload)
    ? intent.search_payload
    : {}
  const occupancyRaw = Array.isArray(searchPayload.occupancy)
    ? searchPayload.occupancy
    : null

  if (occupancyRaw && occupancyRaw.length > 0) {
    return occupancyRaw.map((room) => {
      if (!isRecord(room)) {
        return { adults: intent.adults ?? 1, children: [] as number[] }
      }

      const adults =
        toNumberValue(room.adults) ?? toNumberValue(room.adultsCount) ?? 1
      const ages = Array.isArray(room.childrenAges)
        ? (room.childrenAges
            .map((age) => toNumberValue(age))
            .filter((age): age is number => age !== null))
        : []

      return { adults, children: ages }
    })
  }

  const childAges = Array.from({ length: intent.children ?? 0 }, () => 7)

  return Array.from({ length: intent.rooms ?? 1 }, () => ({
    adults: intent.adults ?? 1,
    children: childAges,
  }))
}

function buildSearchObjectFromIntent(intent: {
  check_in: string | null
  check_out: string | null
  hyperguest_property_id: string
  adults: number | null
  children: number | null
  rooms: number | null
  search_payload: HyperGuestJson | null
}) {
  const searchPayload = isRecord(intent.search_payload)
    ? intent.search_payload
    : {}

  if (!intent.check_in || !intent.check_out) {
    throw new Error(
      "La reserva no tiene fechas de check-in/check-out cargadas.",
    )
  }

  const propertyId = Number(intent.hyperguest_property_id)

  if (!Number.isFinite(propertyId)) {
    throw new Error(
      "El intent de reserva no tiene un property ID de HyperGuest válido.",
    )
  }

  return {
    dates: {
      from: intent.check_in,
      to: intent.check_out,
    },
    propertyId,
    nationality:
      toStringValue(searchPayload.customerNationality) ??
      toStringValue(searchPayload.nationality) ??
      assertHyperGuestConfigured().defaultNationality,
    pax: buildPaxFromIntent(intent),
  }
}

function buildRoomFromOffer(selectedOffer: Record<string, unknown>) {
  const expectedPrice = isRecord(selectedOffer.expectedPrice)
    ? {
        amount:
          getFirstNumber(selectedOffer.expectedPrice, ["amount", "price"]) ?? 0,
        currency:
          getFirstString(selectedOffer.expectedPrice, ["currency"]) ??
          assertHyperGuestConfigured().defaultCurrency,
      }
    : {
        amount: 0,
        currency: assertHyperGuestConfigured().defaultCurrency,
      }

  const room = {
    roomId:
      toNumberValue(selectedOffer.roomId) ?? toStringValue(selectedOffer.roomId),
    roomCode:
      toStringValue(selectedOffer.roomCode) ??
      toStringValue(selectedOffer.roomTypeCode),
    ratePlanId:
      toNumberValue(selectedOffer.ratePlanId) ??
      toStringValue(selectedOffer.ratePlanId),
    rateCode:
      toStringValue(selectedOffer.rateCode) ??
      toStringValue(selectedOffer.ratePlanCode),
    expectedPrice,
  }

  return Object.fromEntries(
    Object.entries(room).filter(([, value]) => value !== null),
  )
}

// HG's prebook response is the canonical source of truth for the price.
// When the agent token is configured as charge=agent / chargeType=net, the
// authoritative amount to send back in /booking/create is
// payment.chargeAmount.price. If HG returns a priceChange block, that block
// already reflects the repriced amount and is mirrored in payment.chargeAmount.
function extractPrebookResponseRooms(
  response: unknown,
): UnknownRecord[] {
  if (!isRecord(response)) {
    return []
  }

  const content = isRecord(response.content) ? response.content : response
  const rooms = Array.isArray(content.rooms) ? content.rooms : null

  return rooms?.filter(isRecord) ?? []
}

function findPrebookRoomMatch(
  payloadRoom: Record<string, unknown>,
  prebookRooms: UnknownRecord[],
  fallbackIndex: number,
): UnknownRecord | null {
  if (prebookRooms.length === 0) {
    return null
  }

  const payloadRoomId = toNumberValue(payloadRoom.roomId)
  const payloadRoomCode = toStringValue(payloadRoom.roomCode)
  const payloadRateCode = toStringValue(payloadRoom.rateCode)
  const payloadRatePlanId = toNumberValue(payloadRoom.ratePlanId)

  const byRoomAndRate = prebookRooms.find((room) => {
    const roomMatches =
      (payloadRoomId !== null &&
        toNumberValue(room.roomId) === payloadRoomId) ||
      (payloadRoomCode !== null &&
        (toStringValue(room.roomCode) === payloadRoomCode ||
          toStringValue(room.roomTypeCode) === payloadRoomCode))
    const rateMatches =
      (payloadRateCode !== null &&
        (toStringValue(room.rateCode) === payloadRateCode ||
          toStringValue(room.ratePlanCode) === payloadRateCode)) ||
      (payloadRatePlanId !== null &&
        toNumberValue(room.ratePlanId) === payloadRatePlanId)

    return roomMatches && rateMatches
  })

  if (byRoomAndRate) {
    return byRoomAndRate
  }

  const byRoomOnly = prebookRooms.find((room) => {
    if (payloadRoomId !== null && toNumberValue(room.roomId) === payloadRoomId) {
      return true
    }

    if (
      payloadRoomCode !== null &&
      (toStringValue(room.roomCode) === payloadRoomCode ||
        toStringValue(room.roomTypeCode) === payloadRoomCode)
    ) {
      return true
    }

    return false
  })

  return byRoomOnly ?? prebookRooms[fallbackIndex] ?? prebookRooms[0] ?? null
}

function repriceRoomFromPrebook(
  payloadRoom: Record<string, unknown>,
  prebookRooms: UnknownRecord[],
  fallbackIndex: number,
): Record<string, unknown> {
  const match = findPrebookRoomMatch(payloadRoom, prebookRooms, fallbackIndex)

  if (!match) {
    return payloadRoom
  }

  // priceChange.toAmount mirrors payment.chargeAmount.price when HG repriced
  // the rate during prebook; reading from payment.chargeAmount keeps the
  // fallback chain simpler.
  const amount =
    getNestedNumber(match, ["payment", "chargeAmount", "price"]) ??
    getNestedNumber(match, ["priceChange", "toAmount", "price"]) ??
    getNestedNumber(match, ["priceChange", "toAmount"]) ??
    getNestedNumber(match, ["prices", "sell", "price"]) ??
    getNestedNumber(match, ["prices", "net", "price"])
  const currency =
    getNestedString(match, ["payment", "chargeAmount", "currency"]) ??
    getNestedString(match, ["priceChange", "toAmount", "currency"]) ??
    getNestedString(match, ["prices", "sell", "currency"]) ??
    getNestedString(match, ["prices", "net", "currency"])

  if (amount === null || currency === null) {
    return payloadRoom
  }

  return { ...payloadRoom, expectedPrice: { amount, currency } }
}

// HG occasionally rejects /booking/create with BN.402, putting the actual
// booking rate inside errorDetails (`booking rate: 62.38 USD`). Parsing it
// here lets us absorb late repricing the same way the certification script
// does for the multi-room scenarios.
function parsePriceFromBookError(response: unknown): {
  amount: number
  currency: string
  roomId: number | null
} | null {
  if (!isRecord(response)) {
    return null
  }

  const body = isRecord(response) ? response : null
  const candidate = body?.content && isRecord(body.content) ? body.content : body

  if (!candidate) {
    return null
  }

  if (toStringValue(candidate.errorCode) !== "BN.402") {
    return null
  }

  const details = toStringValue(candidate.errorDetails)

  if (!details) {
    return null
  }

  const priceMatch = details.match(/booking rate:\s*([\d.]+)\s+([A-Z]{3})/i)

  if (!priceMatch) {
    return null
  }

  const amount = Number(priceMatch[1])
  const currency = priceMatch[2]?.toUpperCase()

  if (!Number.isFinite(amount) || !currency) {
    return null
  }

  const roomMatch = details.match(/Room:\s*(\d+)/i)
  const roomId = roomMatch ? Number(roomMatch[1]) : null

  return { amount, currency, roomId: Number.isFinite(roomId) ? roomId : null }
}

function assertPrebookPayloadIsValid(payload: {
  search?: Record<string, unknown>
  rooms?: unknown
}) {
  const search = isRecord(payload.search) ? payload.search : null

  if (!search) {
    throw new Error("Falta el objeto search en el payload de pre-reserva.")
  }

  const propertyId = toNumberValue(search.propertyId)

  if (propertyId === null) {
    throw new Error(
      "El pre-reserva requiere search.propertyId numérico (revisar booking intent).",
    )
  }

  const dates = isRecord(search.dates) ? search.dates : null
  const from = toStringValue(dates?.from)
  const to = toStringValue(dates?.to)

  if (!from || !to) {
    throw new Error(
      "El pre-reserva requiere search.dates.from y search.dates.to.",
    )
  }

  const pax = Array.isArray(search.pax) ? search.pax : []

  if (pax.length === 0) {
    throw new Error("El pre-reserva requiere search.pax con al menos un cuarto.")
  }

  const rooms = Array.isArray(payload.rooms) ? payload.rooms : []

  if (rooms.length === 0) {
    throw new Error(
      "El pre-reserva requiere al menos un room con expectedPrice.",
    )
  }

  rooms.forEach((room, index) => {
    if (!isRecord(room)) {
      throw new Error(`El room #${index + 1} no es un objeto válido.`)
    }

    const expectedPrice = isRecord(room.expectedPrice) ? room.expectedPrice : null
    const amount = expectedPrice
      ? getFirstNumber(expectedPrice, ["amount", "price"])
      : null
    const currency = expectedPrice
      ? getFirstString(expectedPrice, ["currency"])
      : null

    if (amount === null || amount <= 0) {
      throw new Error(
        `El room #${index + 1} no tiene expectedPrice.amount válido.`,
      )
    }

    if (!currency) {
      throw new Error(
        `El room #${index + 1} no tiene expectedPrice.currency válido.`,
      )
    }
  })
}

function buildRoomsFromOffers(
  offers: Array<Record<string, unknown> | undefined> | undefined,
) {
  if (!offers || offers.length === 0) {
    return []
  }

  return offers
    .filter((offer): offer is Record<string, unknown> => Boolean(offer))
    .map(buildRoomFromOffer)
}

function pickSelectedOffers(input: HyperGuestPrebookInput) {
  if (input.selectedOffers && input.selectedOffers.length > 0) {
    return input.selectedOffers
  }

  return input.selectedOffer ? [input.selectedOffer] : []
}

function fillContact(contact?: HyperGuestGuestContact | null) {
  return {
    address: contact?.address?.trim() || "N/A",
    city: contact?.city?.trim() || "N/A",
    country: contact?.country?.trim() || "N/A",
    email: contact?.email?.trim() || "N/A",
    phone: contact?.phone?.trim() || "N/A",
    state: contact?.state?.trim() || "N/A",
    zip: contact?.zip?.trim() || "N/A",
  }
}

function buildGuestPayload(
  guest: HyperGuestGuestDetails,
  fallbackContact?: HyperGuestGuestContact | null,
  options?: { includeContact?: boolean },
) {
  const includeContact = options?.includeContact ?? Boolean(guest.contact)
  const payload: Record<string, unknown> = {
    name: { first: guest.firstName, last: guest.lastName },
    title: guest.title ?? "MR",
  }

  if (guest.birthDate) {
    payload.birthDate = guest.birthDate
  }

  if (includeContact) {
    payload.contact = fillContact(guest.contact ?? fallbackContact)
  }

  return payload
}

export class HyperGuestService {
  constructor(
    private readonly hyperGuestRepository: HyperGuestRepository,
    private readonly hotelsRepository: HotelsRepository,
  ) {}

  private createServiceException(operation: string, cause?: unknown) {
    return new HotelsServiceException(`hyperguest.${operation}`, cause)
  }

  private async getPropertyIdForHotel(hotelId?: string, propertyId?: string) {
    const config = assertHyperGuestConfigured()

    if (propertyId) {
      return propertyId
    }

    if (!hotelId) {
      return config.propertyId
    }

    const mapping =
      await this.hyperGuestRepository.findHotelMappingByHotelId(hotelId)

    return mapping?.hyperguest_property_id ?? config.propertyId
  }

  private buildOccupancy(
    input: HyperGuestAvailabilityInput,
  ): HyperGuestRoomOccupancy[] {
    if (input.occupancy && input.occupancy.length > 0) {
      return input.occupancy
    }

    const childrenAges = Array.from(
      { length: input.children ?? 0 },
      () => 7,
    )

    return Array.from({ length: input.rooms }, () => ({
      adults: input.adults,
      childrenAges,
      infants: input.infants ?? 0,
    }))
  }

  private buildSearchPayload(
    input: HyperGuestAvailabilityInput,
    occupancy: HyperGuestRoomOccupancy[],
  ) {
    const config = assertHyperGuestConfigured()
    const propertyId = input.propertyId ?? config.propertyId
    const checkInDate = new Date(`${input.checkIn}T00:00:00`)
    const checkOutDate = new Date(`${input.checkOut}T00:00:00`)
    const nights = Math.max(
      1,
      Math.round(
        (checkOutDate.getTime() - checkInDate.getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    )
    const guests = occupancy
      .map((room) => {
        const ages = room.childrenAges ?? []

        return ages.length > 0
          ? `${room.adults}-${ages.join(",")}`
          : `${room.adults}`
      })
      .join(".")

    return {
      checkIn: input.checkIn,
      nights,
      guests,
      hotelIds: propertyId,
      customerNationality: input.nationality ?? config.defaultNationality,
      currency: input.currency ?? config.defaultCurrency,
      ...input.providerPayload,
    }
  }

  private async createEvent(
    bookingIntentId: string | null,
    type: string,
    status: string,
    payload?: unknown,
    message?: string,
  ) {
    await this.hyperGuestRepository.createEvent({
      booking_intent_id: bookingIntentId,
      type,
      status,
      message: message ?? null,
      payload: (payload ?? null) as HyperGuestJson,
    })
  }

  async syncStaticData() {
    try {
      const config = assertHyperGuestConfigured()
      const now = new Date().toISOString()
      const hotelsListPayload = await getHyperGuestStaticHotels()
      const matches = findRecords(hotelsListPayload, (record) =>
        recordMatchesProperty(record, config.propertyId),
      )
      const listHotel = matches[0] ?? {
        id: config.propertyId,
        name: `Hotel HyperGuest ${config.propertyId}`,
      }
      const propertyStaticPayload = await getHyperGuestPropertyStaticData(
        config.propertyId,
      )
      const sourceHotel = isRecord(propertyStaticPayload)
        ? propertyStaticPayload
        : listHotel
      const localPayload = normalizeHotelPayload(sourceHotel, config.propertyId)
      const isCertProperty = isCertificationProperty(
        sourceHotel,
        config.propertyId,
      )
      // The cert property (19912) is hidden in production by default to avoid
      // bookable test inventory leaking to real users. While HG still hasn't
      // issued the LIVE token, set HYPERGUEST_PUBLISH_CERT_PROPERTY=true to
      // expose it. Outside production we always publish so local/staging
      // browsing keeps working.
      const shouldPublish =
        !isCertProperty ||
        config.publishCertProperty ||
        process.env.NODE_ENV !== "production"
      const existingMapping =
        await this.hyperGuestRepository.findHotelMappingByPropertyId(
          config.propertyId,
        )
      const existingHotel = existingMapping?.hotel_id
        ? await this.hotelsRepository.findById(existingMapping.hotel_id)
        : await this.hotelsRepository.findOne({ slug: localPayload.slug })
      const hotelPayload = {
        ...localPayload,
        activo: shouldPublish,
      }
      const hotel = existingHotel
        ? await this.hotelsRepository.updateById(existingHotel.id, hotelPayload)
        : await this.hotelsRepository.create(hotelPayload)

      if (!hotel) {
        throw new Error("No se pudo sincronizar el hotel local.")
      }

      const mapping = await this.hyperGuestRepository.upsertHotelMapping({
        hotel_id: hotel.id,
        hyperguest_property_id: config.propertyId,
        hyperguest_hotel_id:
          getFirstString(sourceHotel, ["hotelId", "hotel_id", "id"]) ??
          config.propertyId,
        hyperguest_payload: sourceHotel as HyperGuestJson,
        last_synced_at: now,
      })

      await this.createEvent(null, "static_sync", "success", {
        propertyId: config.propertyId,
        hotelId: hotel.id,
      })

      return {
        propertyId: config.propertyId,
        hotel,
        mapping,
        matchedRecords: matches.length,
        published: shouldPublish,
        syncedAt: now,
      }
    } catch (error) {
      throw this.createServiceException("syncStaticData", error)
    }
  }

  async searchAvailability(input: HyperGuestAvailabilityInput) {
    try {
      const propertyId = await this.getPropertyIdForHotel(
        input.hotelId,
        input.propertyId,
      )
      const occupancy = this.buildOccupancy(input)
      const totalAdults = occupancy.reduce(
        (sum, room) => sum + room.adults,
        0,
      )
      const totalChildren = occupancy.reduce(
        (sum, room) => sum + (room.childrenAges?.length ?? 0),
        0,
      )
      const totalInfants = occupancy.reduce(
        (sum, room) => sum + (room.infants ?? 0),
        0,
      )
      const queryPayload = this.buildSearchPayload(
        { ...input, propertyId },
        occupancy,
      )
      const persistedPayload = { ...queryPayload, occupancy }
      const intent = await this.hyperGuestRepository.createBookingIntent({
        usuario_id: input.userId ?? null,
        hotel_id: input.hotelId ?? null,
        hyperguest_property_id: propertyId,
        status: "search_started",
        check_in: input.checkIn,
        check_out: input.checkOut,
        rooms: occupancy.length,
        adults: totalAdults,
        children: totalChildren,
        infants: totalInfants,
        currency: input.currency ?? assertHyperGuestConfigured().defaultCurrency,
        search_payload: persistedPayload as unknown as HyperGuestJson,
      })

      await this.createEvent(
        intent.id,
        "availability_search",
        "started",
        persistedPayload,
      )

      const response = await searchHyperGuestAvailability(queryPayload)
      const offers = normalizeAvailabilityOffers(response)
      const updatedIntent = await this.hyperGuestRepository.updateBookingIntent(
        intent.id,
        {
          status: "searched",
          search_response: response as HyperGuestJson,
          total_amount: offers[0]?.totalAmount ?? extractTotalAmount(response),
        },
      )

      await this.createEvent(intent.id, "availability_search", "success", {
        offers: offers.length,
      })

      return {
        bookingIntent: updatedIntent,
        offers,
        response,
      }
    } catch (error) {
      throw this.createServiceException("searchAvailability", error)
    }
  }

  async prebook(input: HyperGuestPrebookInput) {
    try {
      const intent = await this.hyperGuestRepository.findBookingIntentById(
        input.bookingIntentId,
      )

      if (!intent) {
        throw new HotelsNotFoundException(`bookingIntent ${input.bookingIntentId}`)
      }

      const offers = pickSelectedOffers(input)
      const payload = {
        search: buildSearchObjectFromIntent(intent),
        rooms: buildRoomsFromOffers(offers),
        ...input.providerPayload,
      }

      assertPrebookPayloadIsValid(payload)

      await this.hyperGuestRepository.updateBookingIntent(intent.id, {
        status: "prebook_started",
        prebook_payload: payload as HyperGuestJson,
      })
      await this.createEvent(intent.id, "prebook", "started", payload)

      const response = await prebookHyperGuestReservation(payload)
      const updatedIntent = await this.hyperGuestRepository.updateBookingIntent(
        intent.id,
        {
          status: "prebooked",
          prebook_response: response as HyperGuestJson,
          total_amount: extractTotalAmount(response) ?? intent.total_amount,
        },
      )

      await this.createEvent(intent.id, "prebook", "success", response)

      return {
        bookingIntent: updatedIntent,
        response,
      }
    } catch (error) {
      throw this.createServiceException("prebook", error)
    }
  }

  async book(input: HyperGuestBookInput) {
    try {
      const intent = await this.hyperGuestRepository.findBookingIntentById(
        input.bookingIntentId,
      )

      if (!intent) {
        throw new HotelsNotFoundException(`bookingIntent ${input.bookingIntentId}`)
      }

      if (intent.usuario_id && input.userId && intent.usuario_id !== input.userId) {
        throw new Error("No tenes permiso para completar esta reserva.")
      }

      if (!intent.check_in || !intent.check_out) {
        throw new Error(
          "Faltan fechas de check-in/check-out en la reserva. Hacé una nueva búsqueda.",
        )
      }

      const prebookPayloadRooms =
        isRecord(intent.prebook_payload) &&
        Array.isArray(intent.prebook_payload.rooms)
          ? (intent.prebook_payload.rooms as Record<string, unknown>[])
          : []
      const baseRooms = buildRoomsFromOffers(prebookPayloadRooms)

      if (baseRooms.length === 0) {
        throw new Error(
          "No hay habitaciones pre-reservadas para esta intent. Iniciá un pre-book antes de reservar.",
        )
      }

      // HG repriced rates live in the prebook RESPONSE, never the payload we
      // sent. For agent/net tokens the canonical amount is
      // payment.chargeAmount.price; if we book with the stale search price
      // HG returns BN.402. Overwrite expectedPrice with the prebook value
      // before sending /booking/create.
      const prebookResponseRooms = extractPrebookResponseRooms(
        intent.prebook_response,
      )
      const repricedRooms = baseRooms.map((room, index) =>
        repriceRoomFromPrebook(room, prebookResponseRooms, index),
      )

      const leadContact = {
        ...fillContact(input.guest.contact),
        email: input.guest.email,
        phone: input.guest.phone ?? input.guest.contact?.phone ?? "N/A",
      }
      const leadGuestPayload = {
        ...buildGuestPayload(input.guest, input.guest.contact, {
          includeContact: false,
        }),
        contact: leadContact,
      }

      const buildRoomsWithGuests = (
        sourceRooms: Record<string, unknown>[],
      ) =>
        sourceRooms.map((room, index) => {
          const guestsForRoom = input.roomGuests?.[index] ?? [input.guest]

          return {
            ...room,
            guests: guestsForRoom.map((guest) =>
              buildGuestPayload(guest, input.guest.contact),
            ),
          }
        })

      const rooms = buildRoomsWithGuests(repricedRooms)

      const buildPayload = (
        roomsForRequest: Record<string, unknown>[],
      ): Record<string, unknown> => {
        const payload: Record<string, unknown> = {
          dates: {
            from: intent.check_in,
            to: intent.check_out,
          },
          propertyId: Number(intent.hyperguest_property_id),
          leadGuest: leadGuestPayload,
          reference: {
            agency: intent.id,
          },
          paymentDetails: {
            type: "external",
          },
          rooms: roomsForRequest,
          isTest: intent.hyperguest_property_id === "19912",
          groupBooking: false,
          ...input.providerPayload,
        }

        if (input.specialRequests && input.specialRequests.length > 0) {
          const firstRoom = roomsForRequest[0] as
            | Record<string, unknown>
            | undefined

          if (firstRoom) {
            firstRoom.specialRequests = input.specialRequests
          }
        }

        if (input.meta && input.meta.length > 0) {
          payload.meta = input.meta
        }

        return payload
      }

      const payload = buildPayload(rooms)

      await this.hyperGuestRepository.updateBookingIntent(intent.id, {
        status: "book_started",
        book_payload: payload as HyperGuestJson,
      })
      await this.createEvent(intent.id, "booking", "started", payload)

      let response: unknown
      let bookErrorForRetry: ReturnType<typeof parsePriceFromBookError> = null

      try {
        response = await createHyperGuestBooking(payload)
      } catch (error) {
        // HG returns 4xx on BN.402 which becomes HotelsServiceException.
        // Pull the embedded body so we can decide whether a retry helps.
        const cause = isRecord(error) && "cause" in error ? error.cause : null
        const message =
          (isRecord(cause) && toStringValue((cause as UnknownRecord).message)) ||
          (error instanceof Error ? error.message : null)
        const bodyMatch = message?.match(/HyperGuest API error \d+:\s*([\s\S]+)$/)
        const rawBody = bodyMatch?.[1]?.trim() ?? null
        let parsed: unknown = rawBody

        if (rawBody) {
          try {
            parsed = JSON.parse(rawBody)
          } catch {
            parsed = rawBody
          }
        }

        bookErrorForRetry = parsePriceFromBookError(parsed)

        if (!bookErrorForRetry) {
          throw error
        }
      }

      if (bookErrorForRetry) {
        const correctedRooms = repricedRooms.map((room) => {
          if (
            bookErrorForRetry?.roomId == null ||
            toNumberValue(room.roomId) === bookErrorForRetry.roomId
          ) {
            return {
              ...room,
              expectedPrice: {
                amount: bookErrorForRetry!.amount,
                currency: bookErrorForRetry!.currency,
              },
            }
          }

          return room
        })
        const retryPayload = buildPayload(buildRoomsWithGuests(correctedRooms))

        await this.createEvent(intent.id, "booking", "retry", {
          reason: "BN.402 price drift; reusing HG-reported booking rate.",
          correctedPrice: bookErrorForRetry,
        })

        response = await createHyperGuestBooking(retryPayload)
      }

      const providerBookingId = extractBookingId(response)
      const providerReference = extractBookingReference(response)
      const updatedIntent = await this.hyperGuestRepository.updateBookingIntent(
        intent.id,
        {
          status: "booked",
          provider_booking_id: providerBookingId,
          provider_reference: providerReference,
          book_response: response as HyperGuestJson,
          total_amount: extractTotalAmount(response) ?? intent.total_amount,
        },
      )

      await this.createEvent(intent.id, "booking", "success", {
        providerBookingId,
        providerReference,
      })

      return {
        bookingIntent: updatedIntent,
        response,
      }
    } catch (error) {
      throw this.createServiceException("book", error)
    }
  }

  async cancel(input: HyperGuestCancelInput) {
    try {
      const intent = await this.hyperGuestRepository.findBookingIntentById(
        input.bookingIntentId,
      )

      if (!intent) {
        throw new HotelsNotFoundException(`bookingIntent ${input.bookingIntentId}`)
      }

      if (intent.usuario_id && input.userId && intent.usuario_id !== input.userId) {
        throw new Error("No tenes permiso para cancelar esta reserva.")
      }

      const providerBookingId =
        input.providerBookingId ?? intent.provider_booking_id

      if (!providerBookingId) {
        throw new Error("La reserva no tiene identificador de HyperGuest.")
      }

      const payload = {
        reason: input.reason ?? "Cancelacion solicitada por el usuario.",
        simulation: false,
        ...input.providerPayload,
      }

      await this.hyperGuestRepository.updateBookingIntent(intent.id, {
        status: "cancel_started",
        cancel_payload: payload as HyperGuestJson,
      })
      await this.createEvent(intent.id, "cancel", "started", payload)

      const response = await cancelHyperGuestBooking(providerBookingId, payload)
      const updatedIntent = await this.hyperGuestRepository.updateBookingIntent(
        intent.id,
        {
          status: "cancelled",
          cancel_response: response as HyperGuestJson,
        },
      )

      await this.createEvent(intent.id, "cancel", "success", response)

      return {
        bookingIntent: updatedIntent,
        response,
      }
    } catch (error) {
      throw this.createServiceException("cancel", error)
    }
  }

  async listProviderBookings(query?: Record<string, string | number | boolean>) {
    try {
      return await listHyperGuestBookings(query)
    } catch (error) {
      throw this.createServiceException("listProviderBookings", error)
    }
  }
}

export function createHyperGuestService(
  hyperGuestRepository: HyperGuestRepository,
  hotelsRepository: HotelsRepository,
) {
  return new HyperGuestService(hyperGuestRepository, hotelsRepository)
}
