import { HotelesServiceException } from "@/exceptions/hoteles/hoteles.exceptions"
import {
  assertHyperGuestConfigured,
  type HyperGuestConfig,
} from "@/lib/hyperguest/hyperguest.config"

type HyperGuestService = "static" | "search" | "book"

interface HyperGuestRequestOptions
  extends Omit<RequestInit, "body" | "headers" | "signal"> {
  body?: BodyInit | object | null
  headers?: HeadersInit
  service?: HyperGuestService
  path?: string
  timeoutMs?: number
}

function getBaseUrl(service: HyperGuestService, config: HyperGuestConfig) {
  switch (service) {
    case "static":
      return config.staticDataUrl
    case "search":
      return config.searchApiBaseUrl
    case "book":
      return config.bookApiBaseUrl
    default:
      return config.searchApiBaseUrl
  }
}

function buildUrl(
  service: HyperGuestService,
  path: string | undefined,
  config: HyperGuestConfig,
) {
  if (path?.startsWith("http://") || path?.startsWith("https://")) {
    return path
  }

  const baseUrl = getBaseUrl(service, config)

  if (service === "static") {
    return path ? `${baseUrl}${path}` : baseUrl
  }

  const normalizedPath = path?.startsWith("/") ? path : `/${path ?? ""}`

  return `${baseUrl}${normalizedPath}`.replace(/([^:]\/)\/+/g, "$1")
}

function buildStaticPropertyUrl(propertyId: string, config: HyperGuestConfig) {
  return config.propertyStaticDataUrlTemplate.replace(
    "{propertyId}",
    encodeURIComponent(propertyId),
  )
}

function buildAuthHeaderValue(config: HyperGuestConfig) {
  if (!config.authToken) {
    return null
  }

  return config.authScheme
    ? `${config.authScheme} ${config.authToken}`
    : config.authToken
}

function buildHeaders(
  config: HyperGuestConfig,
  initHeaders?: HeadersInit,
  hasJsonBody?: boolean,
) {
  const headers = new Headers(initHeaders)
  const authHeaderValue = buildAuthHeaderValue(config)

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json")
  }

  if (hasJsonBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  if (config.acceptEncoding && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", config.acceptEncoding)
  }

  if (authHeaderValue && !headers.has(config.authHeaderName)) {
    headers.set(config.authHeaderName, authHeaderValue)
  }

  return headers
}

function normalizeBody(
  body: HyperGuestRequestOptions["body"],
): BodyInit | null | undefined {
  if (!body || typeof body !== "object" || body instanceof FormData) {
    return body
  }

  if (
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body)
  ) {
    return body as BodyInit
  }

  return JSON.stringify(body)
}

export async function hyperGuestRequest<TResponse>(
  options: HyperGuestRequestOptions,
): Promise<TResponse> {
  const config = assertHyperGuestConfigured()
  const service = options.service ?? "search"
  const url = buildUrl(service, options.path, config)
  const timeoutMs = options.timeoutMs ?? config.requestTimeoutMs
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  const normalizedBody = normalizeBody(options.body)
  const hasJsonBody = typeof normalizedBody === "string"

  try {
    const response = await fetch(url, {
      ...options,
      headers: buildHeaders(config, options.headers, hasJsonBody),
      body: normalizedBody,
      signal: controller.signal,
      cache: "no-store",
    })

    if (!response.ok) {
      const errorBody = await response.text()

      throw new HotelesServiceException(
        "hyperGuestRequest",
        new Error(
          `HyperGuest API error ${response.status}: ${errorBody || response.statusText}`,
        ),
      )
    }

    const contentType = response.headers.get("content-type") ?? ""

    if (contentType.includes("application/json")) {
      return (await response.json()) as TResponse
    }

    return (await response.text()) as TResponse
  } catch (error) {
    if (error instanceof HotelesServiceException) {
      throw error
    }

    throw new HotelesServiceException("hyperGuestRequest", error)
  } finally {
    clearTimeout(timeout)
  }
}

export async function getHyperGuestStaticHotels<TResponse = unknown>() {
  return hyperGuestRequest<TResponse>({
    method: "GET",
    service: "static",
  })
}

export async function getHyperGuestPropertyStaticData<TResponse = unknown>(
  propertyId: string,
) {
  const config = assertHyperGuestConfigured()

  return hyperGuestRequest<TResponse>({
    method: "GET",
    service: "static",
    path: buildStaticPropertyUrl(propertyId, config),
  })
}

export async function searchHyperGuestAvailability<TResponse = unknown>(
  query: Record<string, string | number | boolean | null | undefined>,
) {
  const config = assertHyperGuestConfigured()
  const searchParams = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.set(key, String(value))
    }
  })

  const queryString = searchParams.toString()

  return hyperGuestRequest<TResponse>({
    method: "GET",
    service: "search",
    path: queryString
      ? `${config.searchAvailabilityPath}?${queryString}`
      : config.searchAvailabilityPath,
  })
}

export async function prebookHyperGuestReservation<TResponse = unknown>(
  body: object,
) {
  const config = assertHyperGuestConfigured()

  return hyperGuestRequest<TResponse>({
    method: "POST",
    service: "book",
    path: config.prebookPath,
    body,
  })
}

export async function createHyperGuestBooking<TResponse = unknown>(body: object) {
  const config = assertHyperGuestConfigured()

  return hyperGuestRequest<TResponse>({
    method: "POST",
    service: "book",
    path: config.bookingPath,
    body,
  })
}

export async function listHyperGuestBookings<TResponse = unknown>(
  body?: object,
) {
  const config = assertHyperGuestConfigured()

  return hyperGuestRequest<TResponse>({
    method: "POST",
    service: "book",
    path: config.bookingListPath,
    body: body ?? {},
  })
}

export async function cancelHyperGuestBooking<TResponse = unknown>(
  bookingId: string | number,
  body?: object,
) {
  const config = assertHyperGuestConfigured()
  const numericId =
    typeof bookingId === "number" ? bookingId : Number(bookingId)

  return hyperGuestRequest<TResponse>({
    method: "POST",
    service: "book",
    path: config.cancelPath,
    body: {
      bookingId: Number.isFinite(numericId) ? numericId : bookingId,
      ...(body ?? {}),
    },
  })
}
