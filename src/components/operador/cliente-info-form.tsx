"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDebouncedCallback } from "./use-debounced-callback"

export type ClienteInfo = {
  cliente_nombre: string | null
  cliente_email: string | null
  cliente_telefono: string | null
}

export function ClienteInfoForm({
  initial,
  readonly,
  onPatch,
}: {
  initial: ClienteInfo
  readonly?: boolean
  onPatch: (patch: Partial<ClienteInfo>) => Promise<void>
}) {
  const [nombre, setNombre] = useState(initial.cliente_nombre ?? "")
  const [email, setEmail] = useState(initial.cliente_email ?? "")
  const [telefono, setTelefono] = useState(initial.cliente_telefono ?? "")

  const debouncedSave = useDebouncedCallback(
    (patch: Partial<ClienteInfo>) => {
      onPatch(patch)
    },
    600,
  )

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div>
        <Label className="text-xs">Nombre del cliente</Label>
        <Input
          value={nombre}
          disabled={readonly}
          onChange={(e) => {
            setNombre(e.target.value)
            debouncedSave({ cliente_nombre: e.target.value })
          }}
          placeholder="Juan Pérez"
        />
      </div>
      <div>
        <Label className="text-xs">Email</Label>
        <Input
          type="email"
          value={email}
          disabled={readonly}
          onChange={(e) => {
            setEmail(e.target.value)
            debouncedSave({ cliente_email: e.target.value })
          }}
          placeholder="cliente@email.com"
        />
      </div>
      <div>
        <Label className="text-xs">Teléfono</Label>
        <Input
          value={telefono}
          disabled={readonly}
          onChange={(e) => {
            setTelefono(e.target.value)
            debouncedSave({ cliente_telefono: e.target.value })
          }}
          placeholder="+54 9 387 123 4567"
        />
      </div>
    </div>
  )
}
