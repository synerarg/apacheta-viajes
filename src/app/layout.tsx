import type { Metadata } from "next"
import { Playfair_Display, Lato } from "next/font/google"

import { AuthSessionSync } from "@/components/auth/auth-session-sync"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

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

export const metadata: Metadata = {
  title: "Apacheta Viajes — Operador Turístico del Norte Argentino",
  description:
    "DMC especializado en el NOA. Flota propia, diseño a medida y 25 años de experiencia en Salta y Jujuy.",
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
        <AuthSessionSync />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
