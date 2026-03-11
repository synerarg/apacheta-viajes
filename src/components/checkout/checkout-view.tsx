"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`
}

const orderItems = [
  {
    id: 1,
    category: "Paquete",
    name: "Vuelta a los Valles Calchaquíes",
    price: 450000,
    quantity: 1,
  },
  {
    id: 2,
    category: "Paquete",
    name: "Vuelta a los Valles Calchaquíes",
    price: 450000,
    quantity: 1,
  },
  {
    id: 3,
    category: "Paquete",
    name: "Vuelta a los Valles Calchaquíes",
    price: 450000,
    quantity: 1,
  },
]

type PaymentMethod = "mercadopago" | "transferencia" | "efectivo"

export function CheckoutView() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mercadopago")

  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <main className="min-h-screen bg-off-white pt-28 pb-16">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
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
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[64px] font-normal text-dark-brown italic mb-2">
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
            <div className="bg-white border border-dark-brown/20 p-8">
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
                    className="h-11 border border-dark-brown/30 bg-transparent px-3 text-sm font-sans text-dark-brown placeholder:text-subtle focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Passenger Info */}
            <div className="bg-white border border-dark-brown/20 p-8">
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
                    className="h-11 border border-dark-brown/30 bg-transparent px-3 text-sm font-sans text-dark-brown placeholder:text-subtle focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-sans uppercase tracking-[0.12em] text-dark-brown">
                    Fecha de nacimiento *
                  </label>
                  <input
                    type="date"
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
                    className="border border-dark-brown/30 bg-transparent px-3 py-2.5 text-sm font-sans text-dark-brown placeholder:text-subtle focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-dark-brown/20 p-8">
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
                  ] as { id: PaymentMethod; label: string; description: string }[]
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
          <div className="lg:w-[380px] shrink-0">
            <div className="sticky top-28 bg-white border border-dark-brown/20 p-8">
              <h2 className="font-serif text-xl font-semibold text-dark-brown mb-6">
                Tu pedido
              </h2>

              <div className="flex flex-col gap-4 mb-6">
                {orderItems.map((item) => (
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
                      {formatPrice(item.price * item.quantity)}
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

              <Link
                href="/checkout/success"
                className="block w-full bg-primary hover:bg-primary/80 text-off-white font-sans text-base font-bold py-4 text-center transition-colors"
              >
                Confirmar Reserva
              </Link>

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
