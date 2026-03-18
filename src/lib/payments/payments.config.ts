import {
  BankTransferConfigurationException,
  MercadoPagoConfigurationException,
} from "@/exceptions/payments/payments.exceptions"

function getEnvironmentVariable(name: string) {
  return process.env[name]?.trim()
}

function getRequiredEnvironmentVariable(
  name: string,
  ExceptionClass:
    | typeof MercadoPagoConfigurationException
    | typeof BankTransferConfigurationException,
) {
  const value = getEnvironmentVariable(name)

  if (!value) {
    throw new ExceptionClass(
      "getRequiredEnvironmentVariable",
      new Error(`Missing environment variable: ${name}`),
    )
  }

  return value
}

export function getPaymentsAppUrl() {
  return (
    getEnvironmentVariable("NEXT_PUBLIC_APP_URL") ??
    getEnvironmentVariable("NEXT_PUBLIC_SITE_URL") ??
    "http://localhost:3000"
  )
}

export function getMercadoPagoConfig() {
  return {
    apiBaseUrl:
      getEnvironmentVariable("MERCADOPAGO_API_BASE_URL") ??
      "https://api.mercadopago.com",
    accessToken: getRequiredEnvironmentVariable(
      "MERCADOPAGO_ACCESS_TOKEN",
      MercadoPagoConfigurationException,
    ),
    statementDescriptor:
      getEnvironmentVariable("MERCADOPAGO_STATEMENT_DESCRIPTOR") ?? "APACHETA",
  }
}

export function getMercadoPagoWebhookSecret() {
  return getEnvironmentVariable("MERCADOPAGO_WEBHOOK_SECRET") ?? null
}

export function getMercadoPagoWebhookToleranceMs() {
  return Number(
    getEnvironmentVariable("MERCADOPAGO_WEBHOOK_TOLERANCE_MS") ?? "300000",
  )
}

export function getBankTransferConfig() {
  return {
    bankName: getRequiredEnvironmentVariable(
      "BANK_TRANSFER_BANK_NAME",
      BankTransferConfigurationException,
    ),
    accountHolder: getRequiredEnvironmentVariable(
      "BANK_TRANSFER_ACCOUNT_HOLDER",
      BankTransferConfigurationException,
    ),
    taxId: getEnvironmentVariable("BANK_TRANSFER_ACCOUNT_TAX_ID") ?? null,
    alias: getRequiredEnvironmentVariable(
      "BANK_TRANSFER_ALIAS",
      BankTransferConfigurationException,
    ),
    cbu: getRequiredEnvironmentVariable(
      "BANK_TRANSFER_CBU",
      BankTransferConfigurationException,
    ),
    receiptEmail: getEnvironmentVariable("BANK_TRANSFER_RECEIPT_EMAIL") ?? null,
    paymentWindowHours: Number(
      getEnvironmentVariable("BANK_TRANSFER_PAYMENT_WINDOW_HOURS") ?? "24",
    ),
    receiptBucket: getRequiredEnvironmentVariable(
      "BANK_TRANSFER_RECEIPT_BUCKET",
      BankTransferConfigurationException,
    ),
    receiptMaxBytes: Number(
      getEnvironmentVariable("BANK_TRANSFER_RECEIPT_MAX_BYTES") ?? "10485760",
    ),
    allowedReceiptMimeTypes: (
      getEnvironmentVariable("BANK_TRANSFER_ALLOWED_MIME_TYPES") ??
      "application/pdf,image/jpeg,image/png,image/webp"
    )
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    receiptMaxReuploads: Number(
      getEnvironmentVariable("BANK_TRANSFER_RECEIPT_MAX_REUPLOADS") ?? "3",
    ),
    receiptSignedUrlTtlSeconds: Number(
      getEnvironmentVariable("BANK_TRANSFER_RECEIPT_SIGNED_URL_TTL_SECONDS") ??
        "300",
    ),
  }
}
