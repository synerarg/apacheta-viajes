import { createHmac, timingSafeEqual } from "node:crypto"

import { MercadoPagoConfigurationException } from "@/exceptions/payments/payments.exceptions"
import {
  getMercadoPagoWebhookSecret,
  getMercadoPagoWebhookToleranceMs,
} from "@/lib/payments/payments.config"

interface ParsedSignatureHeader {
  ts: string
  v1: string
}

export interface MercadoPagoWebhookSignatureValidationResult {
  enabled: boolean
  isValid: boolean
  reason: string | null
}

function parseSignatureHeader(signatureHeader: string | null): ParsedSignatureHeader | null {
  if (!signatureHeader) {
    return null
  }

  const parts = signatureHeader.split(",")
  const values = new Map<string, string>()

  for (const part of parts) {
    const [rawKey, rawValue] = part.split("=")
    const key = rawKey?.trim()
    const value = rawValue?.trim()

    if (key && value) {
      values.set(key, value)
    }
  }

  const ts = values.get("ts")
  const v1 = values.get("v1")

  if (!ts || !v1) {
    return null
  }

  return { ts, v1 }
}

function isTimestampWithinTolerance(ts: string) {
  const timestamp = Number(ts)

  if (!Number.isFinite(timestamp)) {
    return false
  }

  const toleranceMs = getMercadoPagoWebhookToleranceMs()

  return Math.abs(Date.now() - timestamp) <= toleranceMs
}

function buildManifest(dataId: string, requestId: string, ts: string) {
  return `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`
}

function compareHexDigests(expectedDigest: string, receivedDigest: string) {
  const expectedBuffer = Buffer.from(expectedDigest, "hex")
  const receivedBuffer = Buffer.from(receivedDigest, "hex")

  if (
    expectedBuffer.length === 0 ||
    expectedBuffer.length !== receivedBuffer.length
  ) {
    return false
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer)
}

export function validateMercadoPagoWebhookSignature(input: {
  dataId: string | null
  signatureHeader: string | null
  requestIdHeader: string | null
}): MercadoPagoWebhookSignatureValidationResult {
  const secret = getMercadoPagoWebhookSecret()

  if (!secret) {
    return {
      enabled: false,
      isValid: true,
      reason: "signature validation disabled",
    }
  }

  if (!input.dataId) {
    return {
      enabled: true,
      isValid: false,
      reason: "missing data.id",
    }
  }

  const parsedSignature = parseSignatureHeader(input.signatureHeader)

  if (!parsedSignature) {
    return {
      enabled: true,
      isValid: false,
      reason: "missing or invalid x-signature header",
    }
  }

  if (!input.requestIdHeader) {
    return {
      enabled: true,
      isValid: false,
      reason: "missing x-request-id header",
    }
  }

  if (!isTimestampWithinTolerance(parsedSignature.ts)) {
    return {
      enabled: true,
      isValid: false,
      reason: "timestamp outside tolerance window",
    }
  }

  const manifest = buildManifest(
    input.dataId,
    input.requestIdHeader,
    parsedSignature.ts,
  )
  const expectedDigest = createHmac("sha256", secret).update(manifest).digest("hex")
  const isValid = compareHexDigests(expectedDigest, parsedSignature.v1)

  return {
    enabled: true,
    isValid,
    reason: isValid ? null : "signature mismatch",
  }
}

export function assertMercadoPagoWebhookSecretInProduction() {
  if (process.env.NODE_ENV === "production" && !getMercadoPagoWebhookSecret()) {
    throw new MercadoPagoConfigurationException(
      "assertMercadoPagoWebhookSecretInProduction",
      new Error("Missing environment variable: MERCADOPAGO_WEBHOOK_SECRET"),
    )
  }
}
