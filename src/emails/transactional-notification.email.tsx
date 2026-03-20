import {
  Body,
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

const BRAND = {
  primary: "#8B1A1A",
  dark: "#2E2726",
  text: "#1E1E1E",
  textMuted: "#6B7280",
  bg: "#F5F5F5",
  white: "#FFFFFF",
  cardBg: "#FAFAFA",
  border: "#E5E7EB",
  borderAccent: "#8B1A1A",
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
          {/* Header with logo */}
          <Section style={header}>
            <Img
              src="https://apacheta-viajes.com/logo.png"
              width="180"
              height="auto"
              alt="Apacheta Viajes"
              style={logo}
            />
          </Section>

          {/* Accent line */}
          <div style={accentLine} />

          {/* Content */}
          <Section style={content}>
            <Text style={eyebrowStyle}>{eyebrow}</Text>
            <Heading style={titleStyle}>{title}</Heading>
            <Text style={greetingStyle}>{greeting}</Text>
            <Text style={introStyle}>{intro}</Text>

            {/* Order summary */}
            <Section style={summaryCard}>
              <Row style={summaryRow}>
                <Column style={summaryLabel}>Reserva</Column>
                <Column style={summaryValue}>{orderReference}</Column>
              </Row>
              <Hr style={summaryDivider} />
              <Row style={summaryRow}>
                <Column style={summaryLabel}>Total</Column>
                <Column style={summaryValue}>{total}</Column>
              </Row>
              <Hr style={summaryDivider} />
              <Row style={summaryRow}>
                <Column style={summaryLabel}>Método de pago</Column>
                <Column style={summaryValue}>{paymentMethod}</Column>
              </Row>
              <Hr style={summaryDivider} />
              <Row style={summaryRow}>
                <Column style={summaryLabel}>Estado del pago</Column>
                <Column style={summaryValueHighlight}>{paymentStatus}</Column>
              </Row>
            </Section>

            {/* Steps */}
            <Section style={stepsSection}>
              <Text style={stepsTitle}>Próximos pasos</Text>
              {steps.map((step, index) => (
                <Section key={index} style={stepItem}>
                  <Row>
                    <Column style={stepNumber}>
                      <Text style={stepNumberText}>{index + 1}</Text>
                    </Column>
                    <Column style={stepContent}>
                      <Text style={stepText}>{step}</Text>
                    </Column>
                  </Row>
                </Section>
              ))}
            </Section>

            {/* CTA */}
            {actionLabel && actionUrl ? (
              <Section style={ctaSection}>
                <Link href={actionUrl} style={ctaButton}>
                  {actionLabel}
                </Link>
              </Section>
            ) : null}
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerBrand}>Apacheta Viajes</Text>
            <Text style={footerText}>
              {supportEmail
                ? `¿Necesitás ayuda? Escribinos a ${supportEmail}`
                : "¿Necesitás ayuda? Respondé este email."}
            </Text>
            <Text style={footerCopy}>
              © {new Date().getFullYear()} Apacheta Travel Agency. Todos los
              derechos reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

/* ── Styles ────────────────────────────────────────────── */

const body: React.CSSProperties = {
  backgroundColor: BRAND.bg,
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  margin: 0,
  padding: "40px 16px",
}

const container: React.CSSProperties = {
  backgroundColor: BRAND.white,
  margin: "0 auto",
  maxWidth: "600px",
  borderRadius: "8px",
  overflow: "hidden",
  border: `1px solid ${BRAND.border}`,
}

const header: React.CSSProperties = {
  backgroundColor: BRAND.dark,
  padding: "28px 32px",
  textAlign: "center" as const,
}

const logo: React.CSSProperties = {
  margin: "0 auto",
}

const accentLine: React.CSSProperties = {
  height: "3px",
  backgroundColor: BRAND.primary,
  width: "100%",
}

const content: React.CSSProperties = {
  padding: "36px 32px 24px",
}

const eyebrowStyle: React.CSSProperties = {
  color: BRAND.primary,
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.12em",
  margin: "0 0 8px",
  textTransform: "uppercase" as const,
}

const titleStyle: React.CSSProperties = {
  color: BRAND.text,
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "26px",
  fontWeight: 400,
  lineHeight: "1.3",
  margin: "0 0 24px",
}

const greetingStyle: React.CSSProperties = {
  color: BRAND.text,
  fontSize: "16px",
  fontWeight: 600,
  lineHeight: "1.5",
  margin: "0 0 8px",
}

const introStyle: React.CSSProperties = {
  color: BRAND.textMuted,
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "0 0 28px",
}

const summaryCard: React.CSSProperties = {
  backgroundColor: BRAND.cardBg,
  border: `1px solid ${BRAND.border}`,
  borderLeft: `3px solid ${BRAND.primary}`,
  borderRadius: "6px",
  padding: "20px 24px",
  margin: "0 0 28px",
}

const summaryRow: React.CSSProperties = {
  width: "100%",
}

const summaryDivider: React.CSSProperties = {
  borderColor: BRAND.border,
  margin: "10px 0",
}

const summaryLabel: React.CSSProperties = {
  color: BRAND.textMuted,
  fontSize: "13px",
  fontWeight: 500,
  width: "45%",
  verticalAlign: "middle" as const,
  padding: "4px 0",
}

const summaryValue: React.CSSProperties = {
  color: BRAND.text,
  fontSize: "14px",
  fontWeight: 600,
  textAlign: "right" as const,
  verticalAlign: "middle" as const,
  padding: "4px 0",
}

const summaryValueHighlight: React.CSSProperties = {
  ...summaryValue,
  color: BRAND.primary,
}

const stepsSection: React.CSSProperties = {
  margin: "0 0 28px",
}

const stepsTitle: React.CSSProperties = {
  color: BRAND.text,
  fontSize: "15px",
  fontWeight: 700,
  margin: "0 0 16px",
}

const stepItem: React.CSSProperties = {
  margin: "0 0 12px",
}

const stepNumber: React.CSSProperties = {
  width: "28px",
  verticalAlign: "top" as const,
}

const stepNumberText: React.CSSProperties = {
  backgroundColor: BRAND.primary,
  color: BRAND.white,
  width: "22px",
  height: "22px",
  borderRadius: "50%",
  fontSize: "12px",
  fontWeight: 700,
  lineHeight: "22px",
  textAlign: "center" as const,
  margin: "2px 0 0",
  display: "inline-block",
}

const stepContent: React.CSSProperties = {
  verticalAlign: "top" as const,
  paddingLeft: "8px",
}

const stepText: React.CSSProperties = {
  color: BRAND.textMuted,
  fontSize: "14px",
  lineHeight: "1.6",
  margin: 0,
}

const ctaSection: React.CSSProperties = {
  textAlign: "center" as const,
  margin: "4px 0 0",
}

const ctaButton: React.CSSProperties = {
  backgroundColor: BRAND.primary,
  borderRadius: "6px",
  color: BRAND.white,
  display: "inline-block",
  fontSize: "14px",
  fontWeight: 700,
  padding: "14px 32px",
  textDecoration: "none",
  textAlign: "center" as const,
}

const footer: React.CSSProperties = {
  backgroundColor: BRAND.cardBg,
  borderTop: `1px solid ${BRAND.border}`,
  padding: "24px 32px",
  textAlign: "center" as const,
}

const footerBrand: React.CSSProperties = {
  color: BRAND.dark,
  fontSize: "14px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  margin: "0 0 8px",
  textTransform: "uppercase" as const,
}

const footerText: React.CSSProperties = {
  color: BRAND.textMuted,
  fontSize: "13px",
  lineHeight: "1.6",
  margin: "0 0 8px",
}

const footerCopy: React.CSSProperties = {
  color: "#9CA3AF",
  fontSize: "11px",
  lineHeight: "1.5",
  margin: 0,
}
