"use client"

export interface ContactRequestPayload {
  nombreCompleto: string
  correoElectronico?: string
  tipoViaje?: string
  presupuestoEstimado?: string
  fechasEstimadas?: string
  numeroPasajeros?: number
  mensaje?: string
  metadata?: {
    source: "landing" | "para-agencias"
    agencyName?: string
    phone?: string
  }
}

export async function submitContactRequest(payload: ContactRequestPayload) {
  const response = await fetch("/api/contact-requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
  const result = (await response.json()) as {
    id?: string
    message?: string
    error?: string
  }

  if (!response.ok) {
    throw new Error(result.error ?? "No se pudo enviar la solicitud.")
  }

  return result
}
