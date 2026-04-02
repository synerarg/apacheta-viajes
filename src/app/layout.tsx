import type { Metadata } from "next"
import { Playfair_Display, Lato } from "next/font/google"
import { Toaster } from "sonner"

import { AuthSessionSync } from "@/components/auth/auth-session-sync"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { TooltipProvider } from "@/components/ui/tooltip"

import "./globals.css"

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
})

const lato = Lato({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "300", "400", "700", "900"],
})

const SITE_URL = "https://apacheta-viajes.vercel.app"
const SITE_NAME = "Apacheta Viajes"
const DEFAULT_TITLE =
  "Apacheta Viajes | Operador turistico boutique del Norte Argentino"
const DEFAULT_DESCRIPTION =
  "Apacheta Viajes es un operador turistico boutique especializado en el Norte Argentino. Creamos viajes a medida, experiencias autenticas, hoteleria y salidas para agencias desde Salta y Jujuy."
const DEFAULT_OG_IMAGE = "/cta-image.png"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  referrer: "origin-when-cross-origin",
  keywords: [
    "Apacheta Viajes",
    "turismo en Salta",
    "turismo en Jujuy",
    "viajes al NOA",
    "Norte Argentino",
    "operador turistico",
    "agencia de viajes en Salta",
    "experiencias en Salta",
    "paquetes al NOA",
    "DMC Argentina",
    "viajes a medida",
    "turismo receptivo",
    "hoteleria en Salta",
    "Mercado Pago",
    "transferencia bancaria",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "travel",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Apacheta Viajes, operador turistico boutique del Norte Argentino",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", href: "/favicon.png" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: ["/favicon.png"],
    apple: [{ url: "/favicon.png" }],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body
        className={`${playfairDisplay.variable} ${lato.className} antialiased`}
      >
        <TooltipProvider>
          <AuthSessionSync />
          <Toaster richColors position="bottom-right" />
          <Navbar />
          {children}
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  )
}
