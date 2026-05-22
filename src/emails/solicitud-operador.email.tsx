import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "@react-email/components"

export interface OperatorRequestEmailProps {
  previewText: string
  eyebrow: string
  title: string
  greeting: string
  intro: string
  highlight?: { label: string; value: string } | null
  bullets?: string[]
  actionLabel?: string
  actionUrl?: string
  supportEmail?: string | null
}

const SITE_URL = "https://apacheta-viajes.vercel.app"

export function OperatorRequestEmail({
  previewText,
  eyebrow,
  title,
  greeting,
  intro,
  highlight,
  bullets,
  actionLabel,
  actionUrl,
  supportEmail,
}: OperatorRequestEmailProps) {
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
            <Section className="bg-dark py-7 px-8 text-center">
              <Img
                src={`${SITE_URL}/branding/Artboard%207.png`}
                width="160"
                height="60"
                alt="Apacheta Viajes"
                className="mx-auto"
              />
            </Section>
            <Section className="bg-brand h-[3px] w-full" />
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
              <Text className="text-muted text-[15px] leading-relaxed m-0 mb-6 whitespace-pre-line">
                {intro}
              </Text>

              {highlight ? (
                <Section
                  className="bg-card rounded-md mb-6 px-6 py-4"
                  style={{
                    border: "1px solid #E5E7EB",
                    borderLeft: "3px solid #8B1A1A",
                  }}
                >
                  <Text className="text-muted text-[12px] font-medium tracking-wide uppercase m-0 mb-1">
                    {highlight.label}
                  </Text>
                  <Text className="text-[#1E1E1E] text-[15px] font-medium leading-relaxed m-0 whitespace-pre-line">
                    {highlight.value}
                  </Text>
                </Section>
              ) : null}

              {bullets && bullets.length > 0 ? (
                <Section className="mb-6">
                  {bullets.map((item, index) => (
                    <Text
                      key={index}
                      className="text-muted text-sm leading-relaxed m-0 mb-2"
                    >
                      • {item}
                    </Text>
                  ))}
                </Section>
              ) : null}

              {actionLabel && actionUrl ? (
                <Section className="text-center mt-2">
                  <Button
                    href={actionUrl}
                    className="bg-brand text-white text-sm font-bold py-3.5 px-8 rounded-md no-underline box-border"
                  >
                    {actionLabel}
                  </Button>
                </Section>
              ) : null}
            </Section>
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

export default OperatorRequestEmail
