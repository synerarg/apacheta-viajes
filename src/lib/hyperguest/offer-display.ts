type UnknownRecord = Record<string, unknown>

export interface OfferTaxDetail {
  description: string
  amount: number
  currency: string
  relation: "display" | "included" | "unknown"
  scope: string | null
  frequency: string | null
}

export interface OfferFeeDetail {
  description: string
  amount: number
  currency: string
  relation: "display" | "included" | "unknown"
  scope: string | null
  frequency: string | null
}

export interface OfferCancellationPolicy {
  daysBefore: number | null
  penaltyType: string | null
  amount: number | null
  fromCheckIn: string | null
}

export interface OfferNightlyPrice {
  date: string
  net: number | null
  sell: number | null
  currency: string | null
}

export interface OfferDetails {
  boardCode: string | null
  boardLabel: string
  rateName: string | null
  netAmount: number | null
  sellAmount: number | null
  currency: string | null
  searchCurrencyAmount: number | null
  searchCurrency: string | null
  taxes: OfferTaxDetail[]
  fees: OfferFeeDetail[]
  cancellationPolicies: OfferCancellationPolicy[]
  propertyRemarks: string[]
  ratePlanRemarks: string[]
  nightlyBreakdown: OfferNightlyPrice[]
  roomSize: number | null
  beddingDescription: string | null
  maxOccupancy: number | null
  isRefundable: boolean
}

const BOARD_LABELS: Record<string, string> = {
  RO: "Sin comidas (Room Only)",
  BB: "Desayuno (Bed & Breakfast)",
  HB: "Media pensión (Half Board)",
  FB: "Pensión completa (Full Board)",
  AI: "Todo incluido (All Inclusive)",
  UAI: "Ultra All Inclusive",
  CB: "Continental Breakfast",
  AB: "American Breakfast",
  EB: "English Breakfast",
  SC: "Self Catering",
}

export function getBoardLabel(code: string | null | undefined) {
  if (!code) return "Régimen sin especificar"

  const normalized = code.trim().toUpperCase()

  return BOARD_LABELS[normalized] ?? code
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function toNumberOrNull(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function toStringOrNull(value: unknown) {
  if (typeof value === "string" && value.trim().length > 0) return value.trim()
  if (typeof value === "number") return String(value)
  return null
}

function normalizeRelation(value: unknown): "display" | "included" | "unknown" {
  const str = toStringOrNull(value)?.toLowerCase()

  if (str === "display") return "display"
  if (str === "included") return "included"
  return "unknown"
}

function extractTaxes(prices: unknown): OfferTaxDetail[] {
  if (!isRecord(prices)) return []

  const taxesByKey = new Map<string, OfferTaxDetail>()

  for (const key of ["net", "sell", "bar"]) {
    const block = prices[key]
    if (!isRecord(block) || !Array.isArray(block.taxes)) continue

    for (const tax of block.taxes) {
      if (!isRecord(tax)) continue

      const description = toStringOrNull(tax.description) ?? "Impuesto"
      const dedupeKey = `${description}|${toStringOrNull(tax.scope)}|${toStringOrNull(tax.frequency)}`

      if (taxesByKey.has(dedupeKey)) continue

      taxesByKey.set(dedupeKey, {
        description,
        amount: toNumberOrNull(tax.amount) ?? 0,
        currency: toStringOrNull(tax.currency) ?? "",
        relation: normalizeRelation(tax.relation),
        scope: toStringOrNull(tax.scope),
        frequency: toStringOrNull(tax.frequency),
      })
    }
  }

  return Array.from(taxesByKey.values())
}

function extractFees(ratePlan: UnknownRecord): OfferFeeDetail[] {
  const collected: OfferFeeDetail[] = []
  const seen = new Set<string>()

  function pushFee(fee: unknown) {
    if (!isRecord(fee)) return

    const description = toStringOrNull(fee.description) ?? "Cargo"
    const dedupeKey = `${description}|${toStringOrNull(fee.scope)}|${toStringOrNull(fee.frequency)}`

    if (seen.has(dedupeKey)) return
    seen.add(dedupeKey)

    collected.push({
      description,
      amount: toNumberOrNull(fee.amount) ?? 0,
      currency: toStringOrNull(fee.currency) ?? "",
      relation: normalizeRelation(fee.relation),
      scope: toStringOrNull(fee.scope),
      frequency: toStringOrNull(fee.frequency),
    })
  }

  if (Array.isArray(ratePlan.fees)) {
    ratePlan.fees.forEach(pushFee)
  }

  if (isRecord(ratePlan.prices)) {
    for (const key of ["net", "sell", "bar"]) {
      const block = ratePlan.prices[key]
      if (isRecord(block) && Array.isArray(block.fees)) {
        block.fees.forEach(pushFee)
      }
    }
  }

  return collected
}

function extractCancellationPolicies(
  ratePlan: UnknownRecord,
): OfferCancellationPolicy[] {
  const policies = ratePlan.cancellationPolicies

  if (!Array.isArray(policies)) return []

  return policies
    .filter(isRecord)
    .map<OfferCancellationPolicy>((policy) => {
      const timeSetting = isRecord(policy.timeSetting) ? policy.timeSetting : {}
      const fromCheckInValue = toNumberOrNull(timeSetting.timeFromCheckIn)
      const fromCheckInUnit = toStringOrNull(timeSetting.timeFromCheckInType)
      const fromCheckIn =
        fromCheckInValue !== null
          ? `${fromCheckInValue} ${fromCheckInUnit ?? ""}`.trim()
          : null

      return {
        daysBefore: toNumberOrNull(policy.daysBefore),
        penaltyType: toStringOrNull(policy.penaltyType),
        amount: toNumberOrNull(policy.amount),
        fromCheckIn,
      }
    })
}

function extractNightly(ratePlan: UnknownRecord): OfferNightlyPrice[] {
  const breakdown = ratePlan.nightlyBreakdown

  if (!Array.isArray(breakdown)) return []

  return breakdown
    .filter(isRecord)
    .map<OfferNightlyPrice>((night) => {
      const prices = isRecord(night.prices) ? night.prices : {}
      const netBlock = isRecord(prices.net) ? prices.net : null
      const sellBlock = isRecord(prices.sell) ? prices.sell : null

      return {
        date: toStringOrNull(night.date) ?? "",
        net: netBlock ? toNumberOrNull(netBlock.price) : null,
        sell: sellBlock ? toNumberOrNull(sellBlock.price) : null,
        currency:
          (netBlock && toStringOrNull(netBlock.currency)) ||
          (sellBlock && toStringOrNull(sellBlock.currency)) ||
          null,
      }
    })
}

function extractStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => toStringOrNull(item))
    .filter((item): item is string => Boolean(item))
}

function describeBedding(settings: unknown): string | null {
  if (!isRecord(settings)) return null

  const beds = settings.beddingConfigurations

  if (!Array.isArray(beds) || beds.length === 0) return null

  return beds
    .filter(isRecord)
    .map((bed) => {
      const type = toStringOrNull(bed.type) ?? "Cama"
      const qty = toNumberOrNull(bed.quantity) ?? 1
      return qty > 1 ? `${qty} × ${type}` : type
    })
    .join(" + ")
}

function isPolicyRefundable(policy: OfferCancellationPolicy) {
  if (policy.daysBefore === null) return false
  if (policy.amount === null) return true
  return policy.amount === 0
}

export interface PropertyDisplay {
  photos: string[]
  facilities: string[]
  longDescription: string | null
  remarks: string[]
}

function collectStrings(value: unknown, keys: string[], depth = 0): string[] {
  if (depth > 6) return []

  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed && /^https?:\/\//i.test(trimmed) ? [trimmed] : []
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectStrings(item, keys, depth + 1))
  }

  if (!isRecord(value)) return []

  const direct = keys
    .map((key) => value[key])
    .flatMap((entry) => {
      if (typeof entry === "string" && entry.trim()) return [entry.trim()]
      return []
    })

  const nested = Object.values(value).flatMap((item) =>
    collectStrings(item, keys, depth + 1),
  )

  return [...direct, ...nested]
}

function collectFacilityNames(value: unknown, depth = 0): string[] {
  if (depth > 6) return []

  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed ? [trimmed] : []
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectFacilityNames(item, depth + 1))
  }

  if (!isRecord(value)) return []

  const nameKeys = ["name", "title", "label", "description"]
  const direct = nameKeys
    .map((key) => value[key])
    .filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0)
    .map((entry) => entry.trim())

  if (direct.length > 0) return direct

  return Object.values(value).flatMap((item) =>
    collectFacilityNames(item, depth + 1),
  )
}

export function extractPropertyDisplay(payload: unknown): PropertyDisplay {
  if (!isRecord(payload)) {
    return { photos: [], facilities: [], longDescription: null, remarks: [] }
  }

  const photoCollections = [
    payload.images,
    payload.photos,
    payload.media,
    payload.gallery,
  ]
  const photoUrlKeys = ["url", "uri", "imageUrl", "image_url", "href", "src"]
  const seenPhotos = new Set<string>()
  const photos: string[] = []

  for (const collection of photoCollections) {
    for (const url of collectStrings(collection, photoUrlKeys)) {
      if (seenPhotos.has(url)) continue
      seenPhotos.add(url)
      photos.push(url)
      if (photos.length >= 20) break
    }
    if (photos.length >= 20) break
  }

  const facilitySources = [
    payload.facilities,
    payload.amenities,
    payload.services,
    payload.features,
    payload.propertyFacilities,
    payload.hotelFacilities,
  ]
  const seenFacilities = new Set<string>()
  const facilities: string[] = []

  for (const source of facilitySources) {
    for (const name of collectFacilityNames(source)) {
      const key = name.toLowerCase()
      if (seenFacilities.has(key)) continue
      seenFacilities.add(key)
      facilities.push(name)
      if (facilities.length >= 40) break
    }
    if (facilities.length >= 40) break
  }

  const remarks = extractStringArray(payload.remarks)
  const longDescription =
    toStringOrNull(payload.description) ??
    toStringOrNull(payload.longDescription) ??
    null

  return { photos, facilities, longDescription, remarks }
}

export function extractOfferDetails(rawOffer: unknown): OfferDetails {
  const safeOffer = isRecord(rawOffer) ? rawOffer : {}
  const room = isRecord(safeOffer.room) ? safeOffer.room : {}
  const ratePlan = isRecord(safeOffer.ratePlan) ? safeOffer.ratePlan : {}
  const prices = isRecord(ratePlan.prices) ? ratePlan.prices : {}
  const netBlock = isRecord(prices.net) ? prices.net : null
  const sellBlock = isRecord(prices.sell) ? prices.sell : null
  const settings = isRecord(room.settings) ? room.settings : null

  const boardCode = toStringOrNull(ratePlan.board)
  const rateName = toStringOrNull(ratePlan.ratePlanName)
  const propertyRemarks = extractStringArray(safeOffer.propertyRemarks)
  const ratePlanRemarks = extractStringArray(ratePlan.remarks)
  const cancellationPolicies = extractCancellationPolicies(ratePlan)
  const isRefundable = cancellationPolicies.some(isPolicyRefundable)

  return {
    boardCode,
    boardLabel: getBoardLabel(boardCode ?? rateName),
    rateName,
    netAmount: netBlock ? toNumberOrNull(netBlock.price) : null,
    sellAmount: sellBlock ? toNumberOrNull(sellBlock.price) : null,
    currency:
      (netBlock && toStringOrNull(netBlock.currency)) ||
      (sellBlock && toStringOrNull(sellBlock.currency)) ||
      null,
    searchCurrencyAmount: netBlock
      ? toNumberOrNull(netBlock.searchCurrency)
      : sellBlock
        ? toNumberOrNull(sellBlock.searchCurrency)
        : null,
    searchCurrency: toStringOrNull(
      (isRecord(ratePlan.payment) &&
        isRecord((ratePlan.payment as UnknownRecord).chargeAmount) &&
        isRecord(
          ((ratePlan.payment as UnknownRecord).chargeAmount as UnknownRecord)
            .search,
        ) &&
        (
          ((ratePlan.payment as UnknownRecord).chargeAmount as UnknownRecord)
            .search as UnknownRecord
        ).currency) ||
        null,
    ),
    taxes: extractTaxes(prices),
    fees: extractFees(ratePlan),
    cancellationPolicies,
    propertyRemarks,
    ratePlanRemarks,
    nightlyBreakdown: extractNightly(ratePlan),
    roomSize: settings ? toNumberOrNull(settings.roomSize) : null,
    beddingDescription: describeBedding(settings),
    maxOccupancy: settings ? toNumberOrNull(settings.maxOccupancy) : null,
    isRefundable,
  }
}
