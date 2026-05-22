"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDebouncedCallback } from "./use-debounced-callback"

export type ClientInfo = {
  cliente_nombre: string | null
  cliente_email: string | null
  cliente_telefono: string | null
}

export type ClientInfoFormHandle = {
  flush: () => void
}

type Props = {
  initial: ClientInfo
  readonly?: boolean
  onPatch: (patch: Partial<ClientInfo>) => Promise<void>
}

export const ClientInfoForm = forwardRef<ClientInfoFormHandle, Props>(
  function ClientInfoForm({ initial, readonly, onPatch }, ref) {
    const [nombre, setNombre] = useState(initial.cliente_nombre ?? "")
    const [email, setEmail] = useState(initial.cliente_email ?? "")
    const [telefono, setTelefono] = useState(initial.cliente_telefono ?? "")

    const dirtyRef = useRef(false)

    // Sincronizar inputs con los valores del servidor cuando llega un refresh
    // externo. dirtyRef evita pisar lo que el usuario está escribiendo.
    useEffect(() => {
      if (dirtyRef.current) return
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNombre(initial.cliente_nombre ?? "")
      setEmail(initial.cliente_email ?? "")
      setTelefono(initial.cliente_telefono ?? "")
    }, [initial.cliente_nombre, initial.cliente_email, initial.cliente_telefono])

    const debouncedSave = useDebouncedCallback(
      (patch: Partial<ClientInfo>) => {
        dirtyRef.current = false
        onPatch(patch).catch(() => {
          dirtyRef.current = false
        })
      },
      600,
    )

    useImperativeHandle(
      ref,
      () => ({
        flush: () => debouncedSave.flush(),
      }),
      [debouncedSave],
    )

    return (
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label className="text-xs">Nombre del cliente</Label>
          <Input
            value={nombre}
            disabled={readonly}
            maxLength={120}
            onChange={(e) => {
              dirtyRef.current = true
              setNombre(e.target.value)
              debouncedSave({ cliente_nombre: e.target.value })
            }}
            onBlur={() => debouncedSave.flush()}
            placeholder="Juan Pérez"
          />
        </div>
        <div>
          <Label className="text-xs">Email</Label>
          <Input
            type="email"
            value={email}
            disabled={readonly}
            maxLength={120}
            onChange={(e) => {
              dirtyRef.current = true
              setEmail(e.target.value)
              debouncedSave({ cliente_email: e.target.value })
            }}
            onBlur={() => debouncedSave.flush()}
            placeholder="cliente@email.com"
          />
        </div>
        <div>
          <Label className="text-xs">Teléfono</Label>
          <Input
            value={telefono}
            disabled={readonly}
            maxLength={40}
            onChange={(e) => {
              dirtyRef.current = true
              setTelefono(e.target.value)
              debouncedSave({ cliente_telefono: e.target.value })
            }}
            onBlur={() => debouncedSave.flush()}
            placeholder="+54 9 387 123 4567"
          />
        </div>
      </div>
    )
  },
)
