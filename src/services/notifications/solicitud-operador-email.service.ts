import { render } from "@react-email/components"

import { OperatorRequestEmail } from "@/emails/solicitud-operador.email"
import {
  getTransactionalEmailConfig,
  isTransactionalEmailEnabled,
} from "@/lib/email/email.config"
import { sendTransactionalEmail } from "@/lib/email/resend.client"
import type { OperatorRequestsRow } from "@/types/operator-requests/operator-requests.types"

type RecipientInfo = {
  email: string
  greetingName?: string | null
}

function buildGreeting(name?: string | null) {
  const trimmed = name?.trim()
  return `Hola ${trimmed && trimmed.length > 0 ? trimmed : "viajero"},`
}

async function dispatch(input: {
  recipient: RecipientInfo
  subject: string
  idempotencyKey: string
  previewText: string
  eyebrow: string
  title: string
  intro: string
  highlight?: { label: string; value: string } | null
  bullets?: string[]
  actionLabel?: string
  actionUrl?: string
  textBody: string
}) {
  if (!isTransactionalEmailEnabled()) return null
  if (!input.recipient.email) return null

  const config = getTransactionalEmailConfig()
  const html = await render(
    OperatorRequestEmail({
      previewText: input.previewText,
      eyebrow: input.eyebrow,
      title: input.title,
      greeting: buildGreeting(input.recipient.greetingName),
      intro: input.intro,
      highlight: input.highlight ?? null,
      bullets: input.bullets,
      actionLabel: input.actionLabel,
      actionUrl: input.actionUrl,
      supportEmail: config.supportEmail ?? config.from ?? null,
    }),
  )

  return sendTransactionalEmail({
    to: input.recipient.email,
    subject: input.subject,
    html,
    text: input.textBody,
    idempotencyKey: input.idempotencyKey,
    tags: [{ name: "domain", value: "solicitudes-operador" }],
  })
}

function appBaseUrl(): string {
  return getTransactionalEmailConfig().historyUrl.replace(/\/mis-reservas$/, "")
}

export async function sendOperatorRequestRecibida(
  solicitud: OperatorRequestsRow,
  recipient: RecipientInfo,
) {
  return dispatch({
    recipient,
    subject: "Recibimos tu solicitud para ser operador",
    idempotencyKey: `solicitud-operador-recibida:${solicitud.id}`,
    previewText: "Tu solicitud para ser operador quedó registrada",
    eyebrow: "Solicitud recibida",
    title: "Recibimos tu solicitud",
    intro:
      "Gracias por querer ser parte de Apacheta como operador. Ya registramos tu solicitud y nuestro equipo la va a revisar en los próximos días hábiles.",
    highlight: {
      label: "Nombre comercial",
      value: solicitud.nombre_comercial,
    },
    bullets: [
      "Vas a recibir un email cuando tu solicitud sea aprobada o rechazada.",
      "Si cambia algún dato, podés cancelar la solicitud desde tu cuenta y volver a enviarla.",
    ],
    actionLabel: "Ir a mi cuenta",
    actionUrl: `${appBaseUrl()}/account/operador`,
    textBody: [
      "Recibimos tu solicitud para ser operador.",
      "",
      `Nombre comercial: ${solicitud.nombre_comercial}`,
      "",
      "Te vamos a avisar por email cuando esté revisada.",
    ].join("\n"),
  })
}

export async function sendOperatorRequestAprobada(
  solicitud: OperatorRequestsRow,
  recipient: RecipientInfo,
) {
  return dispatch({
    recipient,
    subject: "¡Tu solicitud de operador fue aprobada!",
    idempotencyKey: `solicitud-operador-aprobada:${solicitud.id}`,
    previewText: "Ya sos operador en Apacheta",
    eyebrow: "Bienvenida",
    title: "Tu solicitud fue aprobada",
    intro:
      "¡Felicitaciones! Tu cuenta ya tiene el rol de operador. Ahora podés ingresar al panel y empezar a cotizar paquetes para tus clientes.",
    bullets: [
      "Tu rol fue actualizado automáticamente; refrescá la página si ya estás logueado.",
      "Desde el panel vas a poder armar cotizaciones por días, ver tu comisión y compartirlas por link o WhatsApp.",
    ],
    actionLabel: "Entrar al panel de operador",
    actionUrl: `${appBaseUrl()}/operador`,
    textBody: [
      "¡Tu solicitud de operador fue aprobada!",
      "",
      `Accedé al panel: ${appBaseUrl()}/operador`,
    ].join("\n"),
  })
}

export async function sendOperatorRequestRechazada(
  solicitud: OperatorRequestsRow,
  recipient: RecipientInfo,
) {
  const motivo = solicitud.motivo_rechazo?.trim()
  return dispatch({
    recipient,
    subject: "Actualización sobre tu solicitud de operador",
    idempotencyKey: `solicitud-operador-rechazada:${solicitud.id}`,
    previewText: "Novedades sobre tu solicitud de operador",
    eyebrow: "Solicitud revisada",
    title: "Tu solicitud no fue aprobada",
    intro:
      "Revisamos tu solicitud y por ahora no podemos avanzar con el alta. A continuación te dejamos el motivo. Podés volver a postularte cuando lo consideres.",
    highlight: motivo
      ? { label: "Motivo", value: motivo }
      : null,
    bullets: [
      "Podés volver a enviar una solicitud desde tu cuenta cuando lo necesites.",
      "Si querés ampliar información o tenés dudas, respondenos este mismo email.",
    ],
    actionLabel: "Volver a postularme",
    actionUrl: `${appBaseUrl()}/account/operador`,
    textBody: [
      "Tu solicitud de operador no fue aprobada.",
      motivo ? "" : null,
      motivo ? `Motivo: ${motivo}` : null,
      "",
      "Podés volver a enviarla desde tu cuenta.",
    ]
      .filter((v): v is string => v !== null)
      .join("\n"),
  })
}
