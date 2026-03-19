import {
  NotificationsServiceException,
} from "@/exceptions/notifications/notifications.exceptions"
import {
  getTransactionalEmailConfig,
  isTransactionalEmailEnabled,
} from "@/lib/email/email.config"
import { sendTransactionalEmail } from "@/lib/email/resend.client"
import { createPaymentsRepository } from "@/repositories/payments/payments.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { OrderPaymentContext } from "@/types/payments/payments.types"

type ContactSnapshot = {
  firstName?: string | null
  lastName?: string | null
  email?: string | null
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function formatPrice(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("es-AR")}`
}

function resolveContactSnapshot(context: OrderPaymentContext): ContactSnapshot {
  const contact =
    context.order.contacto && typeof context.order.contacto === "object"
      ? (context.order.contacto as Record<string, unknown>)
      : null

  return {
    firstName:
      typeof contact?.firstName === "string" ? contact.firstName : context.user?.nombre,
    lastName:
      typeof contact?.lastName === "string" ? contact.lastName : context.user?.apellido,
    email: typeof contact?.email === "string" ? contact.email : context.user?.email ?? null,
  }
}

function resolveGreetingName(contact: ContactSnapshot) {
  const fullName = [contact.firstName, contact.lastName]
    .filter(Boolean)
    .join(" ")
    .trim()

  return fullName || "viajero"
}

function resolvePaymentMethodLabel(method: string) {
  switch (method) {
    case "mercadopago_checkout_pro":
      return "Mercado Pago"
    case "bank_transfer":
      return "Transferencia bancaria"
    default:
      return "Pago en sucursal"
  }
}

function resolvePaymentStatusLabel(status: string) {
  switch (status) {
    case "approved":
      return "Aprobado"
    case "reported":
      return "Comprobante informado"
    case "requires_action":
      return "Pendiente de acción"
    case "rejected":
      return "Rechazado"
    case "cancelled":
      return "Cancelado"
    case "expired":
      return "Vencido"
    default:
      return "Pendiente"
  }
}

function buildPlainTextEmail(input: {
  title: string
  intro: string
  orderReference: string
  total: string
  paymentMethod: string
  paymentStatus: string
  steps: string[]
  actionUrl?: string
}) {
  return [
    input.title,
    "",
    input.intro,
    "",
    `Reserva: ${input.orderReference}`,
    `Total: ${input.total}`,
    `Método de pago: ${input.paymentMethod}`,
    `Estado del pago: ${input.paymentStatus}`,
    "",
    "Próximos pasos:",
    ...input.steps.map((step, index) => `${index + 1}. ${step}`),
    input.actionUrl ? "" : null,
    input.actionUrl ? `Ver detalle: ${input.actionUrl}` : null,
  ]
    .filter(Boolean)
    .join("\n")
}

function buildHtmlEmail(input: {
  previewText: string
  eyebrow: string
  title: string
  greeting: string
  intro: string
  orderReference: string
  total: string
  paymentMethod: string
  paymentStatus: string
  steps: string[]
  actionLabel?: string
  actionUrl?: string
  supportEmail: string
}) {
  const stepsMarkup = input.steps
    .map(
      (step, i) =>
        `<tr style="vertical-align:top;">
          <td style="width:28px;padding:0 8px 12px 0;">
            <div style="background:#8B1A1A;color:#ffffff;width:22px;height:22px;border-radius:50%;font-size:12px;font-weight:700;line-height:22px;text-align:center;">${i + 1}</div>
          </td>
          <td style="padding:0 0 12px 0;color:#6B7280;font-size:14px;line-height:1.6;">${escapeHtml(step)}</td>
        </tr>`,
    )
    .join("")
  const actionMarkup =
    input.actionLabel && input.actionUrl
      ? `<div style="text-align:center;margin:4px 0 0;">
          <a href="${escapeHtml(input.actionUrl)}" style="display:inline-block;background:#8B1A1A;color:#ffffff;text-decoration:none;padding:14px 32px;font-size:14px;font-weight:700;border-radius:6px;">
            ${escapeHtml(input.actionLabel)}
          </a>
        </div>`
      : ""

  const year = new Date().getFullYear()

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(input.title)}</title>
  </head>
  <body style="margin:0;padding:40px 16px;background:#F5F5F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#1E1E1E;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(input.previewText)}</div>
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #E5E7EB;">
      <!--[if mso]><table width="600" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td><![endif]-->

      <!-- Header -->
      <div style="background:#2E2726;padding:28px 32px;text-align:center;">
        <img src="https://apacheta-viajes.com/logo.png" width="180" alt="Apacheta Viajes" style="display:block;margin:0 auto;" />
      </div>

      <!-- Accent line -->
      <div style="height:3px;background:#8B1A1A;"></div>

      <!-- Content -->
      <div style="padding:36px 32px 24px;">
        <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8B1A1A;">${escapeHtml(input.eyebrow)}</p>
        <h1 style="margin:0 0 24px 0;font-size:26px;font-weight:400;line-height:1.3;color:#1E1E1E;font-family:Georgia,'Times New Roman',serif;">${escapeHtml(input.title)}</h1>
        <p style="margin:0 0 8px 0;font-size:16px;font-weight:600;line-height:1.5;color:#1E1E1E;">${escapeHtml(input.greeting)}</p>
        <p style="margin:0 0 28px 0;font-size:15px;line-height:1.7;color:#6B7280;">${escapeHtml(input.intro)}</p>

        <!-- Order summary -->
        <div style="background:#FAFAFA;border:1px solid #E5E7EB;border-left:3px solid #8B1A1A;border-radius:6px;padding:20px 24px;margin:0 0 28px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="color:#6B7280;font-size:13px;font-weight:500;padding:4px 0;">Reserva</td>
              <td style="color:#1E1E1E;font-size:14px;font-weight:600;text-align:right;padding:4px 0;">${escapeHtml(input.orderReference)}</td>
            </tr>
            <tr><td colspan="2" style="padding:5px 0;"><hr style="border:none;border-top:1px solid #E5E7EB;margin:0;" /></td></tr>
            <tr>
              <td style="color:#6B7280;font-size:13px;font-weight:500;padding:4px 0;">Total</td>
              <td style="color:#1E1E1E;font-size:14px;font-weight:600;text-align:right;padding:4px 0;">${escapeHtml(input.total)}</td>
            </tr>
            <tr><td colspan="2" style="padding:5px 0;"><hr style="border:none;border-top:1px solid #E5E7EB;margin:0;" /></td></tr>
            <tr>
              <td style="color:#6B7280;font-size:13px;font-weight:500;padding:4px 0;">Método de pago</td>
              <td style="color:#1E1E1E;font-size:14px;font-weight:600;text-align:right;padding:4px 0;">${escapeHtml(input.paymentMethod)}</td>
            </tr>
            <tr><td colspan="2" style="padding:5px 0;"><hr style="border:none;border-top:1px solid #E5E7EB;margin:0;" /></td></tr>
            <tr>
              <td style="color:#6B7280;font-size:13px;font-weight:500;padding:4px 0;">Estado del pago</td>
              <td style="color:#8B1A1A;font-size:14px;font-weight:600;text-align:right;padding:4px 0;">${escapeHtml(input.paymentStatus)}</td>
            </tr>
          </table>
        </div>

        <!-- Steps -->
        <div style="margin:0 0 28px 0;">
          <p style="margin:0 0 16px 0;font-size:15px;font-weight:700;color:#1E1E1E;">Próximos pasos</p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">${stepsMarkup}</table>
        </div>

        ${actionMarkup}
      </div>

      <!-- Footer -->
      <div style="background:#FAFAFA;border-top:1px solid #E5E7EB;padding:24px 32px;text-align:center;">
        <p style="margin:0 0 8px 0;font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#2E2726;">Apacheta Viajes</p>
        <p style="margin:0 0 8px 0;font-size:13px;line-height:1.6;color:#6B7280;">¿Necesitás ayuda? Escribinos a ${escapeHtml(input.supportEmail)}</p>
        <p style="margin:0;font-size:11px;line-height:1.5;color:#9CA3AF;">© ${year} Apacheta Travel Agency. Todos los derechos reservados.</p>
      </div>

      <!--[if mso]></td></tr></table><![endif]-->
    </div>
  </body>
</html>`
}

export class TransactionalEmailService {
  private readonly paymentsRepository

  constructor(private readonly supabase: DatabaseClient) {
    this.paymentsRepository = createPaymentsRepository(supabase)
  }

  async sendOrderCreated(orderId: string) {
    return this.sendOrderEmail({
      orderId,
      idempotencyKey: `order-created:${orderId}`,
      subjectPrefix: "Recibimos tu reserva",
      eyebrow: "Reserva recibida",
      title: "Tu reserva ya fue registrada",
      intro:
        "Ya recibimos tu solicitud y dejamos el pedido cargado en Apacheta. A partir de ahora podés seguir el estado del pago y de tu orden desde tu cuenta.",
      stepsByMethod: {
        mercadopago_checkout_pro: [
          "Completá el pago desde Mercado Pago si todavía no lo hiciste.",
          "Cuando recibamos la confirmación, actualizaremos la orden automáticamente.",
          "Podés revisar todo el historial desde tu cuenta.",
        ],
        bank_transfer: [
          "Ingresá a tu detalle de orden para ver los datos bancarios.",
          "Transferí el monto exacto y subí el comprobante.",
          "Te avisaremos apenas validemos la acreditación.",
        ],
        cash_local: [
          "Nuestro equipo revisará la solicitud y te contactará.",
          "Coordinaremos el pago presencial en sucursal.",
          "Podés revisar el estado actualizado desde tu cuenta.",
        ],
      },
      actionUrl: (config, context) =>
        context.order.metodo_pago === "bank_transfer"
          ? `${config.historyUrl}?order=${context.order.id}`
          : config.historyUrl,
      actionLabel: () => "Ver mis reservas",
      shouldSend: () => true,
    })
  }

  async sendBankTransferReported(paymentId: string) {
    return this.sendPaymentEmail({
      paymentId,
      idempotencyKey: `bank-transfer-reported:${paymentId}`,
      subjectPrefix: "Recibimos tu comprobante",
      eyebrow: "Transferencia reportada",
      title: "Tu comprobante quedó en revisión",
      intro:
        "Registramos el comprobante de transferencia y ya quedó asociado a tu orden. Nuestro equipo va a validar la acreditación bancaria.",
      steps: [
        "No necesitás reenviar el comprobante salvo que te lo pidamos.",
        "Cuando confirmemos la acreditación, actualizaremos la orden automáticamente.",
        "Podés revisar el estado del pago desde tu cuenta.",
      ],
      actionLabel: "Ver mis reservas",
      actionUrl: (config) => config.historyUrl,
      shouldSend: (context) => context.order.metodo_pago === "bank_transfer",
    })
  }

  async sendPaymentApproved(paymentId: string) {
    return this.sendPaymentEmail({
      paymentId,
      idempotencyKey: `payment-approved:${paymentId}`,
      subjectPrefix: "Pago aprobado",
      eyebrow: "Pago confirmado",
      title: "Tu pago fue aprobado",
      intro:
        "Ya registramos el pago como aprobado. La orden quedó actualizada y nuestro equipo seguirá con la confirmación operativa del viaje.",
      steps: [
        "Conservá este email como referencia de la operación.",
        "Revisá en tu cuenta el estado actualizado de la orden.",
        "Si hace falta una coordinación adicional, te contactaremos por email o WhatsApp.",
      ],
      actionLabel: "Ver mis reservas",
      actionUrl: (config) => config.historyUrl,
      shouldSend: () => true,
    })
  }

  async sendPaymentPendingOrError(paymentId: string) {
    return this.sendPaymentEmail({
      paymentId,
      idempotencyKeyResolver: (context) =>
        `payment-status:${context.latestPayment?.id ?? paymentId}:${context.latestPayment?.estado ?? "pending"}`,
      subjectPrefix: "Actualización de pago",
      eyebrow: "Estado del pago",
      title: "Tu pago sigue pendiente o necesita revisión",
      intro:
        "Registramos un cambio en el estado del pago y por ahora la orden no quedó marcada como pagada. Podés revisar el detalle desde tu cuenta y retomar el flujo si corresponde.",
      steps: [
        "Revisá el estado del pago y de la orden desde tu cuenta.",
        "Si usaste Mercado Pago y hubo un rechazo, podés iniciar un nuevo intento.",
        "Si el estado no cambia y necesitás ayuda, respondé este email.",
      ],
      actionLabel: "Ver mis reservas",
      actionUrl: (config) => config.historyUrl,
      shouldSend: (context) => {
        const status = context.latestPayment?.estado

        return status === "pending" || status === "rejected" || status === "cancelled" || status === "expired"
      },
    })
  }

  private async sendOrderEmail(input: {
    orderId: string
    idempotencyKey: string
    subjectPrefix: string
    eyebrow: string
    title: string
    intro: string
    stepsByMethod: Record<string, string[]>
    actionLabel: (context: OrderPaymentContext) => string
    actionUrl: (
      config: ReturnType<typeof getTransactionalEmailConfig>,
      context: OrderPaymentContext,
    ) => string
    shouldSend: (context: OrderPaymentContext) => boolean
  }) {
    const context = await this.paymentsRepository.getOrderContext(input.orderId)

    return this.dispatchEmail({
      context,
      idempotencyKey: input.idempotencyKey,
      subject: `${input.subjectPrefix} #${context.order.codigo_referencia}`,
      eyebrow: input.eyebrow,
      title: input.title,
      intro: input.intro,
      steps:
        input.stepsByMethod[context.order.metodo_pago] ??
        input.stepsByMethod.cash_local ??
        [],
      actionLabel: input.actionLabel(context),
      actionUrl: input.actionUrl(getTransactionalEmailConfig(), context),
      shouldSend: input.shouldSend(context),
    })
  }

  private async sendPaymentEmail(input: {
    paymentId: string
    idempotencyKey?: string
    idempotencyKeyResolver?: (context: OrderPaymentContext) => string
    subjectPrefix: string
    eyebrow: string
    title: string
    intro: string
    steps: string[]
    actionLabel: string
    actionUrl: (config: ReturnType<typeof getTransactionalEmailConfig>) => string
    shouldSend: (context: OrderPaymentContext) => boolean
  }) {
    const payment = await this.paymentsRepository.getPaymentById(input.paymentId)
    const context = await this.paymentsRepository.getOrderContext(payment.orden_id)

    return this.dispatchEmail({
      context,
      idempotencyKey:
        input.idempotencyKey ?? input.idempotencyKeyResolver?.(context) ?? `payment:${payment.id}`,
      subject: `${input.subjectPrefix} #${context.order.codigo_referencia}`,
      eyebrow: input.eyebrow,
      title: input.title,
      intro: input.intro,
      steps: input.steps,
      actionLabel: input.actionLabel,
      actionUrl: input.actionUrl(getTransactionalEmailConfig()),
      shouldSend: input.shouldSend(context),
    })
  }

  private async dispatchEmail(input: {
    context: OrderPaymentContext
    idempotencyKey: string
    subject: string
    eyebrow: string
    title: string
    intro: string
    steps: string[]
    actionLabel?: string
    actionUrl?: string
    shouldSend: boolean
  }) {
    if (!input.shouldSend || !isTransactionalEmailEnabled()) {
      return null
    }

    const contact = resolveContactSnapshot(input.context)
    const recipientEmail = contact.email?.trim()

    if (!recipientEmail) {
      return null
    }

    const config = getTransactionalEmailConfig()
    const orderReference = `#${input.context.order.codigo_referencia}`
    const total = formatPrice(
      Number(input.context.order.total),
      input.context.order.moneda,
    )
    const paymentMethod = resolvePaymentMethodLabel(input.context.order.metodo_pago)
    const paymentStatus = resolvePaymentStatusLabel(
      input.context.latestPayment?.estado ?? input.context.order.estado_pago,
    )
    const greetingName = resolveGreetingName(contact)
    const html = buildHtmlEmail({
      previewText: `${input.subject} - ${orderReference}`,
      eyebrow: input.eyebrow,
      title: input.title,
      greeting: `Hola ${greetingName},`,
      intro: input.intro,
      orderReference,
      total,
      paymentMethod,
      paymentStatus,
      steps: input.steps,
      actionLabel: input.actionLabel,
      actionUrl: input.actionUrl,
      supportEmail: config.supportEmail ?? config.from ?? "soporte@apacheta-viajes.com",
    })
    const text = buildPlainTextEmail({
      title: input.title,
      intro: input.intro,
      orderReference,
      total,
      paymentMethod,
      paymentStatus,
      steps: input.steps,
      actionUrl: input.actionUrl,
    })

    try {
      return await sendTransactionalEmail({
        to: recipientEmail,
        subject: input.subject,
        html,
        text,
        idempotencyKey: input.idempotencyKey,
        tags: [
          { name: "domain", value: "checkout" },
          { name: "order", value: input.context.order.id },
        ],
      })
    } catch (error) {
      throw new NotificationsServiceException("dispatchEmail", error)
    }
  }
}

export function createTransactionalEmailService(supabase: DatabaseClient) {
  return new TransactionalEmailService(supabase)
}
