import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  ArrowRightIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ChatCircleTextIcon,
  CurrencyDollarIcon,
  HourglassMediumIcon,
  PaperPlaneTiltIcon,
  ShareNetworkIcon,
  SparkleIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr"

import { Card, CardContent } from "@/components/ui/card"
import { OperatorRequestCancelButton } from "@/components/account/operator-request-cancel-button"
import { OperatorRequestForm } from "@/components/account/operator-request-form"
import { Button } from "@/components/ui/button"
import { createServerOperatorRequestsController } from "@/controllers/operator-requests/operator-requests.controller"
import { createClient } from "@/lib/supabase/server"
import type { OperatorRequestsRow } from "@/types/operator-requests/operator-requests.types"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Convertite en operador · Apacheta Viajes",
  description:
    "Sumate como operador de Apacheta Viajes: armá cotizaciones personalizadas, accedé a precios netos del Norte argentino y ganá comisión por cada reserva.",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

type Estado = OperatorRequestsRow["estado"]

const STATUS_STEPS: { key: Estado; label: string }[] = [
  { key: "pendiente", label: "Recibida" },
  { key: "en_revision", label: "En revisión" },
  { key: "aprobada", label: "Aprobada" },
]

function StatusTimeline({ estado }: { estado: Estado }) {
  if (estado === "rechazada" || estado === "cancelada") {
    return (
      <div
        className={`flex items-center gap-2 rounded-md px-4 py-3 text-sm ${
          estado === "rechazada"
            ? "bg-rose-50 text-rose-900 border border-rose-200"
            : "bg-neutral-100 text-neutral-700 border border-neutral-200"
        }`}
      >
        <XCircleIcon className="h-5 w-5 shrink-0" weight="fill" />
        <span className="font-medium">
          {estado === "rechazada" ? "Solicitud rechazada" : "Solicitud cancelada"}
        </span>
      </div>
    )
  }

  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === estado)
  return (
    <ol className="grid grid-cols-3 gap-2">
      {STATUS_STEPS.map((step, idx) => {
        const done = idx < currentIdx || estado === "aprobada"
        const active = idx === currentIdx && estado !== "aprobada"
        return (
          <li key={step.key} className="flex flex-col items-center text-center gap-1.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                done
                  ? "bg-emerald-500 text-white"
                  : active
                  ? "bg-primary text-white ring-4 ring-primary/15"
                  : "bg-neutral-100 text-neutral-400"
              }`}
            >
              {done ? <CheckCircleIcon className="h-5 w-5" weight="fill" /> : idx + 1}
            </div>
            <p
              className={`text-[11px] leading-tight font-medium ${
                done || active ? "text-neutral-900" : "text-neutral-400"
              }`}
            >
              {step.label}
            </p>
          </li>
        )
      })}
    </ol>
  )
}

const BENEFITS = [
  {
    icon: CurrencyDollarIcon,
    title: "Ganá una comisión real",
    description:
      "Cada cotización te muestra tu comisión efectiva antes de enviarla al cliente.",
  },
  {
    icon: SparkleIcon,
    title: "Catálogo curado y actualizado",
    description:
      "Excursiones, traslados, hoteles y paquetes con precios y descripciones listos para usar.",
  },
  {
    icon: ShareNetworkIcon,
    title: "Compartí al instante",
    description:
      "Mandá la cotización por WhatsApp, email o link público. El cliente la ve como una propuesta profesional.",
  },
]

const STEPS = [
  {
    icon: PaperPlaneTiltIcon,
    title: "Enviás tu solicitud",
    description: "Completás un formulario simple con tus datos comerciales.",
  },
  {
    icon: HourglassMediumIcon,
    title: "Revisamos tu alta",
    description:
      "Validamos tus datos en un plazo de 24 a 72 hs hábiles. Si necesitamos algo más, nos comunicamos con vos.",
  },
  {
    icon: BriefcaseIcon,
    title: "Empezás a cotizar",
    description:
      "Una vez aprobada, entrás al panel desde tu cuenta y empezás a armar cotizaciones.",
  },
]

export default async function CuentaOperatorPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/account/operador")
  }

  const { data: profile } = await supabase
    .from("usuarios")
    .select("tipo, nombre, apellido, email")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.tipo === "operador") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <Card className="text-center">
          <CardContent className="py-10 px-6 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircleIcon className="h-7 w-7" weight="fill" />
            </div>
            <div className="space-y-1">
              <h1 className="font-playfair text-2xl font-bold text-neutral-900">
                Ya sos operador
              </h1>
              <p className="text-sm text-neutral-500">
                Tu cuenta tiene acceso al panel de operador. Empezá a armar tu próxima cotización.
              </p>
            </div>
            <Button asChild size="lg" className="mt-2">
              <Link href="/operador">
                Ir al panel de operador
                <ArrowRightIcon className="h-4 w-4" weight="bold" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (profile?.tipo === "admin") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <Card className="text-center">
          <CardContent className="py-10 px-6 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BriefcaseIcon className="h-7 w-7" weight="fill" />
            </div>
            <div className="space-y-1">
              <h1 className="font-playfair text-2xl font-bold text-neutral-900">
                Sos administrador
              </h1>
              <p className="text-sm text-neutral-500">
                Como admin podés ver y moderar todas las solicitudes desde el dashboard.
              </p>
            </div>
            <Button asChild size="lg" className="mt-2">
              <Link href="/dashboard/operadores/solicitudes">
                Ver solicitudes
                <ArrowRightIcon className="h-4 w-4" weight="bold" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const controller = await createServerOperatorRequestsController()
  const solicitudes = await controller.listMine(user.id)
  const active = solicitudes.find((s) =>
    s.estado === "pendiente" || s.estado === "en_revision",
  )
  const lastClosed = solicitudes.find(
    (s) => s.estado === "rechazada" || s.estado === "cancelada" || s.estado === "aprobada",
  )

  return (
    <div className="bg-linear-to-b from-neutral-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-32 space-y-12">
        {/* Hero */}
        <header className="space-y-4 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <BriefcaseIcon className="h-3.5 w-3.5" weight="fill" />
            Programa de operadores
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">
            Convertite en operador
            <br />
            <span className="text-primary">de Apacheta Viajes</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
            Armá cotizaciones personalizadas combinando excursiones, traslados, hoteles y
            paquetes. Compartí propuestas profesionales con tus clientes y ganá una
            comisión por cada reserva.
          </p>
        </header>

        {/* Estado activo */}
        {active ? (
          <Card className="border-primary/20">
            <CardContent className="py-6 px-6 space-y-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                    Tu solicitud
                  </p>
                  <h2 className="font-playfair text-xl font-bold text-neutral-900">
                    {active.nombre_comercial}
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Enviada el {formatDate(active.created_at)}
                  </p>
                </div>
              </div>

              <StatusTimeline estado={active.estado} />

              <div className="rounded-md bg-neutral-50 border border-neutral-200 p-4 text-sm text-neutral-700 space-y-2">
                <div className="flex items-start gap-2">
                  <ChatCircleTextIcon className="h-4 w-4 mt-0.5 shrink-0 text-neutral-500" />
                  <p>
                    Volvé a esta página para ver el estado de tu solicitud. Si
                    necesitás corregir datos, cancelala y enviá una nueva.
                  </p>
                </div>
              </div>

              {active.estado === "pendiente" ? (
                <div className="pt-2">
                  <OperatorRequestCancelButton requestId={active.id} />
                </div>
              ) : null}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Beneficios */}
            <section className="grid gap-4 sm:grid-cols-3">
              {BENEFITS.map(({ icon: Icon, title, description }) => (
                <Card key={title} className="border-neutral-200">
                  <CardContent className="py-5 px-5 space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" weight="fill" />
                    </div>
                    <h3 className="font-semibold text-neutral-900">{title}</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </section>

            {/* Cómo funciona */}
            <section className="space-y-5">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-primary font-semibold">
                  Cómo funciona
                </p>
                <h2 className="font-playfair text-2xl font-bold text-neutral-900">
                  De solicitud a primera cotización en 3 pasos
                </h2>
              </div>
              <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {STEPS.map(({ icon: Icon, title, description }, idx) => (
                  <li
                    key={title}
                    className="relative rounded-md border border-neutral-200 bg-white p-5 space-y-3"
                  >
                    <span className="absolute top-3 right-3 text-3xl font-playfair font-bold text-neutral-100">
                      0{idx + 1}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-neutral-100 text-neutral-700">
                      <Icon className="h-5 w-5" weight="regular" />
                    </div>
                    <h3 className="font-semibold text-neutral-900 text-sm">
                      {title}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {description}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Form */}
            <section id="formulario" className="space-y-5">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-primary font-semibold">
                  Solicitar acceso
                </p>
                <h2 className="font-playfair text-2xl font-bold text-neutral-900">
                  Completá tus datos comerciales
                </h2>
                <p className="text-sm text-neutral-500">
                  Los datos marcados con * son obligatorios. Todo el resto nos ayuda a
                  validar tu perfil más rápido.
                </p>
              </div>

              {lastClosed?.estado === "rechazada" && lastClosed.motivo_rechazo ? (
                <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm space-y-1">
                  <p className="font-semibold text-rose-900 flex items-center gap-2">
                    <XCircleIcon className="h-4 w-4" weight="fill" />
                    Tu solicitud anterior fue rechazada
                  </p>
                  <p className="text-rose-800">{lastClosed.motivo_rechazo}</p>
                </div>
              ) : null}

              <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
                <Card>
                  <CardContent className="py-6 px-6">
                    <OperatorRequestForm
                      defaultEmail={profile?.email ?? user.email ?? null}
                      defaultName={[profile?.nombre, profile?.apellido].filter(Boolean).join(" ") || null}
                    />
                  </CardContent>
                </Card>

                <aside className="space-y-4 lg:sticky lg:top-6">
                  

                  <Card>
                    <CardContent className="py-5 px-5 space-y-2">
                      <h3 className="text-sm font-semibold text-neutral-900">
                        ¿Tenés dudas?
                      </h3>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Escribinos antes de mandar la solicitud y te asesoramos sobre el
                        alta.
                      </p>
                      <Button asChild variant="outline" size="sm" className="w-full mt-2">
                        <Link href="/contacto">
                          <ChatCircleTextIcon className="h-4 w-4" />
                          Hablar con el equipo
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </aside>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
