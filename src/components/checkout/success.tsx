"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

import {
  loadLastCheckoutSnapshot,
  saveLastCheckoutSnapshot,
} from "@/lib/cart/cart-storage"
import type { CheckoutOrderDetailResult } from "@/types/checkout/checkout.types"

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`
}

function resolvePaymentStatusLabel(status?: string | null) {
  switch (status) {
    case "approved":
      return "Pago aprobado"
    case "reported":
      return "Comprobante enviado"
    case "requires_action":
      return "Esperando transferencia"
    case "pending":
      return "Pendiente"
    case "rejected":
      return "Pago rechazado"
    case "cancelled":
      return "Pago cancelado"
    case "expired":
      return "Pago vencido"
    default:
      return "En revisión"
  }
}

function resolveSummaryMessage(
  paymentMethod?: string,
  paymentStatus?: string | null,
) {
  if (paymentMethod === "bank_transfer") {
    if (paymentStatus === "approved") {
      return "La transferencia fue validada correctamente y tu reserva ya quedó pagada."
    }

    if (paymentStatus === "reported") {
      return "Recibimos tu comprobante y nuestro equipo ya está validando la acreditación."
    }

    if (paymentStatus === "expired") {
      return "La ventana para informar la transferencia venció y la reserva quedó expirada."
    }

    return "Tu reserva fue creada y quedó pendiente de que completes la transferencia bancaria."
  }

  if (paymentMethod === "mercadopago_checkout_pro") {
    if (paymentStatus === "approved") {
      return "Mercado Pago aprobó el pago y tu reserva quedó registrada correctamente."
    }

    if (paymentStatus === "rejected" || paymentStatus === "cancelled") {
      return "El pago no se pudo acreditar. Revisá el estado de la orden para intentar nuevamente."
    }

    return "Tu reserva fue creada y estamos esperando la confirmación final de Mercado Pago."
  }

  return "Recibimos tu solicitud correctamente y nuestro equipo continuará con la confirmación operativa."
}

function resolveNextSteps(paymentMethod?: string, paymentStatus?: string | null) {
  if (paymentMethod === "bank_transfer") {
    if (paymentStatus === "approved") {
      return [
        "Tu transferencia ya fue validada por nuestro equipo.",
        "Nos contactaremos para confirmar los detalles finales de tu reserva.",
        "Recibirás por email o WhatsApp el siguiente paso operativo del viaje.",
      ]
    }

    if (paymentStatus === "reported") {
      return [
        "Recibimos tu comprobante y quedó en revisión.",
        "Nuestro equipo validará la acreditación bancaria.",
        "Te avisaremos apenas la reserva quede pagada.",
      ]
    }

    return [
      "Nuestro equipo te compartirá las instrucciones para completar la transferencia.",
      "Cuando el pago se acredite, actualizaremos el estado de tu reserva.",
      "Si necesitás ayuda, te asistiremos por email o WhatsApp.",
    ]
  }

  if (paymentMethod === "mercadopago_checkout_pro") {
    return [
      "Mercado Pago nos informará el estado final del pago.",
      "Si el pago se aprueba, tu reserva quedará actualizada automáticamente.",
      "Ante cualquier inconveniente, nuestro equipo te contactará.",
    ]
  }

  return [
    "Nuestro equipo revisará la disponibilidad de tu selección.",
    "Te contactaremos por email o WhatsApp para confirmar.",
    "Una vez confirmado, coordinaremos el pago en sucursal.",
  ]
}

export function ConfirmacionView() {
  const searchParams = useSearchParams()
  const checkoutSnapshot = useMemo(() => loadLastCheckoutSnapshot(), [])
  const [orderDetail, setOrderDetail] = useState<CheckoutOrderDetailResult | null>(
    null,
  )
  const [isLoadingOrder, setIsLoadingOrder] = useState(false)

  const orderId = searchParams.get("orderId") ?? checkoutSnapshot?.order.orderId
  const paymentMethod =
    orderDetail?.payment?.method ??
    checkoutSnapshot?.payment?.method ??
    (checkoutSnapshot?.paymentMethod === "mercadopago"
      ? "mercadopago_checkout_pro"
      : checkoutSnapshot?.paymentMethod === "transferencia"
        ? "bank_transfer"
        : checkoutSnapshot?.paymentMethod === "efectivo"
          ? "cash_local"
          : null)
  const paymentStatus =
    orderDetail?.payment?.status ??
    checkoutSnapshot?.payment?.status ??
    checkoutSnapshot?.bankTransfer?.status ??
    null

  useEffect(() => {
    if (!orderId) {
      return
    }

    let active = true

    void (async () => {
      try {
        setIsLoadingOrder(true)
        const response = await fetch(`/api/checkout/orders/${orderId}`, {
          cache: "no-store",
        })
        const result = (await response.json()) as CheckoutOrderDetailResult & {
          error?: string
        }

        if (!response.ok) {
          if (response.status !== 401 && response.status !== 400) {
            toast.error(result.error ?? "No se pudo cargar el estado de la orden.")
          }
          return
        }

        if (!active) {
          return
        }

        setOrderDetail(result)

        if (checkoutSnapshot) {
          saveLastCheckoutSnapshot({
            ...checkoutSnapshot,
            order: {
              orderId: result.orderId,
              reference: result.reference,
              status: result.status,
              paymentStatus: result.paymentStatus,
              total: result.total,
              currency: result.currency,
            },
            payment: result.payment
              ? {
                  paymentId: result.payment.paymentId,
                  method: result.payment.method,
                  status: result.payment.status,
                  amount: result.payment.amount,
                  currency: result.payment.currency,
                  externalReference: result.payment.externalReference,
                  redirectUrl: result.payment.redirectUrl,
                  expiresAt: result.payment.expiresAt,
                  receiptReference: result.payment.receiptReference,
                  receiptUrl: result.payment.receiptUrl,
                }
              : null,
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
        }
      } catch {
        toast.error("No se pudo cargar el estado de la orden.")
      } finally {
        if (active) {
          setIsLoadingOrder(false)
        }
      }
    })()

    return () => {
      active = false
    }
  }, [checkoutSnapshot, orderId])

  const orderItems =
    orderDetail?.items.map((item) => ({
      id: item.orderItemId,
      category: item.kind === "paquete" ? "Paquete" : "Experiencia",
      name: item.name,
      price: item.unitPrice,
      quantity: item.quantity,
    })) ??
    checkoutSnapshot?.items.map((item) => ({
      id: item.id,
      category: item.category,
      name: item.name,
      price: item.unitPrice,
      quantity: item.quantity,
    })) ?? []
  const total =
    orderDetail?.total ??
    checkoutSnapshot?.order.total ??
    orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const orderReference = orderDetail?.reference
    ? `#${orderDetail.reference}`
    : checkoutSnapshot?.order.reference
      ? `#${checkoutSnapshot.order.reference}`
      : "#AP-20260001"

  return (
    <main className="min-h-screen bg-off-white pt-28 pb-16 flex items-center justify-center">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[720px]">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-dark-brown flex items-center justify-center shrink-0">
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
            <div className="flex flex-col gap-1">
              <p className="text-sm font-sans tracking-[0.15em] uppercase text-dark-brown">
                Reserva recibida
              </p>
              <span className="text-xs font-sans uppercase tracking-[0.12em] text-subtle">
                {resolvePaymentStatusLabel(paymentStatus)}
              </span>
            </div>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-[64px] font-normal text-dark-brown italic mb-4">
            ¡Gracias por tu reserva!
          </h1>
          <p className="text-base md:text-lg text-dark-brown font-sans leading-relaxed mb-2">
            {resolveSummaryMessage(paymentMethod ?? undefined, paymentStatus)}
          </p>
          <p className="text-sm text-subtle font-sans mb-10">
            {isLoadingOrder
              ? "Actualizando el estado de tu orden..."
              : "Se envió un resumen a tu email de contacto."}
          </p>

          <div className="bg-white border border-dark-brown/20 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-semibold text-dark-brown">
                Detalle del pedido
              </h2>
              <span className="text-xs font-sans text-subtle tracking-[0.12em] uppercase">
                N° {orderReference}
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
                    <p className="text-xs text-subtle mt-0.5">x{item.quantity}</p>
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

          <div className="bg-white border border-dark-brown/20 p-8 mb-10">
            <h2 className="font-serif text-xl font-semibold text-dark-brown mb-4">
              Próximos pasos
            </h2>
            <ol className="flex flex-col gap-3">
              {resolveNextSteps(paymentMethod ?? undefined, paymentStatus).map(
                (step, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="w-6 h-6 bg-dark-brown/10 text-dark-brown text-xs font-sans font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-sm font-sans text-dark-brown leading-relaxed">
                      {step}
                    </p>
                  </li>
                ),
              )}
            </ol>
          </div>

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
