"use client"

import { useState } from "react"
import { toast } from "sonner"
import { WhatsappLogo, Copy, LinkSimple } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

export function DepartureActions({
  text,
  publicUrl,
  clienteTelefono,
}: {
  text: string
  publicUrl: string
  clienteEmail?: string | null
  clienteTelefono: string | null
}) {
  const [waOpen, setWaOpen] = useState(false)
  const [phone, setPhone] = useState(clienteTelefono ?? "")

  async function copy(content: string, label: string) {
    try {
      await navigator.clipboard.writeText(content)
      toast.success(`${label} copiado al portapapeles`)
    } catch {
      toast.error("No pudimos copiar al portapapeles")
    }
  }

  function openWhatsAppDirect() {
    const clean = (clienteTelefono ?? "").replace(/\D/g, "")
    const encoded = encodeURIComponent(text)
    const url = clean
      ? `https://wa.me/${clean}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`
    window.open(url, "_blank")
  }

  function openWhatsAppFromSheet() {
    const clean = phone.replace(/\D/g, "")
    if (!clean) {
      toast.error("Ingresá un teléfono válido")
      return
    }
    const url = `https://wa.me/${clean}?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
    setWaOpen(false)
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            if (clienteTelefono) {
              openWhatsAppDirect()
            } else {
              setPhone("")
              setWaOpen(true)
            }
          }}
        >
          <WhatsappLogo />
          WhatsApp
        </Button>
        <Button variant="outline" size="sm" onClick={() => copy(text, "Texto")}>
          <Copy />
          Copiar texto
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copy(publicUrl, "Link público")}
        >
          <LinkSimple />
          Copiar link
        </Button>
      </div>

      <Sheet open={waOpen} onOpenChange={setWaOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Enviar por WhatsApp</SheetTitle>
            <SheetDescription>
              Ingresá el teléfono del cliente con código de país (sin espacios ni guiones).
            </SheetDescription>
          </SheetHeader>
          <div className="p-4 space-y-3">
            <div>
              <Label className="text-xs">Teléfono</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+54 9 387 123 4567"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setWaOpen(false)}>
                Cancelar
              </Button>
              <Button size="sm" onClick={openWhatsAppFromSheet}>
                Abrir WhatsApp
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
