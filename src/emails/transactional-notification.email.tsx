import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface TransactionalNotificationEmailProps {
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
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={eyebrowStyle}>{eyebrow}</Text>
          <Heading style={titleStyle}>{title}</Heading>
          <Text style={paragraph}>{greeting}</Text>
          <Text style={paragraph}>{intro}</Text>

          <Section style={summaryCard}>
            <Text style={summaryLine}>
              <strong>Reserva:</strong> {orderReference}
            </Text>
            <Text style={summaryLine}>
              <strong>Total:</strong> {total}
            </Text>
            <Text style={summaryLine}>
              <strong>Método de pago:</strong> {paymentMethod}
            </Text>
            <Text style={summaryLine}>
              <strong>Estado del pago:</strong> {paymentStatus}
            </Text>
          </Section>

          <Section style={stepsCard}>
            <Text style={sectionTitle}>Próximos pasos</Text>
            {steps.map((step, index) => (
              <Text key={index} style={stepLine}>
                {index + 1}. {step}
              </Text>
            ))}
          </Section>

          {actionLabel && actionUrl ? (
            <Section style={ctaSection}>
              <Link href={actionUrl} style={ctaLink}>
                {actionLabel}
              </Link>
            </Section>
          ) : null}

          <Hr style={divider} />

          <Text style={footerText}>
            Apacheta Travel Agency
            {supportEmail ? ` • ${supportEmail}` : ""}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const body = {
  backgroundColor: "#f7f4ef",
  fontFamily:
    "Georgia, Cambria, 'Times New Roman', Times, serif",
  margin: "0",
  padding: "24px 0",
}

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #d9cdbf",
  margin: "0 auto",
  maxWidth: "640px",
  padding: "40px 32px",
}

const eyebrowStyle = {
  color: "#7c5d47",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "11px",
  letterSpacing: "0.18em",
  margin: "0 0 12px",
  textTransform: "uppercase" as const,
}

const titleStyle = {
  color: "#2f2118",
  fontSize: "32px",
  fontStyle: "italic",
  fontWeight: "400",
  lineHeight: "1.2",
  margin: "0 0 20px",
}

const paragraph = {
  color: "#2f2118",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "0 0 14px",
}

const summaryCard = {
  backgroundColor: "#fbf8f3",
  border: "1px solid #e5dacd",
  margin: "28px 0 20px",
  padding: "20px 24px",
}

const summaryLine = {
  color: "#2f2118",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 10px",
}

const stepsCard = {
  margin: "0 0 24px",
}

const sectionTitle = {
  color: "#2f2118",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "16px",
  fontWeight: "700",
  margin: "0 0 12px",
}

const stepLine = {
  color: "#2f2118",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "14px",
  lineHeight: "1.7",
  margin: "0 0 8px",
}

const ctaSection = {
  margin: "24px 0 0",
}

const ctaLink = {
  backgroundColor: "#7c5d47",
  color: "#f7f4ef",
  display: "inline-block",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "14px",
  fontWeight: "700",
  padding: "14px 22px",
  textDecoration: "none",
}

const divider = {
  borderColor: "#e5dacd",
  margin: "28px 0 20px",
}

const footerText = {
  color: "#7f7469",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "12px",
  lineHeight: "1.6",
  margin: "0",
}
