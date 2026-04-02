import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "@react-email/components"

export interface TransactionalNotificationEmailProps {
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
  supportEmail?: string | null
}

const SITE_URL = "https://apacheta-viajes.vercel.app"

export function TransactionalNotificationEmail({
  previewText,
  eyebrow,
  title,
  greeting,
  intro,
  orderReference,
  total,
  paymentMethod,
  paymentStatus,
  steps,
  actionLabel,
  actionUrl,
  supportEmail,
}: TransactionalNotificationEmailProps) {
  return (
    <Html lang="es">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: "#8B1A1A",
                dark: "#2E2726",
                muted: "#6B7280",
                card: "#FAFAFA",
              },
            },
          },
        }}
      >
        <Head />
        <Preview>{previewText}</Preview>
        <Body className="bg-[#F5F5F5] font-sans m-0 py-10 px-4">
          <Container className="bg-white mx-auto max-w-[600px] rounded-lg overflow-hidden border-solid border border-[#E5E7EB]">
            {/* Header */}
            <Section className="bg-dark py-7 px-8 text-center">
              <Img
                src={`${SITE_URL}/branding/Artboard%207.png`}
                width="160"
                height="60"
                alt="Apacheta Viajes"
                className="mx-auto"
              />
            </Section>

            {/* Accent line */}
            <Section className="bg-brand h-[3px] w-full" />

            {/* Content */}
            <Section className="pt-9 px-8 pb-6">
              <Text className="text-brand text-[11px] font-bold tracking-widest uppercase m-0 mb-2">
                {eyebrow}
              </Text>
              <Heading
                as="h1"
                className="text-[#1E1E1E] font-serif text-[26px] font-normal leading-tight m-0 mb-6"
              >
                {title}
              </Heading>
              <Text className="text-[#1E1E1E] text-base font-semibold leading-normal m-0 mb-2">
                {greeting}
              </Text>
              <Text className="text-muted text-[15px] leading-relaxed m-0 mb-7">
                {intro}
              </Text>

              {/* Order summary card */}
              <Section
                className="bg-card rounded-md mb-7"
                style={{
                  border: "1px solid #E5E7EB",
                  borderLeft: "3px solid #8B1A1A",
                }}
              >
                <Row className="px-6 pt-5">
                  <Column className="w-[45%]">
                    <Text className="text-muted text-[13px] font-medium m-0 py-1">
                      Reserva
                    </Text>
                  </Column>
                  <Column className="text-right">
                    <Text className="text-[#1E1E1E] text-sm font-semibold m-0 py-1">
                      {orderReference}
                    </Text>
                  </Column>
                </Row>
                <Hr className="border-none border-solid border-t border-[#E5E7EB] mx-6 my-0" />
                <Row className="px-6">
                  <Column className="w-[45%]">
                    <Text className="text-muted text-[13px] font-medium m-0 py-1">
                      Total
                    </Text>
                  </Column>
                  <Column className="text-right">
                    <Text className="text-[#1E1E1E] text-sm font-semibold m-0 py-1">
                      {total}
                    </Text>
                  </Column>
                </Row>
                <Hr className="border-none border-solid border-t border-[#E5E7EB] mx-6 my-0" />
                <Row className="px-6">
                  <Column className="w-[45%]">
                    <Text className="text-muted text-[13px] font-medium m-0 py-1">
                      Método de pago
                    </Text>
                  </Column>
                  <Column className="text-right">
                    <Text className="text-[#1E1E1E] text-sm font-semibold m-0 py-1">
                      {paymentMethod}
                    </Text>
                  </Column>
                </Row>
                <Hr className="border-none border-solid border-t border-[#E5E7EB] mx-6 my-0" />
                <Row className="px-6 pb-5">
                  <Column className="w-[45%]">
                    <Text className="text-muted text-[13px] font-medium m-0 py-1">
                      Estado del pago
                    </Text>
                  </Column>
                  <Column className="text-right">
                    <Text className="text-brand text-sm font-semibold m-0 py-1">
                      {paymentStatus}
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* Steps */}
              <Section className="mb-7">
                <Text className="text-[#1E1E1E] text-[15px] font-bold m-0 mb-4">
                  Próximos pasos
                </Text>
                {steps.map((step, index) => (
                  <Row key={index} className="mb-3">
                    <Column className="w-[28px] align-top">
                      <Text
                        className="bg-brand text-white text-xs font-bold text-center m-0 mt-[2px] leading-[22px]"
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          display: "inline-block",
                        }}
                      >
                        {index + 1}
                      </Text>
                    </Column>
                    <Column className="align-top pl-2">
                      <Text className="text-muted text-sm leading-relaxed m-0">
                        {step}
                      </Text>
                    </Column>
                  </Row>
                ))}
              </Section>

              {/* CTA */}
              {actionLabel && actionUrl ? (
                <Section className="text-center mt-1">
                  <Button
                    href={actionUrl}
                    className="bg-brand text-white text-sm font-bold py-3.5 px-8 rounded-md no-underline box-border"
                  >
                    {actionLabel}
                  </Button>
                </Section>
              ) : null}
            </Section>

            {/* Footer */}
            <Section className="bg-card border-none border-solid border-t border-[#E5E7EB] py-6 px-8 text-center">
              <Img
                src={`${SITE_URL}/branding/Artboard%206.png`}
                width="100"
                height="40"
                alt="Apacheta Viajes"
                className="mx-auto mb-3"
              />
              <Text className="text-muted text-[13px] leading-normal m-0 mb-2">
                {supportEmail ? (
                  <>
                    ¿Necesitás ayuda? Escribinos a{" "}
                    <Link
                      href={`mailto:${supportEmail}`}
                      className="text-brand underline"
                    >
                      {supportEmail}
                    </Link>
                  </>
                ) : (
                  "¿Necesitás ayuda? Respondé este email."
                )}
              </Text>
              <Text className="text-[#9CA3AF] text-[11px] leading-normal m-0">
                © {new Date().getFullYear()} Apacheta Viajes. Todos los derechos
                reservados.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

TransactionalNotificationEmail.PreviewProps = {
  previewText: "Recibimos tu reserva #AV-2024-001",
  eyebrow: "Reserva recibida",
  title: "Tu reserva ya fue registrada",
  greeting: "Hola Valentín,",
  intro:
    "Ya recibimos tu solicitud y dejamos el pedido cargado en Apacheta. A partir de ahora podés seguir el estado del pago y de tu orden desde tu cuenta.",
  orderReference: "#AV-2024-001",
  total: "ARS 150.000",
  paymentMethod: "Transferencia bancaria",
  paymentStatus: "Pendiente",
  steps: [
    "Ingresá a tu detalle de orden para ver los datos bancarios.",
    "Transferí el monto exacto y subí el comprobante.",
    "Te avisaremos apenas validemos la acreditación.",
  ],
  actionLabel: "Ver mis reservas",
  actionUrl: "https://apacheta-viajes.vercel.app/mis-reservas",
  supportEmail: "info@apachetaviajes.tur.ar",
} satisfies TransactionalNotificationEmailProps

export default TransactionalNotificationEmail
