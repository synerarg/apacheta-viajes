import Link from "next/link"

import type { CheckoutOrderSummary } from "@/types/payments/payments.types"

interface OrdersViewProps {
  orders: CheckoutOrderSummary[]
  highlightedOrderId?: string | null
}

function formatPrice(price: number) {
  return `$${price.toLocaleString("es-AR")}`
}

function resolveOrderStatusLabel(status: CheckoutOrderSummary["status"]) {
  switch (status) {
    case "pagada":
      return "Pagada"
    case "pago_reportado":
      return "Pago reportado"
    case "pago_pendiente":
      return "Pago pendiente"
    case "confirmada":
      return "Confirmada"
    case "cancelada":
      return "Cancelada"
    case "completada":
      return "Completada"
    default:
      return "Pendiente"
  }
}

function resolvePaymentStatusLabel(
  status: CheckoutOrderSummary["paymentStatus"],
) {
  switch (status) {
    case "approved":
      return "Aprobado"
    case "reported":
      return "Comprobante enviado"
    case "requires_action":
      return "Requiere acción"
    case "rejected":
      return "Rechazado"
    case "cancelled":
      return "Cancelado"
    case "expired":
      return "Vencido"
    default:
      return "Pendiente"
  }
}

function resolvePaymentMethodLabel(
  method: CheckoutOrderSummary["paymentMethod"],
) {
  switch (method) {
    case "mercadopago_checkout_pro":
      return "Mercado Pago"
    case "bank_transfer":
      return "Transferencia"
    default:
      return "Pago en sucursal"
  }
}

function formatOrderDate(value: string | null) {
  if (!value) {
    return "-"
  }

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value))
}

export function OrdersView({
  orders,
  highlightedOrderId = null,
}: OrdersViewProps) {
  return (
    <main className="min-h-screen bg-off-white pb-16 pt-28">
      <div className="mx-auto w-[calc(100%-2rem)] max-w-[960px] text-center">
        <p className="mb-3 font-sans text-xs uppercase tracking-[0.16em] text-subtle">
          Mi cuenta
        </p>
        <h1 className="mb-4 font-serif text-4xl font-normal italic text-dark-brown md:text-5xl lg:text-[64px]">
          Mis reservas y pagos
        </h1>
        <p className="mb-10 mx-auto max-w-[720px] font-sans text-base leading-relaxed text-dark-brown">
          Desde acá podés revisar el historial de órdenes, seguir el estado del
          pago y volver a ver el comprobante cuando corresponda.
        </p>

        {orders.length === 0 ? (
          <div className="border border-dark-brown/20 bg-white p-8">
            <h2 className="mb-2 font-serif text-2xl text-dark-brown">
              Todavía no tenés reservas
            </h2>
            <p className="mb-6 font-sans text-sm leading-relaxed text-subtle">
              Cuando completes una compra, el historial va a quedar disponible
              en esta sección.
            </p>
            <Link
              href="/#paquetes"
              className="inline-flex bg-primary px-6 py-3 font-sans text-sm font-bold text-off-white transition-colors hover:bg-primary/85"
            >
              Explorar paquetes
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => {
              const isHighlighted = highlightedOrderId === order.orderId
              const canViewReceipt =
                order.payment?.method === "bank_transfer" &&
                order.payment.hasReceipt
              const canResumeTransfer =
                order.payment?.method === "bank_transfer" &&
                (order.payment.status === "requires_action" ||
                  order.payment.status === "reported")

              return (
                <article
                  key={order.orderId}
                  className={`border bg-white p-8 ${
                    isHighlighted
                      ? "border-primary shadow-[0_0_0_1px_rgba(124,93,71,0.18)]"
                      : "border-dark-brown/20"
                  }`}
                >
                  <div className="mb-6 flex flex-col gap-4 border-b border-dark-brown/10 pb-6 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="mb-2 font-sans text-xs uppercase tracking-[0.12em] text-primary">
                        Reserva #{order.reference}
                      </p>
                      <h2 className="font-serif text-2xl text-dark-brown">
                        {resolveOrderStatusLabel(order.status)}
                      </h2>
                      <p className="mt-2 font-sans text-sm text-subtle">
                        Creada el {formatOrderDate(order.createdAt)} •{" "}
                        {resolvePaymentMethodLabel(order.paymentMethod)}
                      </p>
                    </div>

                    <div className="grid gap-3 font-sans text-sm text-dark-brown sm:grid-cols-2 md:min-w-[280px]">
                      <div>
                        <p className="mb-1 text-[11px] uppercase tracking-[0.12em] text-subtle">
                          Estado de orden
                        </p>
                        <p className="font-medium">
                          {resolveOrderStatusLabel(order.status)}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-[11px] uppercase tracking-[0.12em] text-subtle">
                          Estado de pago
                        </p>
                        <p className="font-medium">
                          {resolvePaymentStatusLabel(order.paymentStatus)}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-[11px] uppercase tracking-[0.12em] text-subtle">
                          Total
                        </p>
                        <p className="font-medium text-primary">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-[11px] uppercase tracking-[0.12em] text-subtle">
                          Items
                        </p>
                        <p className="font-medium">{order.items.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 flex flex-col gap-4">
                    {order.items.map((item) => (
                      <div
                        key={item.orderItemId}
                        className="flex items-start justify-between gap-4 border-b border-dark-brown/10 pb-4 last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="text-xs text-primary">
                            {item.kind === "paquete"
                              ? "Paquete"
                              : "Experiencia"}
                          </p>
                          <p className="font-sans text-sm font-medium text-dark-brown">
                            {item.name}
                          </p>
                          <p className="mt-1 font-sans text-xs text-subtle">
                            {item.quantity} pasajero(s)
                          </p>
                        </div>

                        <span className="whitespace-nowrap font-sans text-sm font-semibold text-dark-brown">
                          {formatPrice(item.totalPrice)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 border-t border-dark-brown/10 pt-6 sm:flex-row sm:flex-wrap">
                    {canResumeTransfer ? (
                      <Link
                        href={`/checkout/transferencia?orderId=${order.orderId}`}
                        className="inline-flex justify-center bg-primary px-5 py-3 font-sans text-sm font-bold text-off-white transition-colors hover:bg-primary/85"
                      >
                        Continuar transferencia
                      </Link>
                    ) : null}

                    {canViewReceipt && order.payment ? (
                      <Link
                        href={`/api/payments/bank-transfer/${order.payment.paymentId}/receipt-url`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex justify-center border border-primary px-5 py-3 font-sans text-sm font-bold text-primary transition-colors hover:bg-primary/5"
                      >
                        Ver comprobante
                      </Link>
                    ) : null}

                    <Link
                      href={`/checkout/success?orderId=${order.orderId}`}
                      className="inline-flex justify-center border border-dark-brown/20 px-5 py-3 font-sans text-sm font-bold text-dark-brown transition-colors hover:bg-dark-brown/5"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
