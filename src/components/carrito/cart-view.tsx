"use client"

import { useState } from "react"
import { Trash2, Minus, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CartItem {
  id: number
  category: string
  name: string
  description: string
  price: number
  quantity: number
  image: string
}

const initialCartItems: CartItem[] = [
  {
    id: 1,
    category: "Paquete",
    name: "Vuelta a los Valles Calchaquíes",
    description: "Breve descrip.",
    price: 450000,
    quantity: 1,
    image: "",
  },
  {
    id: 2,
    category: "Paquete",
    name: "Vuelta a los Valles Calchaquíes",
    description: "Breve descrip.",
    price: 450000,
    quantity: 1,
    image: "",
  },
  {
    id: 3,
    category: "Paquete",
    name: "Vuelta a los Valles Calchaquíes",
    description: "Breve descrip.",
    price: 450000,
    quantity: 1,
    image: "",
  },
]

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`
}

export function CartView() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <main className="min-h-screen bg-off-white pt-28 pb-16">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
        {/* Page Header */}
        <div className="mb-10">
          <p className="text-sm text-subtle font-sans tracking-[0.15em] uppercase mb-2">
            Resumen
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[64px] font-normal text-dark-brown italic mb-2">
            Tu Selección
          </h1>
          <p className="text-base text-subtle font-sans">
            Experiencias curadas para tu travesía.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column - Cart Items */}
          <div className="flex-1">
            {cartItems.length > 0 ? (
              <div className="flex flex-col">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex gap-6 py-6 ${
                      index !== cartItems.length - 1
                        ? "border-b border-dark-brown/15"
                        : ""
                    }`}
                  >
                    {/* Image placeholder */}
                    <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 overflow-hidden bg-muted">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between relative">
                      {/* Delete Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute top-0 right-0 text-primary hover:text-primary/80 transition-colors"
                        aria-label="Eliminar item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Top Content */}
                      <div className="pr-8">
                        <p className="font-serif text-xl md:text-2xl font-normal text-primary mb-0.5">
                          {item.category}
                        </p>
                        <h3 className="font-serif text-xl md:text-2xl font-semibold text-dark-brown mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-subtle font-sans">
                          {item.description}
                        </p>
                      </div>

                      {/* Bottom Content */}
                      <div className="flex items-end justify-between mt-4">
                        <p className="font-serif text-xl md:text-2xl font-bold text-primary">
                          {formatPrice(item.price * item.quantity)}
                        </p>

                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-dark-brown h-8">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-full flex items-center justify-center hover:bg-dark-brown/10 transition-colors"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="w-3 h-3 text-dark-brown" />
                          </button>
                          <span className="w-8 h-full flex items-center justify-center text-sm font-sans text-dark-brown border-x border-dark-brown">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-full flex items-center justify-center hover:bg-dark-brown/10 transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-3 h-3 text-dark-brown" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center border-t border-dark-brown/15">
                <p className="text-subtle font-sans text-lg mb-4">
                  Tu carrito está vacío
                </p>
                <Link
                  href="/#paquetes"
                  className="text-primary font-sans text-sm hover:underline"
                >
                  Explorar paquetes →
                </Link>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-[380px] flex-shrink-0">
            <div className="sticky top-28 bg-white border border-dark-brown/20 p-8">
              <h2 className="font-serif text-2xl font-semibold text-dark-brown mb-6">
                Resumen
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-sm text-dark-brown">
                    Subtotal ({cartItems.length}{" "}
                    {cartItems.length === 1 ? "item" : "items"})
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

              <div className="border-t border-dark-brown/20 my-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="font-sans text-base font-bold text-dark-brown">
                  Total
                </span>
                <span className="font-serif text-xl font-bold text-primary">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-primary hover:bg-primary/80 text-off-white font-sans text-base font-bold py-4 text-center transition-colors"
              >
                Finalizar Reserva
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
