"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowRightIcon,
  BuildingsIcon,
  CheckCircleIcon,
  PhoneIcon,
  SparkleIcon,
  TagIcon,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { OperatorTypesRow } from "@/types/operator-types/operator-types.types"

type FormState = {
  nombre_comercial: string
  documento: string
  telefono_contacto: string
  email_contacto: string
  sitio_web: string
  experiencia_descripcion: string
  zona_operacion: string
  motivacion: string
  tipo_operador_id: string
}

const initialState: FormState = {
  nombre_comercial: "",
  documento: "",
  telefono_contacto: "",
  email_contacto: "",
  sitio_web: "",
  experiencia_descripcion: "",
  zona_operacion: "",
  motivacion: "",
  tipo_operador_id: "",
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] text-neutral-500 mt-1 leading-snug">{children}</p>
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string; weight?: "regular" | "fill" }>
  title: string
  subtitle: string
}) {
  return (
    <div className="flex items-start gap-3 pb-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" weight="fill" />
      </span>
      <div>
        <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
        <p className="text-xs text-neutral-500">{subtitle}</p>
      </div>
    </div>
  )
}

export function OperatorRequestForm({
  defaultEmail,
  defaultName,
  tipos,
}: {
  defaultEmail?: string | null
  defaultName?: string | null
  tipos: OperatorTypesRow[]
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [state, setState] = useState<FormState>({
    ...initialState,
    email_contacto: defaultEmail ?? "",
    nombre_comercial: defaultName ?? "",
  })
  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    nombre_comercial: false,
    documento: false,
    telefono_contacto: false,
    email_contacto: false,
    sitio_web: false,
    experiencia_descripcion: false,
    zona_operacion: false,
    motivacion: false,
    tipo_operador_id: false,
  })

  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email_contacto.trim()),
    [state.email_contacto],
  )
  const phoneValid = useMemo(
    () => state.telefono_contacto.replace(/\D/g, "").length >= 8,
    [state.telefono_contacto],
  )
  const nombreValid = state.nombre_comercial.trim().length >= 2
  const tipoValid = state.tipo_operador_id.length > 0

  const canSubmit =
    nombreValid && emailValid && phoneValid && tipoValid && !pending

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  function markTouched<K extends keyof FormState>(key: K) {
    setTouched((prev) => ({ ...prev, [key]: true }))
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) {
      setTouched({
        nombre_comercial: true,
        documento: true,
        telefono_contacto: true,
        email_contacto: true,
        sitio_web: true,
        experiencia_descripcion: true,
        zona_operacion: true,
        motivacion: true,
        tipo_operador_id: true,
      })
      toast.error("Revisá los campos obligatorios.")
      return
    }
    startTransition(async () => {
      try {
        const payload = Object.fromEntries(
          Object.entries(state).map(([key, value]) => [
            key,
            typeof value === "string" ? value.trim() : value,
          ]),
        )

        const response = await fetch("/api/solicitudes-operador", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as { error?: string } | null
          throw new Error(data?.error ?? "No se pudo enviar la solicitud")
        }

        toast.success("Solicitud enviada. Te contactamos cuando esté revisada.")
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error desconocido")
      }
    })
  }

  return (
    <form onSubmit={submit} className="space-y-8" noValidate>
      {/* Sección 1: datos comerciales */}
      <section className="space-y-4">
        <SectionHeader
          icon={BuildingsIcon}
          title="Datos comerciales"
          subtitle="Cómo te identificás como agencia u operador."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="nombre_comercial">
              Nombre comercial <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="nombre_comercial"
              required
              minLength={2}
              value={state.nombre_comercial}
              onChange={(e) => update("nombre_comercial", e.target.value)}
              onBlur={() => markTouched("nombre_comercial")}
              aria-invalid={touched.nombre_comercial && !nombreValid}
              placeholder="Ej: Viajes del Sol"
              className={
                touched.nombre_comercial && !nombreValid
                  ? "border-rose-300 focus-visible:ring-rose-300"
                  : ""
              }
            />
            {touched.nombre_comercial && !nombreValid ? (
              <FieldHint>
                <span className="text-rose-600">
                  Ingresá un nombre de al menos 2 caracteres.
                </span>
              </FieldHint>
            ) : (
              <FieldHint>Aparecerá en tus cotizaciones y comunicaciones.</FieldHint>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="documento">Documento / CUIT</Label>
            <Input
              id="documento"
              value={state.documento}
              onChange={(e) => update("documento", e.target.value)}
              placeholder="20-XXXXXXXX-X"
            />
            <FieldHint>Opcional. Ayuda a acelerar la verificación.</FieldHint>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sitio_web">Sitio web o redes</Label>
            <Input
              id="sitio_web"
              type="url"
              value={state.sitio_web}
              onChange={(e) => update("sitio_web", e.target.value)}
              placeholder="https://miagencia.com"
            />
            <FieldHint>Si tenés Instagram u otra red, también vale.</FieldHint>
          </div>
        </div>
      </section>

      {/* Sección 2: tipo de operador */}
      <section className="space-y-4 pt-6 border-t border-neutral-100">
        <SectionHeader
          icon={TagIcon}
          title="Tipo de operador"
          subtitle="Elegí la categoría para la que te postulás. Cada una tiene una comisión asociada."
        />
        <div className="space-y-1.5">
          <Label htmlFor="tipo_operador_id">
            Tipo <span className="text-rose-600">*</span>
          </Label>
          {tipos.length === 0 ? (
            <p className="text-sm text-rose-600">
              Todavía no hay tipos de operador disponibles. Comunicate con el equipo
              de Apacheta antes de enviar la solicitud.
            </p>
          ) : (
            <Select
              value={state.tipo_operador_id}
              onValueChange={(value) => {
                update("tipo_operador_id", value)
                markTouched("tipo_operador_id")
              }}
            >
              <SelectTrigger
                id="tipo_operador_id"
                aria-invalid={touched.tipo_operador_id && !tipoValid}
                className={`w-full ${
                  touched.tipo_operador_id && !tipoValid
                    ? "border-rose-300 focus-visible:ring-rose-300"
                    : ""
                }`}
              >
                <SelectValue placeholder="Elegí un tipo de operador" />
              </SelectTrigger>
              <SelectContent>
                {tipos.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {touched.tipo_operador_id && !tipoValid ? (
            <FieldHint>
              <span className="text-rose-600">
                Elegí el tipo para el que querés postularte.
              </span>
            </FieldHint>
          ) : (
            <FieldHint>
              El equipo de Apacheta puede ajustarlo al aprobar tu alta.
            </FieldHint>
          )}
        </div>
      </section>

      {/* Sección 3: contacto */}
      <section className="space-y-4 pt-6 border-t border-neutral-100">
        <SectionHeader
          icon={PhoneIcon}
          title="Contacto"
          subtitle="Cómo nos comunicamos con vos."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="telefono_contacto">
              Teléfono <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="telefono_contacto"
              required
              type="tel"
              value={state.telefono_contacto}
              onChange={(e) => update("telefono_contacto", e.target.value)}
              onBlur={() => markTouched("telefono_contacto")}
              aria-invalid={touched.telefono_contacto && !phoneValid}
              placeholder="+54 9 387 123 4567"
              className={
                touched.telefono_contacto && !phoneValid
                  ? "border-rose-300 focus-visible:ring-rose-300"
                  : ""
              }
            />
            {touched.telefono_contacto && !phoneValid ? (
              <FieldHint>
                <span className="text-rose-600">
                  Ingresá un teléfono válido con código de área.
                </span>
              </FieldHint>
            ) : (
              <FieldHint>Con código de país (ideal para WhatsApp).</FieldHint>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email_contacto">
              Email de contacto <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="email_contacto"
              required
              type="email"
              value={state.email_contacto}
              onChange={(e) => update("email_contacto", e.target.value)}
              onBlur={() => markTouched("email_contacto")}
              aria-invalid={touched.email_contacto && !emailValid}
              placeholder="contacto@miagencia.com"
              className={
                touched.email_contacto && !emailValid
                  ? "border-rose-300 focus-visible:ring-rose-300"
                  : ""
              }
            />
            {touched.email_contacto && !emailValid ? (
              <FieldHint>
                <span className="text-rose-600">
                  Ingresá un email con formato válido.
                </span>
              </FieldHint>
            ) : (
              <FieldHint>Lo usamos para comunicarnos con vos.</FieldHint>
            )}
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="zona_operacion">Zona de operación</Label>
            <Input
              id="zona_operacion"
              value={state.zona_operacion}
              onChange={(e) => update("zona_operacion", e.target.value)}
              placeholder="Salta, Jujuy, Tucumán..."
            />
            <FieldHint>
              Provincias o ciudades donde solés vender o tener clientes.
            </FieldHint>
          </div>
        </div>
      </section>

      {/* Sección 4: experiencia */}
      <section className="space-y-4 pt-6 border-t border-neutral-100">
        <SectionHeader
          icon={SparkleIcon}
          title="Contanos sobre vos"
          subtitle="Esto nos ayuda a aprobar tu alta más rápido."
        />
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="experiencia_descripcion">Experiencia previa</Label>
            <Textarea
              id="experiencia_descripcion"
              rows={3}
              value={state.experiencia_descripcion}
              onChange={(e) => update("experiencia_descripcion", e.target.value)}
              placeholder="Trabajé 3 años en una agencia mayorista en Salta..."
            />
            <FieldHint>
              Años en turismo, tipo de viajes que vendés, mayorista o minorista, etc.
            </FieldHint>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="motivacion">
              ¿Por qué querés ser operador de Apacheta?
            </Label>
            <Textarea
              id="motivacion"
              rows={3}
              value={state.motivacion}
              onChange={(e) => update("motivacion", e.target.value)}
              placeholder="Tengo clientes que me piden Norte argentino y necesito un proveedor confiable..."
            />
            <FieldHint>
              Tu motivación y el tipo de clientes que ya estás manejando.
            </FieldHint>
          </div>
        </div>
      </section>

      {/* Submit */}
      <div className="flex flex-col gap-3 pt-6 border-t border-neutral-100 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2 text-xs text-neutral-500 sm:max-w-xs">
          <CheckCircleIcon className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" weight="fill" />
          <span>
            Tu información se mantiene confidencial. Solo el equipo de Apacheta la usa
            para validar tu alta.
          </span>
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={pending || tipos.length === 0}
          className="w-full sm:w-auto"
        >
          {pending ? "Enviando..." : "Enviar solicitud"}
          {!pending ? <ArrowRightIcon className="h-4 w-4" weight="bold" /> : null}
        </Button>
      </div>
    </form>
  )
}
