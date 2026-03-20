import {
  NotificationsConfigurationException,
} from "@/exceptions/notifications/notifications.exceptions"
import { getPaymentsAppUrl } from "@/lib/payments/payments.config"

function getEnvironmentVariable(name: string) {
  return process.env[name]?.trim() ?? null
}

export function getTransactionalEmailConfig() {
  return {
    apiBaseUrl: getEnvironmentVariable("RESEND_API_BASE_URL") ?? "https://api.resend.com",
    apiKey: getEnvironmentVariable("RESEND_API_KEY"),
    from: getEnvironmentVariable("RESEND_FROM_EMAIL"),
    replyTo: getEnvironmentVariable("RESEND_REPLY_TO_EMAIL"),
    supportEmail:
      getEnvironmentVariable("TRANSACTIONAL_SUPPORT_EMAIL") ??
      getEnvironmentVariable("RESEND_REPLY_TO_EMAIL"),
    historyUrl: `${getPaymentsAppUrl()}/mis-reservas`,
  }
}

export function assertTransactionalEmailConfigured() {
  const config = getTransactionalEmailConfig()

  if (!config.apiKey || !config.from) {
    throw new NotificationsConfigurationException(
      "assertTransactionalEmailConfigured",
      new Error("Missing Resend configuration"),
    )
  }

  return config
}

export function isTransactionalEmailEnabled() {
  const config = getTransactionalEmailConfig()

  return Boolean(config.apiKey && config.from)
}
