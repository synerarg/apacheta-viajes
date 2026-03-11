import Link from "next/link"

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

const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

export function ConfirmacionView() {
  return (
    <main className="min-h-screen bg-off-white pt-28 pb-16">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
        <div className="max-w-[720px]">
          {/* Status */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-dark-brown flex items-center justify-center shrink-0">
              {/* Checkmark SVG */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 9L7 13L15 5"
                  stroke="var(--color-off-white)"
                  strokeWidth="2"
                  strokeLinecap="square"
                />
              </svg>
            </div>
            <p className="text-sm font-sans tracking-[0.15em] uppercase text-dark-brown">
              Reserva recibida
            </p>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[64px] font-normal text-dark-brown italic mb-4">
            ¡Gracias por tu reserva!
          </h1>
          <p className="text-base md:text-lg text-dark-brown font-sans leading-relaxed mb-2">
            Recibimos tu solicitud correctamente. Nuestro equipo la revisará y
            te contactará a la brevedad para confirmar disponibilidad y
            coordinar el pago.
          </p>
          <p className="text-sm text-subtle font-sans mb-10">
            Se envió un resumen a tu email de contacto.
          </p>

          {/* Order Summary */}
          <div className="bg-white border border-dark-brown/20 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-semibold text-dark-brown">
                Detalle del pedido
              </h2>
              <span className="text-xs font-sans text-subtle tracking-[0.12em] uppercase">
                N° #AP-20260001
              </span>
            </div>

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

            <div className="border-t border-dark-brown/20 pt-4 flex justify-between items-center">
              <span className="font-sans text-base font-bold text-dark-brown">
                Total
              </span>
              <span className="font-serif text-xl font-bold text-primary">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          {/* Next steps */}
          <div className="bg-white border border-dark-brown/20 p-8 mb-10">
            <h2 className="font-serif text-xl font-semibold text-dark-brown mb-4">
              Próximos pasos
            </h2>
            <ol className="flex flex-col gap-3">
              {[
                "Nuestro equipo revisará la disponibilidad de tu selección.",
                "Te contactaremos por email o WhatsApp para confirmar.",
                "Una vez confirmado, te enviamos las instrucciones de pago.",
                "Con el pago acreditado, tu reserva queda confirmada.",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-6 h-6 bg-dark-brown/10 text-dark-brown text-xs font-sans font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm font-sans text-dark-brown leading-relaxed">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="bg-primary hover:bg-primary/80 text-off-white font-sans text-base font-bold px-8 py-4 text-center transition-colors"
            >
              Volver al inicio
            </Link>
            <Link
              href="/#paquetes"
              className="border border-primary text-primary hover:bg-primary/5 font-sans text-base font-bold px-8 py-4 text-center transition-colors"
            >
              Seguir explorando
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
