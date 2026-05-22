"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function todayISO() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

function plusDaysISO(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function NewQuoteClient() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [retrying, setRetrying] = useState(false)

  async function createDraft() {
    setError(null)
    try {
      const res = await fetch("/api/cotizaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_nombre: "",
          cliente_email: "",
          cliente_telefono: "",
          fecha_inicio: todayISO(),
          fecha_fin: plusDaysISO(7),
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || "No pudimos crear el borrador")
      }
      const data = await res.json()
      const id = data?.cotizacion?.id ?? data?.data?.id ?? data?.id
      if (!id) throw new Error("Respuesta inválida del servidor")
      router.replace(`/operador/cotizaciones/${id}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error inesperado"
      setError(msg)
      toast.error(msg)
    }
  }

  useEffect(() => {
    createDraft()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      <CardContent className="py-12 text-center space-y-3">
        <h2 className="font-playfair text-xl font-semibold text-neutral-900">
          Creando nueva cotización…
        </h2>
        <p className="text-sm text-neutral-500">
          Te estamos llevando al editor.
        </p>
        {error ? (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-rose-600">{error}</p>
            <Button
              size="sm"
              onClick={async () => {
                setRetrying(true)
                await createDraft()
                setRetrying(false)
              }}
              disabled={retrying}
            >
              {retrying ? "Reintentando…" : "Reintentar"}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
