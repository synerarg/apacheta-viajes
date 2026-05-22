"use client"

import { Trash2, Minus, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { useCart } from "@/hooks/use-cart"

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`
}

export function CartView() {
  const { items, isEmpty, removeItem, subtotal, totalItems, updateItemQuantity } =
    useCart()

  const updateQuantity = (id: string, delta: number) => {
    const cartItem = items.find((item) => item.id === id)

    if (!cartItem) {
      return
    }

    updateItemQuantity(cartItem.id, cartItem.quantity + delta)
  }

  return (
    <main className="min-h-screen bg-off-white pt-32 pb-16">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
        <div className="mb-8 md:mb-10">
          <p className="text-sm text-subtle font-sans tracking-[0.15em] uppercase mb-2">
            Resumen
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-normal text-dark-brown italic mb-2">
            Tu Selección
          </h1>
          <p className="text-sm sm:text-base text-subtle font-sans">
            Experiencias curadas para tu travesía.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1 min-w-0">
            {!isEmpty ? (
              <div className="flex flex-col">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex gap-3 sm:gap-5 md:gap-6 py-5 sm:py-6 ${
                      index !== items.length - 1
                        ? "border-b border-dark-brown/15"
                        : ""
                    }`}
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 shrink-0 overflow-hidden bg-muted">
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
                    <div className="flex-1 min-w-0 flex flex-col justify-between relative">
                      {/* Delete Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute top-0 right-0 text-primary hover:text-primary/80 transition-colors cursor-pointer"
                        aria-label="Eliminar item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Top Content */}
                      <div className="pr-6">
                        <p className="font-serif text-base sm:text-lg md:text-xl lg:text-2xl font-normal text-primary mb-0.5 truncate">
                          {item.category}
                        </p>
                        <h3 className="font-serif text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-dark-brown mb-1 leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-subtle font-sans line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      {/* Bottom Content */}
                      <div className="flex items-center justify-between mt-3 gap-2">
                        <p className="font-serif text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary shrink-0">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>

                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-dark-brown h-9 shrink-0">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-9 h-full flex items-center justify-center hover:bg-dark-brown/10 transition-colors cursor-pointer"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="w-3 h-3 text-dark-brown" />
                          </button>
                          <span className="w-9 h-full flex items-center justify-center text-sm font-sans text-dark-brown border-x border-dark-brown">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-9 h-full flex items-center justify-center hover:bg-dark-brown/10 transition-colors cursor-pointer"
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
          <div className="lg:w-[340px] xl:w-[380px] shrink-0">
            <div className="sticky top-28 bg-white border border-dark-brown/20 p-4 sm:p-6 md:p-8">
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-dark-brown mb-5 sm:mb-6">
                Resumen
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center gap-4">
                  <span className="font-sans text-sm text-dark-brown">
                    Subtotal ({totalItems}{" "}
                    {totalItems === 1 ? "item" : "items"})
                  </span>
                  <span className="font-sans text-sm text-dark-brown whitespace-nowrap">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="font-sans text-sm text-subtle">
                    Impuestos y tasas
                  </span>
                  <span className="font-sans text-sm text-subtle whitespace-nowrap">
                    A calcular
                  </span>
                </div>
              </div>

              <div className="border-t border-dark-brown/20 my-4" />

              <div className="flex justify-between items-center gap-4 mb-6">
                <span className="font-sans text-base font-bold text-dark-brown">
                  Total
                </span>
                <span className="font-serif text-lg sm:text-xl font-bold text-primary whitespace-nowrap">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <Link
                href={isEmpty ? "/carrito" : "/checkout"}
                aria-disabled={isEmpty}
                className={`block w-full text-off-white font-sans text-sm sm:text-base font-bold py-4 text-center transition-colors cursor-pointer ${
                  isEmpty
                    ? "pointer-events-none bg-primary/50"
                    : "bg-primary hover:bg-primary/80"
                }`}
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
