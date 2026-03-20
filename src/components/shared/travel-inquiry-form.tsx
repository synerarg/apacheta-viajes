"use client"

import { useState } from "react"
import { toast } from "sonner"

import { CustomSelect } from "@/components/ui/custom-select"
import { submitContactRequest } from "@/lib/contact/contact-request"

// ─── Opciones de tipo de viaje ────────────────────────────────────────────────

const TIPO_VIAJE_AGENCIAS = [
  { value: "receptivo", label: "Turismo Receptivo" },
  { value: "emisivo", label: "Turismo Emisivo" },
  { value: "corporativo", label: "Viaje Corporativo" },
  { value: "grupos", label: "Grupos" },
  { value: "otro", label: "Otro" },
]

const TIPO_VIAJE_CONTACTO = [
  { value: "paquete-noa", label: "Paquete NOA" },
  { value: "experiencia", label: "Experiencia" },
  { value: "hoteleria", label: "Hotelería" },
  { value: "emisivo", label: "Emisivo" },
]

// ─── Configuración por fuente ─────────────────────────────────────────────────

type Source = "landing" | "para-agencias" | "contacto"
type SecondField = "agency" | "email"

type SourceConfig = {
  secondField: SecondField
  secondFieldLabel: string
  secondFieldAutoComplete: string
  tipoViajeOptions: { value: string; label: string }[]
  /** true = labels encima + placeholders de ayuda; false = solo placeholders */
  showLabels: boolean
  /** "default" = tokens foreground/border; "branded" = dark-brown/off-white */
  variant: "default" | "branded"
  inputClass: string
  submitClass: string
}

const SOURCE_CONFIG: Record<Source, SourceConfig> = {
  landing: {
    secondField: "agency",
    secondFieldLabel: "Agencia / Empresa (Opcional)",
    secondFieldAutoComplete: "organization",
    tipoViajeOptions: TIPO_VIAJE_AGENCIAS,
    showLabels: true,
    variant: "default",
    inputClass:
      "bg-transparent border-b border-border py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors",
    submitClass:
      "w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base mt-2",
  },
  "para-agencias": {
    secondField: "email",
    secondFieldLabel: "Correo Electrónico",
    secondFieldAutoComplete: "email",
    tipoViajeOptions: TIPO_VIAJE_AGENCIAS,
    showLabels: true,
    variant: "default",
    inputClass:
      "bg-transparent border-b border-border py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors",
    submitClass:
      "w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base mt-2",
  },
  contacto: {
    secondField: "email",
    secondFieldLabel: "Correo Electrónico",
    secondFieldAutoComplete: "email",
    tipoViajeOptions: TIPO_VIAJE_CONTACTO,
    showLabels: false,
    variant: "branded",
    inputClass:
      "w-full bg-transparent border-0 border-b border-dark-brown rounded-none px-0 py-3 font-sans text-base text-dark-brown placeholder:text-subtle focus:outline-none focus:border-primary transition-all",
    submitClass:
      "w-full bg-primary hover:bg-primary/80 text-off-white font-sans text-lg font-bold py-4 rounded-none transition-colors",
  },
}

// ─── Estado del formulario ────────────────────────────────────────────────────

type FormState = {
  nombreCompleto: string
  secondFieldValue: string
  tipoViaje: string
  presupuestoEstimado: string
  fechasEstimadas: string
  numeroPasajeros: string
  mensaje: string
}

const EMPTY: FormState = {
  nombreCompleto: "",
  secondFieldValue: "",
  tipoViaje: "",
  presupuestoEstimado: "",
  fechasEstimadas: "",
  numeroPasajeros: "",
  mensaje: "",
}

// ─── Componente ───────────────────────────────────────────────────────────────

type Props = {
  source: Source
  className?: string
}

export function TravelInquiryForm({ source, className }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const cfg = SOURCE_CONFIG[source]

  function field(key: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      await submitContactRequest({
        nombreCompleto: form.nombreCompleto,
        correoElectronico: cfg.secondField === "email" ? form.secondFieldValue : undefined,
        tipoViaje: form.tipoViaje || undefined,
        presupuestoEstimado: form.presupuestoEstimado || undefined,
        fechasEstimadas: form.fechasEstimadas || undefined,
        numeroPasajeros: form.numeroPasajeros ? Number(form.numeroPasajeros) : undefined,
        mensaje: form.mensaje || undefined,
        metadata: {
          source,
          agencyName:
            cfg.secondField === "agency" ? form.secondFieldValue || undefined : undefined,
        },
      })
      setForm(EMPTY)
      toast.success("Recibimos tu solicitud.")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo enviar la solicitud.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Wrapper de campo: muestra label encima solo si showLabels=true
  function Field({
    label,
    children,
  }: {
    label: string
    children: React.ReactNode
  }) {
    return (
      <div className="flex flex-col gap-1.5">
        {cfg.showLabels && (
          <label className="text-sm text-muted-foreground">{label}</label>
        )}
        {children}
      </div>
    )
  }

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit}
      className={`flex flex-col gap-5 ${className ?? ""}`}
    >
      {/* Fila 1 – Nombre + segundo campo variable */}
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Nombre Completo">
          <input
            type="text"
            autoComplete="name"
            placeholder={cfg.showLabels ? undefined : "Nombre Completo"}
            value={form.nombreCompleto}
            onChange={field("nombreCompleto")}
            className={cfg.inputClass}
          />
        </Field>

        <Field label={cfg.secondFieldLabel}>
          <input
            type={cfg.secondField === "email" ? "email" : "text"}
            autoComplete={cfg.secondFieldAutoComplete}
            placeholder={cfg.showLabels ? undefined : cfg.secondFieldLabel}
            value={form.secondFieldValue}
            onChange={field("secondFieldValue")}
            className={cfg.inputClass}
          />
        </Field>
      </div>

      {/* Fila 2 – Tipo de viaje + presupuesto */}
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Tipo de Viaje">
          <CustomSelect
            value={form.tipoViaje}
            onChange={(val) => setForm((prev) => ({ ...prev, tipoViaje: val }))}
            placeholder={cfg.showLabels ? "Seleccionar..." : "Tipo de Viaje"}
            options={cfg.tipoViajeOptions}
            variant={cfg.variant}
          />
        </Field>

        <Field label="Presupuesto Estimado">
          <input
            type="text"
            autoComplete="off"
            placeholder={
              cfg.showLabels ? "Ej: USD 2.000 por persona" : "Presupuesto Estimado"
            }
            value={form.presupuestoEstimado}
            onChange={field("presupuestoEstimado")}
            className={cfg.inputClass}
          />
        </Field>
      </div>

      {/* Fila 3 – Fechas + pasajeros */}
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Fechas Estimadas">
          <input
            type="text"
            autoComplete="off"
            placeholder={
              cfg.showLabels ? "Ej: vacaciones de julio" : "Fechas Estimadas"
            }
            value={form.fechasEstimadas}
            onChange={field("fechasEstimadas")}
            className={cfg.inputClass}
          />
        </Field>

        <Field label="Número de Pasajeros">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder={cfg.showLabels ? "Ej: 4" : "Número de Pasajeros"}
            value={form.numeroPasajeros}
            onChange={field("numeroPasajeros")}
            className={cfg.inputClass}
          />
        </Field>
      </div>

      {/* Mensaje */}
      <Field label="Mensaje">
        <textarea
          rows={cfg.showLabels ? 3 : 5}
          autoComplete="off"
          placeholder={
            cfg.showLabels ? "Contanos sobre tu viaje ideal..." : "Mensaje"
          }
          value={form.mensaje}
          onChange={field("mensaje")}
          className={`${cfg.inputClass} resize-none`}
        />
      </Field>

      <button type="submit" disabled={isSubmitting} className={cfg.submitClass}>
        Enviar Solicitud
      </button>
    </form>
  )
}
