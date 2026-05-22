import { HotelsServiceException } from "@/exceptions/hotels/hotels.exceptions"

function getEnvironmentVariable(name: string) {
  return process.env[name]?.trim() ?? null
}

function getRequiredEnvironmentVariable(name: string) {
  const value = getEnvironmentVariable(name)

  if (!value) {
    throw new HotelsServiceException(
      "getRequiredHyperGuestEnvironmentVariable",
      new Error(`Missing environment variable: ${name}`),
    )
  }

  return value
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "")
}

export interface HyperGuestConfig {
  authToken: string | null
  propertyId: string | null
  staticDataUrl: string
  propertyStaticDataUrlTemplate: string
  searchApiBaseUrl: string
  bookApiBaseUrl: string
  searchAvailabilityPath: string
  prebookPath: string
  bookingPath: string
  bookingListPath: string
  cancelPath: string
  authHeaderName: string
  authScheme: string | null
  requestTimeoutMs: number
  acceptEncoding: string | null
  defaultCurrency: string
  defaultNationality: string
  publishCertProperty: boolean
}

export function getHyperGuestConfig(): HyperGuestConfig {
  return {
    authToken: getEnvironmentVariable("HYPERGUEST_AUTH_TOKEN"),
    propertyId: getEnvironmentVariable("HYPERGUEST_PROPERTY_ID"),
    staticDataUrl:
      getEnvironmentVariable("HYPERGUEST_STATIC_DATA_URL") ??
      "https://hg-static.hyperguest.com/hotels.json",
    propertyStaticDataUrlTemplate:
      getEnvironmentVariable("HYPERGUEST_PROPERTY_STATIC_DATA_URL_TEMPLATE") ??
      "https://hg-static.hyperguest.com/{propertyId}/property-static.json",
    searchApiBaseUrl: trimTrailingSlash(
      getEnvironmentVariable("HYPERGUEST_SEARCH_API_BASE_URL") ??
        "https://search-api.hyperguest.io/2.0/",
    ),
    bookApiBaseUrl: trimTrailingSlash(
      getEnvironmentVariable("HYPERGUEST_BOOK_API_BASE_URL") ??
        "https://book-api.hyperguest.com/2.0/",
    ),
    searchAvailabilityPath:
      getEnvironmentVariable("HYPERGUEST_SEARCH_AVAILABILITY_PATH") ?? "/",
    prebookPath:
      getEnvironmentVariable("HYPERGUEST_PREBOOK_PATH") ?? "/booking/pre-book",
    bookingPath:
      getEnvironmentVariable("HYPERGUEST_BOOKING_PATH") ?? "/booking/create",
    bookingListPath:
      getEnvironmentVariable("HYPERGUEST_BOOKING_LIST_PATH") ?? "/booking/list",
    cancelPath:
      getEnvironmentVariable("HYPERGUEST_CANCEL_PATH") ?? "/booking/cancel",
    authHeaderName:
      getEnvironmentVariable("HYPERGUEST_AUTH_HEADER_NAME") ?? "Authorization",
    authScheme: getEnvironmentVariable("HYPERGUEST_AUTH_SCHEME") ?? "Bearer",
    requestTimeoutMs: Number(
      getEnvironmentVariable("HYPERGUEST_REQUEST_TIMEOUT_MS") ?? "300000",
    ),
    acceptEncoding: getEnvironmentVariable("HYPERGUEST_ACCEPT_ENCODING"),
    defaultCurrency:
      getEnvironmentVariable("HYPERGUEST_DEFAULT_CURRENCY") ?? "ARS",
    defaultNationality:
      getEnvironmentVariable("HYPERGUEST_DEFAULT_NATIONALITY") ?? "AR",
    // Set HYPERGUEST_PUBLISH_CERT_PROPERTY=true to publish the certification
    // property (19912) even in production. Useful while HG hasn't issued the
    // LIVE token; flip back to false once real properties are onboarded.
    publishCertProperty:
      getEnvironmentVariable("HYPERGUEST_PUBLISH_CERT_PROPERTY")
        ?.toLowerCase() === "true",
  }
}

export function assertHyperGuestConfigured() {
  const config = getHyperGuestConfig()

  return {
    ...config,
    authToken: getRequiredEnvironmentVariable("HYPERGUEST_AUTH_TOKEN"),
    propertyId: getRequiredEnvironmentVariable("HYPERGUEST_PROPERTY_ID"),
  }
}

export function isHyperGuestEnabled() {
  const config = getHyperGuestConfig()

  return Boolean(config.authToken && config.propertyId)
}
