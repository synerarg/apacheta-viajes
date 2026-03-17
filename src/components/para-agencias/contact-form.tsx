"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { submitContactRequest } from "@/lib/contact/contact-request"

const inputClass =
  "bg-transparent border-b border-border py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"

export function ContactForm() {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    correoElectronico: "",
    tipoViaje: "",
    presupuestoEstimado: "",
    fechasEstimadas: "",
    numeroPasajeros: "",
    mensaje: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit() {
    try {
      setIsSubmitting(true)

      await submitContactRequest({
        nombreCompleto: formData.nombreCompleto,
        correoElectronico: formData.correoElectronico,
        tipoViaje: formData.tipoViaje || undefined,
        presupuestoEstimado: formData.presupuestoEstimado || undefined,
        fechasEstimadas: formData.fechasEstimadas || undefined,
        numeroPasajeros: formData.numeroPasajeros
          ? Number(formData.numeroPasajeros)
          : undefined,
        mensaje: formData.mensaje || undefined,
        metadata: {
          source: "para-agencias",
        },
      })

      setFormData({
        nombreCompleto: "",
        correoElectronico: "",
        tipoViaje: "",
        presupuestoEstimado: "",
        fechasEstimadas: "",
        numeroPasajeros: "",
        mensaje: "",
      })
      toast.success("Recibimos tu solicitud.")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo enviar la solicitud.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      autoComplete="off"
      onSubmit={(event) => {
        event.preventDefault()
        void handleSubmit()
      }}
      className="flex flex-col gap-5"
    >
      <div className="grid md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">
            Nombre Completo
          </label>
          <input
            type="text"
            autoComplete="name"
            value={formData.nombreCompleto}
            onChange={(event) =>
              setFormData((currentData) => ({
                ...currentData,
                nombreCompleto: event.target.value,
              }))
            }
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">
            Correo Electrónico
          </label>
          <input
            type="email"
            autoComplete="email"
            value={formData.correoElectronico}
            onChange={(event) =>
              setFormData((currentData) => ({
                ...currentData,
                correoElectronico: event.target.value,
              }))
            }
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">Tipo de Viaje</label>
          <Select
            value={formData.tipoViaje}
            onValueChange={(value) =>
              setFormData((currentData) => ({
                ...currentData,
                tipoViaje: value,
              }))
            }
          >
            <SelectTrigger className="bg-transparent border-0 border-b border-border rounded-none px-0 py-2 h-auto focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="receptivo">Turismo Receptivo</SelectItem>
              <SelectItem value="emisivo">Turismo Emisivo</SelectItem>
              <SelectItem value="corporativo">Viaje Corporativo</SelectItem>
              <SelectItem value="grupos">Grupos</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">
            Presupuesto Estimado
          </label>
          <input
            type="text"
            autoComplete="off"
            placeholder="Ej: USD 2.000 por persona"
            value={formData.presupuestoEstimado}
            onChange={(event) =>
              setFormData((currentData) => ({
                ...currentData,
                presupuestoEstimado: event.target.value,
              }))
            }
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">
            Fechas Estimadas
          </label>
          <input
            type="text"
            autoComplete="off"
            placeholder="Ej: vacaciones de julio"
            value={formData.fechasEstimadas}
            onChange={(event) =>
              setFormData((currentData) => ({
                ...currentData,
                fechasEstimadas: event.target.value,
              }))
            }
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">
            Número de Pasajeros
          </label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Ej: 4"
            value={formData.numeroPasajeros}
            onChange={(event) =>
              setFormData((currentData) => ({
                ...currentData,
                numeroPasajeros: event.target.value,
              }))
            }
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-muted-foreground">Mensaje</label>
        <textarea
          rows={3}
          autoComplete="off"
          placeholder="Contanos sobre tu viaje ideal..."
          value={formData.mensaje}
          onChange={(event) =>
            setFormData((currentData) => ({
              ...currentData,
              mensaje: event.target.value,
            }))
          }
          className={`${inputClass} resize-none`}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base mt-2"
      >
        Enviar Solicitud
      </Button>
    </form>
  )
}
