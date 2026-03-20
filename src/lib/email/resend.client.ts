import {
  NotificationsConfigurationException,
  NotificationsServiceException,
} from "@/exceptions/notifications/notifications.exceptions"
import { assertTransactionalEmailConfigured } from "@/lib/email/email.config"

interface SendTransactionalEmailInput {
  to: string | string[]
  subject: string
  html: string
  text: string
  idempotencyKey: string
  tags?: Array<{ name: string; value: string }>
}

export async function sendTransactionalEmail(
  input: SendTransactionalEmailInput,
) {
  const config = assertTransactionalEmailConfigured()
  const response = await fetch(`${config.apiBaseUrl}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": input.idempotencyKey,
    },
    body: JSON.stringify({
      from: config.from,
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
      ...(config.replyTo ? { reply_to: config.replyTo } : {}),
      ...(input.tags?.length ? { tags: input.tags } : {}),
    }),
  })

  const payload = (await response.json().catch(() => null)) as
    | { id?: string; message?: string; error?: string }
    | null

  if (!response.ok) {
    throw new NotificationsServiceException(
      "sendTransactionalEmail",
      new Error(payload?.message ?? payload?.error ?? "Resend request failed"),
    )
  }

  if (!payload?.id) {
    throw new NotificationsConfigurationException(
      "sendTransactionalEmail",
      new Error("Resend did not return an email id"),
    )
  }

  return payload.id
}
