#!/usr/bin/env node
// HyperGuest certification runner for property 19912.
// Runs the 12 test scenarios defined by TAM Srikanth (HyperGuest)
// and writes one JSON log per scenario so the full search → book → (cancel)
// trail can be shared with HyperGuest support.
//
// Usage:
//   node --env-file=.env.local scripts/hyperguest-certify.mjs
//   node --env-file=.env.local scripts/hyperguest-certify.mjs --only=2,3,7
//   node --env-file=.env.local scripts/hyperguest-certify.mjs --skip-multi-room
//   node --env-file=.env.local scripts/hyperguest-certify.mjs --cleanup
//
// Flags:
//   --only=<csv>          Run only the listed scenario IDs (e.g. --only=2,7,10)
//   --skip-multi-room     Skip scenarios 4, 5, 6 (multi-room)
//   --cleanup             After scenarios 2-9 and 12, also cancel the booking
//                         to leave the test property clean. Scenarios 10/11
//                         always run their own cancellation logic.
//   --check-in=YYYY-MM-DD Override default check-in (default: today + 30 days)
//   --nights=N            Override default nights (default: 2)
//
// Output:
//   scripts/hyperguest-certification-logs/<timestamp>/
//     00-summary.json
//     01-prebook-1room-1adult.json
//     02-1room-1adult.json
//     ...
//
// Notes:
// - HyperGuest dev token (1720...c6) CANNOT do Pre-Book. Scenario #1 will
//   intentionally fail; the captured response/error is what gets sent to HG
//   to coordinate certification of price validation separately.
// - isTest: true is forced on all booking payloads (property 19912 is the
//   official certification property).
// - The script does NOT touch Supabase. It calls HG directly.

import { mkdir, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, "..")

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

function trimSlash(value) {
  return String(value).replace(/\/+$/, "")
}

const env = {
  token: process.env.HYPERGUEST_AUTH_TOKEN,
  propertyId: process.env.HYPERGUEST_PROPERTY_ID || "19912",
  searchBase: trimSlash(
    process.env.HYPERGUEST_SEARCH_API_BASE_URL ||
      "https://search-api.hyperguest.io/2.0/",
  ),
  bookBase: trimSlash(
    process.env.HYPERGUEST_BOOK_API_BASE_URL ||
      "https://book-api.hyperguest.com/2.0/",
  ),
  searchPath: process.env.HYPERGUEST_SEARCH_AVAILABILITY_PATH || "/",
  prebookPath: process.env.HYPERGUEST_PREBOOK_PATH || "/booking/pre-book",
  bookingPath: process.env.HYPERGUEST_BOOKING_PATH || "/booking/create",
  listPath: process.env.HYPERGUEST_BOOKING_LIST_PATH || "/booking/list",
  cancelPath: process.env.HYPERGUEST_CANCEL_PATH || "/booking/cancel",
  authHeader: process.env.HYPERGUEST_AUTH_HEADER_NAME || "Authorization",
  authScheme: process.env.HYPERGUEST_AUTH_SCHEME || "Bearer",
  acceptEncoding: process.env.HYPERGUEST_ACCEPT_ENCODING || "gzip, deflate",
  defaultCurrency: process.env.HYPERGUEST_DEFAULT_CURRENCY || "ARS",
  defaultNationality: process.env.HYPERGUEST_DEFAULT_NATIONALITY || "AR",
  timeoutMs: Number(process.env.HYPERGUEST_REQUEST_TIMEOUT_MS || 300000),
}

if (!env.token) {
  console.error("[hg-certify] Missing HYPERGUEST_AUTH_TOKEN.")
  console.error("Run with: node --env-file=.env.local scripts/hyperguest-certify.mjs")
  process.exit(1)
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const out = { only: null, skipMultiRoom: false, cleanup: false, checkIn: null, nights: null }
  for (const arg of argv) {
    if (arg.startsWith("--only=")) {
      out.only = new Set(arg.slice(7).split(",").map((n) => Number(n.trim())).filter(Boolean))
    } else if (arg === "--skip-multi-room") {
      out.skipMultiRoom = true
    } else if (arg === "--cleanup") {
      out.cleanup = true
    } else if (arg.startsWith("--check-in=")) {
      out.checkIn = arg.slice(11)
    } else if (arg.startsWith("--nights=")) {
      out.nights = Number(arg.slice(9))
    }
  }
  return out
}

const args = parseArgs(process.argv.slice(2))

function today() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

function addDays(isoDate, days) {
  const d = new Date(`${isoDate}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

const defaultCheckIn = args.checkIn || addDays(today(), 30)
const defaultNights = args.nights || 2

// ---------------------------------------------------------------------------
// HTTP
// ---------------------------------------------------------------------------

function authHeaders(extra = {}) {
  return {
    Accept: "application/json",
    "Accept-Encoding": env.acceptEncoding,
    [env.authHeader]: `${env.authScheme} ${env.token}`,
    ...extra,
  }
}

async function httpRequest({ url, method, body, label }) {
  const start = Date.now()
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), env.timeoutMs)
  const requestBody = body ? JSON.stringify(body) : undefined
  const result = {
    label,
    request: { url, method, headers: redactedHeaders(), body: body ?? null },
    response: null,
    durationMs: 0,
    ok: false,
    error: null,
  }

  try {
    const response = await fetch(url, {
      method,
      headers: authHeaders(requestBody ? { "Content-Type": "application/json" } : {}),
      body: requestBody,
      signal: controller.signal,
    })

    const contentType = response.headers.get("content-type") ?? ""
    const text = await response.text()
    let parsed = text
    if (contentType.includes("application/json") && text) {
      try {
        parsed = JSON.parse(text)
      } catch {
        parsed = text
      }
    }

    result.response = {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: parsed,
    }
    result.ok = response.ok
  } catch (error) {
    result.error = error instanceof Error ? `${error.name}: ${error.message}` : String(error)
  } finally {
    clearTimeout(timer)
    result.durationMs = Date.now() - start
  }

  return result
}

function redactedHeaders() {
  return {
    [env.authHeader]: `${env.authScheme} ***redacted***`,
    "Accept-Encoding": env.acceptEncoding,
    Accept: "application/json",
  }
}

// ---------------------------------------------------------------------------
// HG API helpers
// ---------------------------------------------------------------------------

function buildSearchUrl({ checkIn, nights, guests, nationality, currency, extra = {} }) {
  const params = new URLSearchParams()
  params.set("checkIn", checkIn)
  params.set("nights", String(nights))
  params.set("guests", guests)
  params.set("hotelIds", env.propertyId)
  params.set("customerNationality", nationality || env.defaultNationality)
  if (currency) params.set("currency", currency)
  for (const [k, v] of Object.entries(extra)) {
    params.set(k, String(v))
  }
  const path = env.searchPath.startsWith("/") ? env.searchPath : `/${env.searchPath}`
  return `${env.searchBase}${path}?${params.toString()}`
}

function search(opts) {
  return httpRequest({ url: buildSearchUrl(opts), method: "GET", label: "search" })
}

function prebook(body) {
  return httpRequest({
    url: `${env.bookBase}${env.prebookPath}`,
    method: "POST",
    body,
    label: "prebook",
  })
}

function createBooking(body) {
  return httpRequest({
    url: `${env.bookBase}${env.bookingPath}`,
    method: "POST",
    body,
    label: "book",
  })
}

function listBookings(body = {}) {
  return httpRequest({
    url: `${env.bookBase}${env.listPath}`,
    method: "POST",
    body,
    label: "list",
  })
}

function cancelBooking(bookingId, reason) {
  const numericId = Number(bookingId)
  return httpRequest({
    url: `${env.bookBase}${env.cancelPath}`,
    method: "POST",
    body: {
      bookingId: Number.isFinite(numericId) ? numericId : bookingId,
      reason: reason ?? "Certification test cleanup",
      simulation: false,
    },
    label: "cancel",
  })
}

// ---------------------------------------------------------------------------
// Offer extraction
// ---------------------------------------------------------------------------

function getResults(searchResponse) {
  const body = searchResponse?.response?.body
  if (!body) return []
  const content = body.content && typeof body.content === "object" ? body.content : body
  return Array.isArray(content?.results) ? content.results : []
}

function flattenOffers(searchResponse) {
  const offers = []
  for (const result of getResults(searchResponse)) {
    if (!Array.isArray(result?.rooms)) continue
    for (const room of result.rooms) {
      if (!Array.isArray(room?.ratePlans)) continue
      for (const rate of room.ratePlans) {
        offers.push({ result, room, rate })
      }
    }
  }
  return offers
}

function offerToBookingRoom(offer) {
  const sellCurrency =
    offer.rate?.payment?.chargeAmount?.currency ??
    offer.rate?.prices?.sell?.currency ??
    offer.rate?.prices?.net?.currency ??
    env.defaultCurrency
  const sellAmount =
    offer.rate?.payment?.chargeAmount?.price ??
    offer.rate?.prices?.sell?.price ??
    offer.rate?.prices?.net?.price ??
    0
  return {
    roomId: offer.room.roomId,
    roomCode: offer.room.roomTypeCode,
    rateCode: offer.rate.ratePlanCode,
    expectedPrice: { amount: sellAmount, currency: sellCurrency },
  }
}

// Pull the validated price out of a prebook response so we can overwrite the
// expectedPrice we picked from search. HG sometimes re-quotes between search
// and book; prebook is the canonical way to lock the price.
function applyPrebookPrice(room, prebookStep) {
  const body = prebookStep?.response?.body
  const content = body?.content ?? body
  const prebookRooms = Array.isArray(content?.rooms) ? content.rooms : []
  // Try to match by roomId/rateCode first, then fall back to positional match.
  const match =
    prebookRooms.find(
      (r) =>
        Number(r?.roomId) === Number(room.roomId) ||
        String(r?.roomCode) === String(room.roomCode),
    ) ?? prebookRooms[0]
  if (!match) return room
  const price =
    match?.payment?.chargeAmount?.price ??
    match?.prices?.sell?.price ??
    match?.prices?.net?.price
  const currency =
    match?.payment?.chargeAmount?.currency ??
    match?.prices?.sell?.currency ??
    match?.prices?.net?.currency
  if (price == null || currency == null) return room
  return { ...room, expectedPrice: { amount: price, currency } }
}

function isOfferRefundable(offer) {
  const policies = offer.rate?.cancellationPolicies
  if (!Array.isArray(policies) || policies.length === 0) return true
  return policies.some((p) => {
    const isFullPenalty = p?.penaltyType === "percent" && Number(p?.amount) >= 100
    const isFarOut = Number(p?.daysBefore) >= 999
    return !(isFullPenalty && isFarOut)
  })
}

function isOfferNonRefundable(offer) {
  const policies = offer.rate?.cancellationPolicies
  if (!Array.isArray(policies) || policies.length === 0) return false
  return policies.some(
    (p) => p?.penaltyType === "percent" && Number(p?.amount) >= 100 && Number(p?.daysBefore) >= 999,
  )
}

function isOfferPackageRate(offer) {
  return Boolean(offer.rate?.ratePlanInfo?.isPackageRate)
}

function pickFirstOffer(searchResponse) {
  return flattenOffers(searchResponse)[0] ?? null
}

function pickOfferFor(searchResponse, predicate) {
  return flattenOffers(searchResponse).find(predicate) ?? null
}

function pickOfferByPax(searchResponse, adults, childrenAges = []) {
  const offers = flattenOffers(searchResponse)
  const childrenKey = JSON.stringify([...childrenAges].sort())
  return (
    offers.find((o) => {
      const sp = o.room?.searchedPax
      if (!sp) return false
      const spChildren = Array.isArray(sp.children) ? sp.children : []
      return Number(sp.adults) === adults && JSON.stringify([...spChildren].sort()) === childrenKey
    }) ?? offers[0] ?? null
  )
}

function pickOffersForMultiRoom(searchResponse, paxGroups) {
  const offers = flattenOffers(searchResponse)
  const used = new Set()
  const out = []
  for (const group of paxGroups) {
    const ages = JSON.stringify([...(group.childrenAges ?? [])].sort())
    const offer =
      offers.find((o) => {
        if (used.has(o)) return false
        const sp = o.room?.searchedPax
        if (!sp) return false
        const spChildren = Array.isArray(sp.children) ? sp.children : []
        return Number(sp.adults) === group.adults && JSON.stringify([...spChildren].sort()) === ages
      }) ??
      offers.find((o) => !used.has(o))
    if (!offer) {
      out.push(null)
    } else {
      used.add(offer)
      out.push(offer)
    }
  }
  return out
}

function isVirtualRatePlan(offer) {
  const code = String(offer.rate?.ratePlanCode ?? "")
  const info = offer.rate?.ratePlanInfo
  return Boolean(info?.virtual) || code.startsWith("V:")
}

function pickTwoDistinctRoomTypeOffers(searchResponse) {
  const all = flattenOffers(searchResponse)
  const real = all.filter((o) => !isVirtualRatePlan(o))
  const pool = real.length >= 2 ? real : all
  const first = pool[0]
  if (!first) return [null, null]
  const second =
    pool.find(
      (o) =>
        o.room.roomId !== first.room.roomId &&
        o.room.roomTypeCode !== first.room.roomTypeCode &&
        o.rate.ratePlanCode !== first.rate.ratePlanCode,
    ) ??
    pool.find(
      (o) => o.room.roomId !== first.room.roomId && o.rate.ratePlanCode !== first.rate.ratePlanCode,
    )
  return [first, second ?? null]
}

// ---------------------------------------------------------------------------
// Booking payload builder
// ---------------------------------------------------------------------------

const LEAD_GUEST = {
  birthDate: "1991-01-01",
  contact: {
    address: "Av. Apacheta 123",
    city: "Mendoza",
    country: "AR",
    email: "certification@apacheta-viajes.test",
    phone: "+5491100000000",
    state: "Mendoza",
    zip: "5500",
  },
  name: { first: "Apacheta", last: "Certification" },
  title: "MR",
}

function adultGuest(suffix = "") {
  return {
    birthDate: "1991-01-01",
    name: { first: `Adult${suffix}`, last: "Cert" },
    title: "MR",
  }
}

function childGuest(age) {
  const year = new Date().getUTCFullYear() - age
  return {
    birthDate: `${year}-06-15`,
    name: { first: `Child${age}`, last: "Cert" },
    title: "MR",
  }
}

function infantGuest() {
  const year = new Date().getUTCFullYear() - 1
  return {
    birthDate: `${year}-06-15`,
    name: { first: "Infant", last: "Cert" },
    title: "MR",
  }
}

function buildBookingBody({ checkIn, nights, rooms, paxGroups, meta }) {
  return {
    dates: { from: checkIn, to: addDays(checkIn, nights) },
    propertyId: Number(env.propertyId),
    leadGuest: LEAD_GUEST,
    reference: { agency: `cert-${Date.now()}` },
    paymentDetails: {
      type: "credit_card",
      details: {
        number: "4111111111111111",
        cvv: "123",
        expiry: { month: "12", year: String(new Date().getUTCFullYear() + 2) },
        name: { first: LEAD_GUEST.name.first, last: LEAD_GUEST.name.last },
      },
    },
    rooms: rooms.map((room, idx) => ({
      ...room,
      guests: paxGroups[idx] ?? [adultGuest()],
      specialRequests: idx === 0 ? ["Late check-in if possible (certification test)"] : undefined,
    })),
    meta: meta && meta.length > 0 ? meta : undefined,
    isTest: true,
    groupBooking: false,
  }
}

function extractBookingId(httpResult) {
  const body = httpResult?.response?.body
  const content = body?.content ?? body
  return (
    content?.bookingId ??
    content?.booking_id ??
    body?.bookingId ??
    body?.booking_id ??
    null
  )
}

// HG sometimes rejects a book with BN.402 (Validation Error) reporting the
// actual booking rate in the error string ("booking rate: 62.38 USD"). We
// retry once with that price to absorb the search→book price drift. This
// mirrors what the HG service is expected to do in production.
function parseRateFromBookError(bookStep) {
  const body = bookStep?.response?.body
  if (!body) return null
  if (body.errorCode !== "BN.402") return null
  const details = String(body.errorDetails ?? "")
  const match = details.match(/booking rate:\s*([\d.]+)\s+([A-Z]{3})/i)
  if (!match) return null
  const amount = Number(match[1])
  const currency = match[2]
  if (!Number.isFinite(amount)) return null
  return { amount, currency }
}

async function bookWithRetry(payload) {
  const first = await createBooking(payload)
  if (first.ok) return [first]
  const correctedPrice = parseRateFromBookError(first)
  if (!correctedPrice) return [first]
  // Apply the corrected price to the first room (single-room scenarios) — for
  // multi-room, HG names the offending Room/RatePlan in the error so we use
  // that to target the right room.
  const errDetails = String(first.response?.body?.errorDetails ?? "")
  const roomIdMatch = errDetails.match(/Room:\s*(\d+)/i)
  const targetRoomId = roomIdMatch ? Number(roomIdMatch[1]) : null
  const retryPayload = {
    ...payload,
    rooms: payload.rooms.map((r) => {
      if (targetRoomId == null || Number(r.roomId) === targetRoomId) {
        return { ...r, expectedPrice: correctedPrice }
      }
      return r
    }),
  }
  const retry = await createBooking(retryPayload)
  return [{ ...first, label: "book[attempt1]" }, { ...retry, label: "book[retry]" }]
}

// ---------------------------------------------------------------------------
// Scenarios
// ---------------------------------------------------------------------------

function buildResult(scenario, steps, outcome, notes) {
  return {
    scenario: scenario.id,
    name: scenario.name,
    timestamp: new Date().toISOString(),
    propertyId: env.propertyId,
    outcome,
    notes: notes ?? null,
    steps,
  }
}

async function scenario01(scenario) {
  const checkIn = defaultCheckIn
  const nights = defaultNights
  const searchStep = await search({ checkIn, nights, guests: "1" })
  const offer = pickFirstOffer(searchStep)
  if (!offer) {
    return buildResult(scenario, [searchStep], "fail", "No offers returned from search")
  }
  const room = offerToBookingRoom(offer)
  const prebookStep = await prebook({
    search: {
      dates: { from: checkIn, to: addDays(checkIn, nights) },
      propertyId: Number(env.propertyId),
      nationality: env.defaultNationality,
      pax: [{ adults: 1, children: [] }],
    },
    rooms: [room],
  })
  return buildResult(
    scenario,
    [searchStep, prebookStep],
    prebookStep.ok ? "pass" : "fail",
    prebookStep.ok ? null : "Pre-Book failed — share response with HG TAM to diagnose.",
  )
}

function paxFromPaxGroups(paxGroups) {
  // Adults = guests with adult birthDate (>= ~16 years ago). Children/infants
  // = the rest. The cert script uses synthetic guests so we can detect by
  // looking at the birthDate string we generated.
  const adultPrefix = "1991"
  return paxGroups.map((group) => {
    const adults = group.filter((g) => g.birthDate?.startsWith(adultPrefix)).length
    const children = group
      .filter((g) => !g.birthDate?.startsWith(adultPrefix))
      .map((g) => {
        const year = Number(g.birthDate?.slice(0, 4))
        const age = Number.isFinite(year) ? new Date().getUTCFullYear() - year : 7
        return age
      })
    return { adults, children }
  })
}

async function bookScenario(scenario, { checkIn, nights, guests, paxGroups, currency, nationality, predicate, cleanupAfter }) {
  const searchStep = await search({ checkIn, nights, guests, currency, nationality })
  const offer = predicate
    ? pickOfferFor(searchStep, predicate)
    : pickFirstOffer(searchStep)
  if (!offer) {
    return buildResult(scenario, [searchStep], "fail", "No matching offer in search response")
  }
  const baseRoom = offerToBookingRoom(offer)
  const prebookStep = await prebook({
    search: {
      dates: { from: checkIn, to: addDays(checkIn, nights) },
      propertyId: Number(env.propertyId),
      nationality: nationality || env.defaultNationality,
      pax: paxFromPaxGroups(paxGroups),
    },
    rooms: [baseRoom],
  })
  if (!prebookStep.ok) {
    return buildResult(scenario, [searchStep, prebookStep], "fail", "Pre-Book failed; cannot lock price for booking.")
  }
  const lockedRoom = applyPrebookPrice(baseRoom, prebookStep)
  const payload = buildBookingBody({ checkIn, nights, rooms: [lockedRoom], paxGroups })
  const bookSteps = await bookWithRetry(payload)
  const bookStep = bookSteps[bookSteps.length - 1]
  const steps = [searchStep, prebookStep, ...bookSteps]
  const bookingId = extractBookingId(bookStep)
  let notes = bookSteps.length > 1 && bookStep.ok ? "Book retried with HG-reported rate after BN.402 price drift." : null

  if (cleanupAfter && bookingId) {
    const cancelStep = await cancelBooking(bookingId, "Certification cleanup")
    steps.push(cancelStep)
    const cleanupNote = cancelStep.ok
      ? `Booking ${bookingId} cancelled after certification.`
      : `Booking ${bookingId} created but cleanup cancel failed.`
    notes = notes ? `${notes} ${cleanupNote}` : cleanupNote
  }
  return buildResult(scenario, steps, bookStep.ok ? "pass" : "fail", notes)
}

async function scenario02(scenario) {
  return bookScenario(scenario, {
    checkIn: defaultCheckIn,
    nights: defaultNights,
    guests: "1",
    paxGroups: [[adultGuest()]],
    cleanupAfter: args.cleanup,
  })
}

async function scenario03(scenario) {
  // Infants are encoded as low-age "children" in HG's guests param so the
  // booking's guest count matches the searched pax. The property classifies
  // ages <= maxInfantAge (2 for cert property) as infants internally.
  return bookScenario(scenario, {
    checkIn: defaultCheckIn,
    nights: defaultNights,
    guests: "2-8,1",
    paxGroups: [[adultGuest("A"), adultGuest("B"), childGuest(8), infantGuest()]],
    cleanupAfter: args.cleanup,
  })
}

async function multiRoomScenario(scenario, { checkIn, nights, guests, paxGroups, roomPicker, cleanupAfter }) {
  const searchStep = await search({ checkIn, nights, guests })
  const offers = roomPicker(searchStep)
  if (offers.some((o) => !o)) {
    return buildResult(scenario, [searchStep], "fail", "Multi-room search did not return one offer per requested room group")
  }
  const baseRooms = offers.map(offerToBookingRoom)
  // HG /booking/pre-book returns rooms:[] when called with multiple rooms at
  // once. Workaround: prebook each room individually so we can lock prices.
  const pax = paxFromPaxGroups(paxGroups)
  const prebookSteps = []
  const lockedRooms = []
  for (let i = 0; i < baseRooms.length; i++) {
    const step = await prebook({
      search: {
        dates: { from: checkIn, to: addDays(checkIn, nights) },
        propertyId: Number(env.propertyId),
        nationality: env.defaultNationality,
        pax: [pax[i] ?? { adults: 1, children: [] }],
      },
      rooms: [baseRooms[i]],
    })
    prebookSteps.push({ ...step, label: `prebook[room${i + 1}]` })
    if (!step.ok) {
      return buildResult(
        scenario,
        [searchStep, ...prebookSteps],
        "fail",
        `Per-room pre-book failed for room ${i + 1}; cannot lock multi-room price.`,
      )
    }
    lockedRooms.push(applyPrebookPrice(baseRooms[i], step))
  }
  const payload = buildBookingBody({ checkIn, nights, rooms: lockedRooms, paxGroups })
  const bookStep = await createBooking(payload)
  const steps = [searchStep, ...prebookSteps, bookStep]
  const bookingId = extractBookingId(bookStep)
  let notes = null

  if (cleanupAfter && bookingId) {
    const cancelStep = await cancelBooking(bookingId, "Certification cleanup")
    steps.push(cancelStep)
    notes = cancelStep.ok
      ? `Booking ${bookingId} cancelled after certification.`
      : `Booking ${bookingId} created but cleanup cancel failed.`
  }
  return buildResult(scenario, steps, bookStep.ok ? "pass" : "fail", notes)
}

async function scenario04(scenario) {
  return multiRoomScenario(scenario, {
    checkIn: defaultCheckIn,
    nights: defaultNights,
    guests: "2.1",
    paxGroups: [[adultGuest("A1"), adultGuest("A2")], [adultGuest("B1")]],
    roomPicker: (resp) =>
      pickOffersForMultiRoom(resp, [
        { adults: 2, childrenAges: [] },
        { adults: 1, childrenAges: [] },
      ]),
    cleanupAfter: args.cleanup,
  })
}

async function scenario05(scenario) {
  return multiRoomScenario(scenario, {
    checkIn: defaultCheckIn,
    nights: defaultNights,
    guests: "1-8.2-1",
    paxGroups: [
      [adultGuest("A"), childGuest(8)],
      [adultGuest("B1"), adultGuest("B2"), infantGuest()],
    ],
    roomPicker: (resp) =>
      pickOffersForMultiRoom(resp, [
        { adults: 1, childrenAges: [8] },
        { adults: 2, childrenAges: [1] },
      ]),
    cleanupAfter: args.cleanup,
  })
}

async function scenario06(scenario) {
  return multiRoomScenario(scenario, {
    checkIn: defaultCheckIn,
    nights: defaultNights,
    guests: "2.2",
    paxGroups: [
      [adultGuest("A1"), adultGuest("A2")],
      [adultGuest("B1"), adultGuest("B2")],
    ],
    roomPicker: pickTwoDistinctRoomTypeOffers,
    cleanupAfter: args.cleanup,
  })
}

async function scenario07(scenario) {
  return bookScenario(scenario, {
    checkIn: today(),
    nights: 1,
    guests: "2",
    paxGroups: [[adultGuest("A"), adultGuest("B")]],
    cleanupAfter: args.cleanup,
  })
}

async function scenario08(scenario) {
  return bookScenario(scenario, {
    checkIn: defaultCheckIn,
    nights: defaultNights,
    guests: "2",
    currency: "EUR",
    paxGroups: [[adultGuest("A"), adultGuest("B")]],
    cleanupAfter: args.cleanup,
  })
}

async function scenario09(scenario) {
  return bookScenario(scenario, {
    checkIn: defaultCheckIn,
    nights: defaultNights,
    guests: "2",
    nationality: "JP",
    paxGroups: [[adultGuest("A"), adultGuest("B")]],
    cleanupAfter: args.cleanup,
  })
}

async function scenario10(scenario) {
  const checkIn = addDays(today(), 45)
  const nights = defaultNights
  const paxGroups = [[adultGuest("A"), adultGuest("B")]]
  const searchStep = await search({ checkIn, nights, guests: "2" })
  const offer = pickOfferFor(searchStep, isOfferRefundable)
  if (!offer) {
    return buildResult(scenario, [searchStep], "fail", "No refundable offer found in search response")
  }
  const baseRoom = offerToBookingRoom(offer)
  const prebookStep = await prebook({
    search: {
      dates: { from: checkIn, to: addDays(checkIn, nights) },
      propertyId: Number(env.propertyId),
      nationality: env.defaultNationality,
      pax: paxFromPaxGroups(paxGroups),
    },
    rooms: [baseRoom],
  })
  if (!prebookStep.ok) {
    return buildResult(scenario, [searchStep, prebookStep], "fail", "Pre-Book failed; cannot lock refundable booking price.")
  }
  const lockedRoom = applyPrebookPrice(baseRoom, prebookStep)
  const payload = buildBookingBody({ checkIn, nights, rooms: [lockedRoom], paxGroups })
  const bookSteps = await bookWithRetry(payload)
  const bookStep = bookSteps[bookSteps.length - 1]
  const bookingId = extractBookingId(bookStep)
  if (!bookStep.ok || !bookingId) {
    return buildResult(scenario, [searchStep, prebookStep, ...bookSteps], "fail", "Could not create the refundable booking to cancel")
  }
  const cancelStep = await cancelBooking(bookingId, "Cancellation test (refundable)")
  return buildResult(
    scenario,
    [searchStep, prebookStep, ...bookSteps, cancelStep],
    cancelStep.ok ? "pass" : "fail",
    cancelStep.ok ? `Refundable booking ${bookingId} cancelled successfully.` : null,
  )
}

async function scenario11(scenario) {
  const checkIn = addDays(today(), 45)
  const nights = defaultNights
  const paxGroups = [[adultGuest("A"), adultGuest("B")]]
  const searchStep = await search({ checkIn, nights, guests: "2" })
  const offer = pickOfferFor(searchStep, isOfferNonRefundable)
  if (!offer) {
    return buildResult(
      scenario,
      [searchStep],
      "skipped",
      "No non-refundable offer found on certification property at this date range.",
    )
  }
  const baseRoom = offerToBookingRoom(offer)
  const prebookStep = await prebook({
    search: {
      dates: { from: checkIn, to: addDays(checkIn, nights) },
      propertyId: Number(env.propertyId),
      nationality: env.defaultNationality,
      pax: paxFromPaxGroups(paxGroups),
    },
    rooms: [baseRoom],
  })
  if (!prebookStep.ok) {
    return buildResult(scenario, [searchStep, prebookStep], "fail", "Pre-Book failed; cannot lock non-refundable booking price.")
  }
  const lockedRoom = applyPrebookPrice(baseRoom, prebookStep)
  const payload = buildBookingBody({ checkIn, nights, rooms: [lockedRoom], paxGroups })
  const bookSteps = await bookWithRetry(payload)
  const bookStep = bookSteps[bookSteps.length - 1]
  const bookingId = extractBookingId(bookStep)
  if (!bookStep.ok || !bookingId) {
    return buildResult(scenario, [searchStep, prebookStep, ...bookSteps], "fail", "Could not create the non-refundable booking")
  }
  const cancelStep = await cancelBooking(bookingId, "Cancellation test (non-refundable rate)")
  const cancelBody = cancelStep.response?.body ?? {}
  const cancelContent = cancelBody.content ?? cancelBody
  const penalty =
    cancelContent?.payment?.chargeAmount ??
    cancelContent?.prices?.sell ??
    cancelContent?.prices?.net ??
    null
  const notes = cancelStep.ok
    ? `Non-refundable cancel processed by HG. Full penalty applied: ${penalty ? `${penalty.price ?? penalty.amount} ${penalty.currency}` : "see response"}.`
    : "Non-refundable cancel was rejected by HG."
  return buildResult(scenario, [searchStep, prebookStep, ...bookSteps, cancelStep], "pass", notes)
}

async function scenario12(scenario) {
  const paxGroups = [[adultGuest("A"), adultGuest("B")]]
  const searchStep = await search({ checkIn: defaultCheckIn, nights: defaultNights, guests: "2" })
  const offer = pickOfferFor(searchStep, isOfferPackageRate)
  if (!offer) {
    return buildResult(
      scenario,
      [searchStep],
      "skipped",
      "Certification property does not expose a package rate (isPackageRate=true) at this date range.",
    )
  }
  const baseRoom = offerToBookingRoom(offer)
  const prebookStep = await prebook({
    search: {
      dates: { from: defaultCheckIn, to: addDays(defaultCheckIn, defaultNights) },
      propertyId: Number(env.propertyId),
      nationality: env.defaultNationality,
      pax: paxFromPaxGroups(paxGroups),
    },
    rooms: [baseRoom],
  })
  if (!prebookStep.ok) {
    return buildResult(scenario, [searchStep, prebookStep], "fail", "Pre-Book failed; cannot lock package-rate booking price.")
  }
  const lockedRoom = applyPrebookPrice(baseRoom, prebookStep)
  const payload = buildBookingBody({
    checkIn: defaultCheckIn,
    nights: defaultNights,
    rooms: [lockedRoom],
    paxGroups,
  })
  const bookSteps = await bookWithRetry(payload)
  const bookStep = bookSteps[bookSteps.length - 1]
  const steps = [searchStep, prebookStep, ...bookSteps]
  const bookingId = extractBookingId(bookStep)
  let notes = bookSteps.length > 1 && bookStep.ok ? "Book retried with HG-reported rate after BN.402 price drift." : null
  if (args.cleanup && bookingId) {
    const cancelStep = await cancelBooking(bookingId, "Certification cleanup")
    steps.push(cancelStep)
    const cleanupNote = cancelStep.ok
      ? `Package-rate booking ${bookingId} cancelled after certification.`
      : `Package-rate booking ${bookingId} created but cleanup cancel failed.`
    notes = notes ? `${notes} ${cleanupNote}` : cleanupNote
  }
  return buildResult(scenario, steps, bookStep.ok ? "pass" : "fail", notes)
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

const scenarios = [
  { id: 1, name: "Pre-Book: 1 room, 1 adult", multiRoom: false, fn: scenario01 },
  { id: 2, name: "Book: 1 room, 1 adult", multiRoom: false, fn: scenario02 },
  { id: 3, name: "Book: 1 room, 2 adults + 1 child + 1 infant", multiRoom: false, fn: scenario03 },
  { id: 4, name: "Book: 2 rooms (2 adults) + (1 adult)", multiRoom: true, fn: scenario04 },
  { id: 5, name: "Book: 2 rooms (1 adult + 1 child) + (2 adults + 1 infant)", multiRoom: true, fn: scenario05 },
  { id: 6, name: "Book: 2 rooms with different room types and rate plans", multiRoom: true, fn: scenario06 },
  { id: 7, name: "Book: 1 room, 2 adults, same-day check-in", multiRoom: false, fn: scenario07 },
  { id: 8, name: "Book: 1 room, 2 adults, currency conversion (EUR)", multiRoom: false, fn: scenario08 },
  { id: 9, name: "Book: 1 room, 2 adults, nationality JP", multiRoom: false, fn: scenario09 },
  { id: 10, name: "Cancel a refundable reservation", multiRoom: false, fn: scenario10 },
  { id: 11, name: "Attempt to cancel a non-refundable reservation", multiRoom: false, fn: scenario11 },
  { id: 12, name: "Book: 1 room, 2 adults, package rate (if available)", multiRoom: false, fn: scenario12 },
]

function slug(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

async function run() {
  const runId = new Date().toISOString().replace(/[:.]/g, "-")
  const outDir = join(ROOT, "scripts", "hyperguest-certification-logs", runId)
  await mkdir(outDir, { recursive: true })

  const summary = {
    runId,
    startedAt: new Date().toISOString(),
    finishedAt: null,
    propertyId: env.propertyId,
    searchBaseUrl: env.searchBase,
    bookBaseUrl: env.bookBase,
    defaultCheckIn,
    defaultNights,
    args,
    scenarios: [],
  }

  console.log(`\n[hg-certify] HyperGuest certification run`)
  console.log(`[hg-certify] propertyId=${env.propertyId}`)
  console.log(`[hg-certify] check-in=${defaultCheckIn} nights=${defaultNights}`)
  console.log(`[hg-certify] output=${outDir}\n`)

  for (const scenario of scenarios) {
    if (args.only && !args.only.has(scenario.id)) continue
    if (args.skipMultiRoom && scenario.multiRoom) {
      summary.scenarios.push({
        id: scenario.id,
        name: scenario.name,
        outcome: "skipped",
        notes: "multi-room disabled by --skip-multi-room",
      })
      console.log(`#${String(scenario.id).padStart(2, "0")} skipped (multi-room) — ${scenario.name}`)
      continue
    }

    process.stdout.write(`#${String(scenario.id).padStart(2, "0")} running   — ${scenario.name} ... `)
    let result
    try {
      result = await scenario.fn(scenario)
    } catch (error) {
      result = buildResult(
        scenario,
        [],
        "fail",
        `Uncaught exception: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
    const fileName = `${String(scenario.id).padStart(2, "0")}-${slug(scenario.name)}.json`
    await writeFile(join(outDir, fileName), JSON.stringify(result, null, 2))
    summary.scenarios.push({ id: scenario.id, name: scenario.name, outcome: result.outcome, file: fileName, notes: result.notes })
    console.log(`${result.outcome}${result.notes ? ` — ${result.notes}` : ""}`)
  }

  summary.finishedAt = new Date().toISOString()
  await writeFile(join(outDir, "00-summary.json"), JSON.stringify(summary, null, 2))

  console.log(`\n[hg-certify] done. ${summary.scenarios.length} scenarios written to:`)
  console.log(`  ${outDir}`)
  console.log(`\nSend the full folder (00-summary.json + per-scenario files) to Srikanth at HyperGuest.`)
}

run().catch((error) => {
  console.error("[hg-certify] fatal error:", error)
  process.exit(1)
})
