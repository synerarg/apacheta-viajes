import { notFound } from "next/navigation"
import { headers } from "next/headers"
import type { Metadata } from "next"

import {
  QuotePublicaView,
  type QuotePublicaData,
} from "@/components/quote/public-quote-view"

export const dynamic = "force-dynamic"

async function fetchPublic(token: string): Promise<QuotePublicaData | null> {
  const hdrs = await headers()
  const host = hdrs.get("host")
  const proto = hdrs.get("x-forwarded-proto") ?? "http"
  if (!host) return null
  const url = `${proto}://${host}/api/cotizaciones/public/${token}`
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) return null
  const data = await res.json().catch(() => null)
  if (!data) return null
  // accept either { data: ... } or root object
  const payload = (data?.data ?? data) as QuotePublicaData
  if (!payload || !payload.id) return null
  return payload
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>
}): Promise<Metadata> {
  const { token } = await params
  const data = await fetchPublic(token)
  if (!data) {
    return { title: "Cotización no encontrada" }
  }
  return {
    title: `Cotización para ${data.cliente_nombre ?? "tu viaje"}`,
    description: "Cotización personalizada de Apacheta Viajes",
    robots: { index: false, follow: false },
  }
}

export default async function QuotePublicaPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const data = await fetchPublic(token)
  if (!data) notFound()

  return <QuotePublicaView data={data} />
}
