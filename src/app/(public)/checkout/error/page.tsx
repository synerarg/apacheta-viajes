import type { Metadata } from "next"
import Link from "next/link"
import { X } from "lucide-react"

export const metadata: Metadata = {
  title: "Error en el pago | Apacheta Viajes",
}

function buildRetryHref(orderId: string | undefined) {
  return orderId ? `/mis-reservas?order=${orderId}` : "/mis-reservas"
}

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; paymentMethod?: string }>
}) {
  const { orderId, paymentMethod } = await searchParams
  const isMercadoPago = paymentMethod === "mercadopago"

  return (
    <main className="min-h-screen bg-off-white pt-28 flex items-center justify-center">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[560px] py-16 flex flex-col items-center text-center">
        {/* Error Icon */}
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-8">
          <X className="w-6 h-6 text-primary" strokeWidth={2.5} />
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-[40px] font-normal italic text-dark-brown leading-tight mb-4">
          Hubo un inconveniente con tu pago
        </h1>

        {/* Subtitle */}
        <p className="text-[15px] text-subtle font-sans mb-10 max-w-[440px] leading-relaxed">
          {isMercadoPago
            ? "No pudimos procesar la transacción a través de Mercado Pago."
            : "No pudimos procesar la transacción con el medio de pago seleccionado."}
          <br />
          Verificá el estado de tu orden e intentá nuevamente con otro medio de pago si hace falta.
        </p>

        {/* CTA Buttons */}
        <div className="w-full flex flex-col gap-3">
          <Link
            href={buildRetryHref(orderId)}
            className="block w-full bg-primary hover:bg-primary/80 text-off-white text-center text-[15px] font-semibold font-sans py-3 transition-colors"
          >
            Ver mi reserva
          </Link>
          <Link
            href={buildRetryHref(orderId)}
            className="block w-full bg-transparent text-dark-brown text-center text-[15px] font-medium font-sans py-3 border border-dark-brown hover:bg-dark-brown/5 transition-colors"
          >
            Cambiar Método de Pago
          </Link>
        </div>

        {/* Help text */}
        <p className="text-[13px] text-subtle font-sans mt-6">
          ¿Necesitás ayuda con tu reserva?{" "}
          <Link href="/contacto" className="text-primary underline font-medium">
            Contactá con soporte
          </Link>
        </p>
      </div>
    </main>
  )
}
