import { MercadoPagoConfigurationException } from "@/exceptions/payments/payments.exceptions"
import {
  getMercadoPagoConfig,
  getPaymentsAppUrl,
} from "@/lib/payments/payments.config"

interface MercadoPagoPreferenceItem {
  id: string
  title: string
  description?: string
  quantity: number
  unit_price: number
  currency_id: string
}

interface MercadoPagoPreferenceBody {
  items: MercadoPagoPreferenceItem[]
  external_reference: string
  notification_url: string
  statement_descriptor: string
  back_urls: {
    success: string
    failure: string
    pending: string
  }
  payer?: {
    email?: string
  }
  auto_return?: "approved"
  expires: true
  expiration_date_from: string
  expiration_date_to: string
}

export interface MercadoPagoPreferenceResponse {
  id: string
  init_point?: string | null
  sandbox_init_point?: string | null
}

export interface MercadoPagoPaymentResponse {
  id: number | string
  status?: string | null
  external_reference?: string | null
  payer?: {
    email?: string | null
  } | null
}

async function mercadopagoRequest<TResponse>(
  path: string,
  init: RequestInit,
  idempotencyKey?: string,
): Promise<TResponse> {
  const { apiBaseUrl, accessToken } = getMercadoPagoConfig()

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(idempotencyKey ? { "X-Idempotency-Key": idempotencyKey } : {}),
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  })

  if (!response.ok) {
    const errorBody = await response.text()

    throw new MercadoPagoConfigurationException(
      "mercadopagoRequest",
      new Error(
        `Mercado Pago API error ${response.status}: ${errorBody || response.statusText}`,
      ),
    )
  }

  return (await response.json()) as TResponse
}

export async function createCheckoutProPreference(
  body: MercadoPagoPreferenceBody,
) {
  return mercadopagoRequest<MercadoPagoPreferenceResponse>(
    "/checkout/preferences",
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    crypto.randomUUID(),
  )
}

export async function getMercadoPagoPayment(paymentId: string) {
  return mercadopagoRequest<MercadoPagoPaymentResponse>(
    `/v1/payments/${paymentId}`,
    {
      method: "GET",
    },
  )
}

export function buildMercadoPagoPreferenceBody(input: {
  reservationId: string
  title: string
  description?: string
  amount: number
  currency: string
  payerEmail?: string | null
  successPath: string
  failurePath: string
  pendingPath: string
}) {
  const appUrl = getPaymentsAppUrl()
  const { statementDescriptor } = getMercadoPagoConfig()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  return {
    items: [
      {
        id: input.reservationId,
        title: input.title,
        description: input.description,
        quantity: 1,
        unit_price: input.amount,
        currency_id: input.currency,
      },
    ],
    ...(input.payerEmail ? { payer: { email: input.payerEmail } } : {}),
    back_urls: {
      success: `${appUrl}${input.successPath}`,
      failure: `${appUrl}${input.failurePath}`,
      pending: `${appUrl}${input.pendingPath}`,
    },
    ...(appUrl.startsWith("https")
      ? { auto_return: "approved" as const }
      : {}),
    external_reference: input.reservationId,
    notification_url: `${appUrl}/api/webhooks/mercadopago`,
    statement_descriptor: statementDescriptor,
    expires: true as const,
    expiration_date_from: now.toISOString(),
    expiration_date_to: expiresAt.toISOString(),
  }
}
