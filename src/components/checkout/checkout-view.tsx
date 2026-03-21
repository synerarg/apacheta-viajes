"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { Landmark, Banknote } from "lucide-react"

import { MercadoPagoIcon } from "@/components/icons/mercadopago"
import { useCart } from "@/hooks/use-cart"
import {
  clearCart,
  saveLastCheckoutSnapshot,
} from "@/lib/cart/cart-storage"
import { createClient } from "@/lib/supabase/client"
import type {
  CheckoutPaymentMethod,
  CheckoutProfileResult,
  CheckoutSubmitResult,
} from "@/types/checkout/checkout.types"

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`
}

const CHECKOUT_FORM_DRAFT_STORAGE_KEY = "apacheta:checkout-form-draft"

const EMPTY_CONTACT = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
}

const EMPTY_PASSENGER = {
  fullName: "",
  documentNumber: "",
  birthDate: "",
  nationality: "",
  specialRequirements: "",
}

function isBrowser() {
  return typeof window !== "undefined"
}

function parseCheckoutFormState(rawValue: string | null): {
  paymentMethod: CheckoutPaymentMethod
  contact: typeof EMPTY_CONTACT
  passenger: typeof EMPTY_PASSENGER
} | null {
  if (!rawValue) return null
  try {
    const parsed = JSON.parse(rawValue) as {
      paymentMethod?: CheckoutPaymentMethod
      contact?: typeof EMPTY_CONTACT
      passenger?: typeof EMPTY_PASSENGER
    }
    return {
      paymentMethod:
        parsed.paymentMethod === "mercadopago" ||
        parsed.paymentMethod === "transferencia" ||
        parsed.paymentMethod === "efectivo"
          ? parsed.paymentMethod
          : "mercadopago",
      contact: { ...EMPTY_CONTACT, ...parsed.contact },
      passenger: { ...EMPTY_PASSENGER, ...parsed.passenger },
    }
  } catch {
    return null
  }
}

function loadCheckoutDraftState() {
  if (!isBrowser()) return null
  return parseCheckoutFormState(
    window.localStorage.getItem(CHECKOUT_FORM_DRAFT_STORAGE_KEY),
  )
}

function saveCheckoutDraftState(input: {
  paymentMethod: CheckoutPaymentMethod
  contact: typeof EMPTY_CONTACT
  passenger: typeof EMPTY_PASSENGER
}) {
  if (!isBrowser()) return
  window.localStorage.setItem(
    CHECKOUT_FORM_DRAFT_STORAGE_KEY,
    JSON.stringify(input),
  )
}

function clearCheckoutDraftState() {
  if (!isBrowser()) return
  window.localStorage.removeItem(CHECKOUT_FORM_DRAFT_STORAGE_KEY)
}

function formatBirthDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 6)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

// ─── Underline field ────────────────────────────────────────────────────────
function UnderlineField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.12em] text-subtle">
        {label}
      </label>
      {children}
    </div>
  )
}

const fieldClass =
  "w-full bg-transparent border-0 border-b border-dark-brown/30 py-2 text-sm sm:text-base font-sans text-dark-brown placeholder:text-subtle/50 focus:outline-none focus:border-primary transition-colors"

// ─── Cart Carousel ───────────────────────────────────────────────────────────
function CartCarousel({
  items,
}: {
  items: ReturnType<typeof useCart>["items"]
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollTo = (index: number) => {
    const container = scrollRef.current
    if (!container) return
    const cards = container.querySelectorAll<HTMLElement>("[data-card]")
    if (!cards[index]) return
    cards[index].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
    setActiveIndex(index)
  }

  const handleScroll = () => {
    const container = scrollRef.current
    if (!container) return
    const cards = container.querySelectorAll<HTMLElement>("[data-card]")
    let closest = 0
    let minDist = Infinity
    cards.forEach((card, i) => {
      const dist = Math.abs(card.getBoundingClientRect().left - container.getBoundingClientRect().left)
      if (dist < minDist) { minDist = dist; closest = i }
    })
    setActiveIndex(closest)
  }

  if (items.length === 0) return null

  return (
    <div className="relative">
      {/* Scroll Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            data-card
            className="flex-shrink-0 snap-start w-[min(320px,82vw)] sm:w-[340px] md:w-[360px] border border-dark-brown/15 bg-white flex overflow-hidden"
          >
            {/* Image */}
            <div className="relative w-[40%] shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
            </div>
            {/* Content */}
            <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
              <div>
                <p className="text-[11px] font-sans text-primary uppercase tracking-wider mb-1 truncate">
                  {item.category}
                </p>
                <h3 className="font-serif text-sm sm:text-base font-semibold text-dark-brown leading-snug line-clamp-2 mb-1">
                  {item.name}
                </h3>
                {item.description && (
                  <p className="text-xs text-subtle font-sans line-clamp-1">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="flex items-end justify-between mt-2 gap-1">
                <p className="font-serif text-base sm:text-lg font-bold text-primary leading-none">
                  {formatPrice(item.unitPrice * item.quantity)}
                </p>
                {item.quantity > 1 && (
                  <span className="text-[10px] text-subtle font-sans">
                    x{item.quantity}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots + arrows — only if more than 1 item */}
      {items.length > 1 && (
        <div className="flex items-center justify-between mt-4">
          {/* Prev arrow */}
          <button
            onClick={() => scrollTo(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className="p-1 text-dark-brown/40 hover:text-dark-brown transition-colors disabled:opacity-30 cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`rounded-full transition-all cursor-pointer ${
                  i === activeIndex
                    ? "w-4 h-1.5 bg-primary"
                    : "w-1.5 h-1.5 bg-dark-brown/20"
                }`}
                aria-label={`Ir al item ${i + 1}`}
              />
            ))}
          </div>

          {/* Next arrow */}
          <button
            onClick={() => scrollTo(Math.min(items.length - 1, activeIndex + 1))}
            disabled={activeIndex === items.length - 1}
            className="p-1 text-dark-brown/40 hover:text-dark-brown transition-colors disabled:opacity-30 cursor-pointer"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Payment Method Row ──────────────────────────────────────────────────────
function PaymentRow({
  id,
  label,
  description,
  icon,
  selected,
  onSelect,
}: {
  id: CheckoutPaymentMethod
  label: string
  description: string
  icon: ReactNode
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-center gap-4 py-4 px-0 border-b transition-colors text-left cursor-pointer ${
        selected ? "border-primary/40" : "border-dark-brown/10 hover:border-dark-brown/25"
      }`}
    >
      <div className="shrink-0 w-10 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-sans font-semibold ${selected ? "text-primary" : "text-dark-brown"}`}>
          {label}
        </p>
        <p className="text-xs font-sans text-subtle mt-0.5 truncate">
          {description}
        </p>
      </div>
      {/* Radio */}
      <div
        className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          selected ? "border-primary" : "border-dark-brown/25"
        }`}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
      </div>
    </button>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
const supabase = createClient()

type CheckoutStep = "datos" | "pago"

export function CheckoutView() {
  const router = useRouter()
  const { items, isEmpty, subtotal } = useCart()
  const [step, setStep] = useState<CheckoutStep>("datos")
  const [paymentMethod, setPaymentMethod] =
    useState<CheckoutPaymentMethod>("mercadopago")
  const [rememberDetails, setRememberDetails] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contact, setContact] = useState(EMPTY_CONTACT)
  const [passenger, setPassenger] = useState(EMPTY_PASSENGER)

  useEffect(() => {
    const persisted = loadCheckoutDraftState()
    if (!persisted) return
    setPaymentMethod(persisted.paymentMethod)
    setContact(persisted.contact)
    setPassenger(persisted.passenger)
  }, [])

  useEffect(() => {
    let active = true
    void (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!active || !user) return
      setContact((c) => ({
        ...c,
        email: c.email || user.email || "",
        firstName: c.firstName || user.user_metadata?.nombre || "",
        lastName: c.lastName || user.user_metadata?.apellido || "",
      }))
      if (loadCheckoutDraftState()) return
      const profileResponse = await fetch("/api/checkout/profile", { cache: "no-store" })
      if (!profileResponse.ok) return
      const profile = (await profileResponse.json()) as CheckoutProfileResult | null
      if (!active || !profile) return
      setRememberDetails(true)
      setContact((c) => ({
        ...c,
        firstName: profile.contact.firstName || c.firstName,
        lastName: profile.contact.lastName || c.lastName,
        email: profile.contact.email || c.email,
        phone: profile.contact.phone || c.phone,
      }))
      setPassenger((p) => ({
        ...p,
        fullName: profile.passenger.fullName || p.fullName,
        documentNumber: profile.passenger.documentNumber || p.documentNumber,
        birthDate: profile.passenger.birthDate || p.birthDate,
        nationality: profile.passenger.nationality || p.nationality,
        specialRequirements: profile.passenger.specialRequirements || p.specialRequirements,
      }))
    })()
    return () => { active = false }
  }, [])

  useEffect(() => {
    saveCheckoutDraftState({ paymentMethod, contact, passenger })
  }, [contact, passenger, paymentMethod])

  const handleCheckoutSubmit = async () => {
    if (isEmpty) {
      toast.error("Tu carrito está vacío.")
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, paymentMethod, saveProfile: rememberDetails, contact, passenger }),
      })
      const result = (await response.json()) as CheckoutSubmitResult & { error?: string }
      if (response.status === 401) {
        toast.error("Necesitás iniciar sesión para continuar.")
        router.push("/login")
        return
      }
      if (!response.ok) {
        toast.error(result.error ?? "No se pudo iniciar la reserva.")
        return
      }
      saveLastCheckoutSnapshot({
        submittedAt: new Date().toISOString(),
        paymentMethod: result.paymentMethod,
        items,
        order: result.order,
        payment: result.payment,
        reservations: result.reservations,
        bankTransfer: result.bankTransfer
          ? {
              paymentId: result.bankTransfer.paymentId,
              expiresAt: result.bankTransfer.expiresAt,
              reference: result.bankTransfer.reference,
              status: result.bankTransfer.status,
              amount: result.bankTransfer.amount,
              currency: result.bankTransfer.currency,
              receiptReference: result.bankTransfer.receiptReference,
              receiptUrl: result.bankTransfer.receiptUrl,
            }
          : null,
      })
      clearCheckoutDraftState()
      setContact(EMPTY_CONTACT)
      setPassenger(EMPTY_PASSENGER)
      setPaymentMethod("mercadopago")
      clearCart()
      if (result.redirectUrl?.startsWith("http")) {
        window.location.assign(result.redirectUrl)
        return
      }
      router.push(result.redirectUrl ?? result.successUrl)
    } catch {
      toast.error("No se pudo iniciar la reserva.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const paymentMethods: {
    id: CheckoutPaymentMethod
    label: string
    description: string
    icon: ReactNode
  }[] = [
    {
      id: "transferencia",
      label: "Transferencia Bancaria",
      description: "Acreditación en 24hs hábiles",
      icon: <Landmark className="w-5 h-5 text-dark-brown/60" />,
    },
    {
      id: "efectivo",
      label: "Efectivo en sucursal",
      description: "Caseros 450, Salta Capital",
      icon: <Banknote className="w-5 h-5 text-dark-brown/60" />,
    },
    {
      id: "mercadopago",
      label: "Mercado Pago",
      description: "Dinero en cuenta o cuotas",
      icon: <MercadoPagoIcon className="w-8 h-6 shrink-0" />,
    },
  ]

  return (
    <main className="min-h-screen bg-off-white pt-28 sm:pt-32 pb-16">
      <div className="mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] max-w-[860px]">

        {/* ── Back link ── */}
        {step === "datos" ? (
          <Link
            href="/carrito"
            className="inline-flex items-center gap-1 text-sm text-subtle hover:text-dark-brown transition-colors mb-6 font-sans"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver al carrito
          </Link>
        ) : (
          <button
            onClick={() => setStep("datos")}
            className="inline-flex items-center gap-1 text-sm text-subtle hover:text-dark-brown transition-colors mb-6 font-sans cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver a mis datos
          </button>
        )}

        {/* ── Step indicator ── */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`h-0.5 flex-1 transition-colors ${step === "datos" ? "bg-primary" : "bg-primary"}`} />
          <div className={`h-0.5 flex-1 transition-colors ${step === "pago" ? "bg-primary" : "bg-dark-brown/15"}`} />
        </div>

        {/* ── Header ── */}
        <div className="mb-8">
          <p className="text-xs font-sans tracking-[0.15em] uppercase text-subtle mb-1.5">
            {step === "datos" ? "Paso 1 de 2" : "Paso 2 de 2"}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-dark-brown italic">
            {step === "datos" ? "Datos para el Pago" : "Finalizar Pago"}
          </h1>
          <p className="text-sm text-subtle font-sans mt-2">
            {step === "datos"
              ? "Por favor, completá la información para procesar tu reserva de forma segura."
              : "Seleccioná tu método de pago preferido para completar la experiencia Apacheta."}
          </p>
        </div>

        {/* ── Resumen de Estadía (carousel) ── */}
        <section className="mb-8 sm:mb-10">
          <h2 className="font-serif text-lg sm:text-xl font-semibold text-dark-brown mb-4">
            Resumen de Estadía
          </h2>
          <CartCarousel items={items} />
        </section>

        <div className="border-t border-dark-brown/10 mb-8" />

        {/* ══════════════════ STEP 1: Datos ══════════════════ */}
        {step === "datos" && (
          <div className="space-y-6 sm:space-y-8">

            {/* Fila 1 — Nombre Completo */}
            <UnderlineField label="Nombre Completo">
              <input
                type="text"
                placeholder=""
                value={passenger.fullName}
                onChange={(e) => {
                  const val = e.target.value
                  setPassenger((p) => ({ ...p, fullName: val }))
                  // Sync to contact firstName/lastName for API
                  const parts = val.trim().split(" ")
                  setContact((c) => ({
                    ...c,
                    firstName: parts[0] ?? "",
                    lastName: parts.slice(1).join(" ") || c.lastName,
                  }))
                }}
                className={fieldClass}
              />
            </UnderlineField>

            {/* Fila 2 — DNI | Teléfono */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <UnderlineField label="DNI / Pasaporte">
                <input
                  type="text"
                  placeholder=""
                  value={passenger.documentNumber}
                  onChange={(e) => setPassenger((p) => ({ ...p, documentNumber: e.target.value }))}
                  className={fieldClass}
                />
              </UnderlineField>
              <UnderlineField label="Número de Teléfono">
                <input
                  type="tel"
                  placeholder=""
                  value={contact.phone}
                  onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                  className={fieldClass}
                />
              </UnderlineField>
            </div>

            {/* Fila 3 — Correo Electrónico */}
            <UnderlineField label="Correo Electrónico">
              <input
                type="email"
                placeholder=""
                value={contact.email}
                onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                className={fieldClass}
              />
            </UnderlineField>

            {/* CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setStep("pago")}
                disabled={isEmpty}
                className="w-full bg-primary hover:bg-primary/85 text-off-white font-sans font-bold text-sm sm:text-base py-4 text-center transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                Continuar con el pago →
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════ STEP 2: Pago ══════════════════ */}
        {step === "pago" && (
          <div className="space-y-8">
            {/* Métodos de pago */}
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-semibold text-dark-brown mb-2">
                Métodos de Pago
              </h2>
              <div className="border-t border-dark-brown/10">
                {paymentMethods.map((method) => (
                  <PaymentRow
                    key={method.id}
                    {...method}
                    selected={paymentMethod === method.id}
                    onSelect={() => setPaymentMethod(method.id)}
                  />
                ))}
              </div>
            </div>

            {/* Totales */}
            <div className="bg-white border border-dark-brown/15 p-4 sm:p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-sans text-sm text-dark-brown">Subtotal</span>
                <span className="font-sans text-sm text-dark-brown whitespace-nowrap">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-sans text-sm text-subtle">Impuestos y tasas</span>
                <span className="font-sans text-sm text-subtle">A calcular</span>
              </div>
              <div className="border-t border-dark-brown/15 pt-3 flex justify-between items-center">
                <span className="font-sans text-base font-bold text-dark-brown">Total</span>
                <span className="font-serif text-xl font-bold text-primary whitespace-nowrap">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={handleCheckoutSubmit}
              disabled={isSubmitting || isEmpty}
              className={`w-full text-off-white font-sans font-bold text-sm sm:text-base py-4 text-center transition-colors cursor-pointer ${
                isSubmitting || isEmpty ? "bg-primary/50" : "bg-primary hover:bg-primary/85"
              }`}
            >
              {isSubmitting ? "Procesando..." : "Pagar Ahora"}
            </button>

            <p className="text-center text-subtle font-sans text-xs leading-relaxed">
              *Sujeto a disponibilidad y cambios sin previo aviso. Consultar por grupos.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
