"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { toast } from "sonner"

import { useCart } from "@/hooks/use-cart"
import {
  clearCart,
  saveLastCheckoutSnapshot,
} from "@/lib/cart/cart-storage"
import { createClient } from "@/lib/supabase/client"
import type { CheckoutPaymentMethod, CheckoutSubmitResult } from "@/types/checkout/checkout.types"

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`
}

function formatBirthDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 6)

  if (digits.length <= 2) {
    return digits
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

const supabase = createClient()

export function CheckoutView() {
  const router = useRouter()
  const { items, isEmpty, subtotal } = useCart()
  const [paymentMethod, setPaymentMethod] =
    useState<CheckoutPaymentMethod>("mercadopago")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [passenger, setPassenger] = useState({
    fullName: "",
    documentNumber: "",
    birthDate: "",
    nationality: "",
    specialRequirements: "",
  })

  useEffect(() => {
    let active = true

    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!active || !user) {
        return
      }

      setContact((currentContact) => ({
        ...currentContact,
        email: currentContact.email || user.email || "",
        firstName:
          currentContact.firstName || user.user_metadata?.nombre || "",
        lastName:
          currentContact.lastName || user.user_metadata?.apellido || "",
      }))
    })()

    return () => {
      active = false
    }
  }, [])

  const handleCheckoutSubmit = async () => {
    if (isEmpty) {
      toast.error("Tu carrito está vacío.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          paymentMethod,
          contact,
          passenger,
        }),
      })

      const result = (await response.json()) as CheckoutSubmitResult & {
        error?: string
      }

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

  return (
    <main className="min-h-screen bg-off-white pt-36 pb-16">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
        {/* Back link */}
        <Link
          href="/carrito"
          className="inline-flex items-center gap-1.5 text-sm text-subtle hover:text-dark-brown transition-colors mb-8 font-sans"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver al carrito
        </Link>

        {/* Page Header */}
        <div className="mb-10">
          <p className="text-sm text-subtle font-sans tracking-[0.15em] uppercase mb-2">
            Paso 2 de 2
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-normal text-dark-brown italic mb-2">
            Datos de la Reserva
          </h1>
          <p className="text-base text-subtle font-sans">
            Completá tus datos para confirmar la reserva.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column - Forms */}
          <div className="flex-1 space-y-8">
            {/* Contact Info */}
            <div className="bg-white border border-dark-brown/20 p-5 sm:p-6 md:p-8">
              <h2 className="font-serif text-xl font-semibold text-dark-brown mb-6">
                Datos de Contacto
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-sans uppercase tracking-[0.12em] text-dark-brown">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Juan"
                    value={contact.firstName}
                    onChange={(event) =>
                      setContact((currentContact) => ({
                        ...currentContact,
                        firstName: event.target.value,
                      }))
                    }
                    className="h-11 border border-dark-brown/30 bg-transparent px-3 text-sm font-sans text-dark-brown placeholder:text-subtle focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-sans uppercase tracking-[0.12em] text-dark-brown">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: García"
                    value={contact.lastName}
                    onChange={(event) =>
                      setContact((currentContact) => ({
                        ...currentContact,
                        lastName: event.target.value,
                      }))
                    }
                    className="h-11 border border-dark-brown/30 bg-transparent px-3 text-sm font-sans text-dark-brown placeholder:text-subtle focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-sans uppercase tracking-[0.12em] text-dark-brown">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={contact.email}
                    onChange={(event) =>
                      setContact((currentContact) => ({
                        ...currentContact,
                        email: event.target.value,
                      }))
                    }
                    className="h-11 border border-dark-brown/30 bg-transparent px-3 text-sm font-sans text-dark-brown placeholder:text-subtle focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-sans uppercase tracking-[0.12em] text-dark-brown">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    placeholder="+54 9 387 555-0000"
                    value={contact.phone}
                    onChange={(event) =>
                      setContact((currentContact) => ({
                        ...currentContact,
                        phone: event.target.value,
                      }))
                    }
                    className="h-11 border border-dark-brown/30 bg-transparent px-3 text-sm font-sans text-dark-brown placeholder:text-subtle focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Passenger Info */}
            <div className="bg-white border border-dark-brown/20 p-5 sm:p-6 md:p-8">
              <h2 className="font-serif text-xl font-semibold text-dark-brown mb-6">
                Datos del Pasajero
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-sans uppercase tracking-[0.12em] text-dark-brown">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    placeholder="Como figura en el DNI"
                    value={passenger.fullName}
                    onChange={(event) =>
                      setPassenger((currentPassenger) => ({
                        ...currentPassenger,
                        fullName: event.target.value,
                      }))
                    }
                    className="h-11 border border-dark-brown/30 bg-transparent px-3 text-sm font-sans text-dark-brown placeholder:text-subtle focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-sans uppercase tracking-[0.12em] text-dark-brown">
                    DNI / Pasaporte *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 38.000.000"
                    value={passenger.documentNumber}
                    onChange={(event) =>
                      setPassenger((currentPassenger) => ({
                        ...currentPassenger,
                        documentNumber: event.target.value,
                      }))
                    }
                    className="h-11 border border-dark-brown/30 bg-transparent px-3 text-sm font-sans text-dark-brown placeholder:text-subtle focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-sans uppercase tracking-[0.12em] text-dark-brown">
                    Fecha de nacimiento *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    placeholder="dd/mm/aa"
                    value={passenger.birthDate}
                    onChange={(event) =>
                      setPassenger((currentPassenger) => ({
                        ...currentPassenger,
                        birthDate: formatBirthDateInput(event.target.value),
                      }))
                    }
                    className="h-11 border border-dark-brown/30 bg-transparent px-3 text-sm font-sans text-dark-brown focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-sans uppercase tracking-[0.12em] text-dark-brown">
                    Nacionalidad *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Argentina"
                    value={passenger.nationality}
                    onChange={(event) =>
                      setPassenger((currentPassenger) => ({
                        ...currentPassenger,
                        nationality: event.target.value,
                      }))
                    }
                    className="h-11 border border-dark-brown/30 bg-transparent px-3 text-sm font-sans text-dark-brown placeholder:text-subtle focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-sans uppercase tracking-[0.12em] text-dark-brown">
                    Observaciones / Necesidades especiales
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Alergias alimentarias, requerimientos de accesibilidad, etc."
                    value={passenger.specialRequirements}
                    onChange={(event) =>
                      setPassenger((currentPassenger) => ({
                        ...currentPassenger,
                        specialRequirements: event.target.value,
                      }))
                    }
                    className="border border-dark-brown/30 bg-transparent px-3 py-2.5 text-sm font-sans text-dark-brown placeholder:text-subtle focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-dark-brown/20 p-5 sm:p-6 md:p-8">
              <h2 className="font-serif text-xl font-semibold text-dark-brown mb-6">
                Método de Pago
              </h2>
              <div className="flex flex-col gap-3">
                {(
                  [
                    {
                      id: "mercadopago",
                      label: "MercadoPago",
                      description: "Tarjeta de crédito, débito o saldo MP",
                    },
                    {
                      id: "transferencia",
                      label: "Transferencia bancaria",
                      description: "Se enviarán los datos por email",
                    },
                    {
                      id: "efectivo",
                      label: "Efectivo en sucursal",
                      description: "Caseros 450, Salta Capital",
                    },
                  ] as {
                    id: CheckoutPaymentMethod
                    label: string
                    description: string
                  }[]
                ).map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-start gap-4 p-4 border text-left transition-colors ${
                      paymentMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-dark-brown/20 hover:border-dark-brown/40"
                    }`}
                  >
                    <div
                      className={`mt-0.5 w-4 h-4 rounded-full border-2 hrink-0 flex items-center justify-center transition-colors ${
                        paymentMethod === method.id
                          ? "border-primary"
                          : "border-dark-brown/30"
                      }`}
                    >
                      {paymentMethod === method.id && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-sans font-semibold text-dark-brown">
                        {method.label}
                      </p>
                      <p className="text-xs font-sans text-subtle mt-0.5">
                        {method.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-[340px] xl:w-[380px] shrink-0">
            <div className="sticky top-28 bg-white border border-dark-brown/20 p-5 sm:p-6 md:p-8">
              <h2 className="font-serif text-xl font-semibold text-dark-brown mb-6">
                Tu pedido
              </h2>

              <div className="flex flex-col gap-4 mb-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start gap-4 pb-4 border-b border-dark-brown/10 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-xs font-sans text-primary mb-0.5">
                        {item.category}
                      </p>
                      <p className="text-sm font-sans font-medium text-dark-brown leading-snug">
                        {item.name}
                      </p>
                      <p className="text-xs text-subtle mt-0.5">
                        x{item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-sans font-semibold text-dark-brown whitespace-nowrap">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dark-brown/20 pt-4 space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-sm text-dark-brown">
                    Subtotal
                  </span>
                  <span className="font-sans text-sm text-dark-brown">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-sans text-sm text-subtle">
                    Impuestos y tasas
                  </span>
                  <span className="font-sans text-sm text-subtle">
                    A calcular
                  </span>
                </div>
              </div>

              <div className="border-t border-dark-brown/20 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-base font-bold text-dark-brown">
                    Total
                  </span>
                  <span className="font-serif text-xl font-bold text-primary">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckoutSubmit}
                disabled={isSubmitting || isEmpty}
                className={`block w-full text-off-white font-sans text-base font-bold py-4 text-center transition-colors ${
                  isSubmitting || isEmpty
                    ? "bg-primary/50"
                    : "bg-primary hover:bg-primary/80"
                }`}
              >
                Confirmar Reserva
              </button>

              <p className="mt-4 text-center text-subtle font-sans text-xs leading-relaxed">
                *Sujeto a disponibilidad y cambios sin previo aviso.
                Consultar por grupos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
