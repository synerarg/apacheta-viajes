"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Copy, Check, Plus, FileText } from "lucide-react"
import { toast } from "sonner"

import {
  loadLastCheckoutSnapshot,
  saveLastCheckoutSnapshot,
} from "@/lib/cart/cart-storage"
import type { CheckoutOrderDetailResult } from "@/types/checkout/checkout.types"

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`
}

function getRemainingSeconds(expiresAt?: string | null) {
  if (!expiresAt) {
    return 0
  }

  const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)

  return Math.max(0, diff)
}

export default function TransferenciaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const checkoutSnapshot = useMemo(() => loadLastCheckoutSnapshot(), [])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [orderDetail, setOrderDetail] = useState<CheckoutOrderDetailResult | null>(
    null,
  )
  const [isLoadingOrder, setIsLoadingOrder] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const orderId = searchParams.get("orderId") ?? checkoutSnapshot?.order.orderId
  const [timeLeft, setTimeLeft] = useState(
    getRemainingSeconds(checkoutSnapshot?.bankTransfer?.expiresAt),
  )

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
          toast.error(result.error ?? "No se pudo cargar la orden.")
          return
        }

        if (!active) {
          return
        }

        setOrderDetail(result)
        setTimeLeft(getRemainingSeconds(result.bankTransfer?.expiresAt))

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
        toast.error("No se pudo cargar la orden.")
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((previousTime) => (previousTime > 0 ? previousTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const bankTransfer = orderDetail?.bankTransfer
  const totalAmount =
    bankTransfer?.amount ??
    checkoutSnapshot?.bankTransfer?.amount ??
    checkoutSnapshot?.order.total ??
    0
  const bankData = [
    { label: "Total a Pagar", value: formatPrice(totalAmount), isPrice: true },
    { label: "Banco", value: bankTransfer?.bankDetails.bankName ?? "-" },
    {
      label: "CBU",
      value: bankTransfer?.bankDetails.cbu ?? "-",
      copyable: true,
    },
    {
      label: "Alias",
      value: bankTransfer?.bankDetails.alias ?? "-",
      copyable: true,
    },
    {
      label: "CUIT",
      value: bankTransfer?.bankDetails.taxId ?? "-",
    },
  ]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const copyToClipboard = (text: string, field: string) => {
    if (!text || text === "-") {
      return
    }

    void navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file && file.size <= 5 * 1024 * 1024) {
      setSelectedFile(file)
      return
    }

    if (file) {
      toast.error("El archivo excede el tamaño máximo permitido.")
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      return
    }

    if (!bankTransfer?.paymentId) {
      toast.error("No se encontró el pago de transferencia para esta reserva.")
      return
    }

    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.set("receipt", selectedFile)

      const response = await fetch(
        `/api/payments/bank-transfer/${bankTransfer.paymentId}/receipt`,
        {
          method: "POST",
          body: formData,
        },
      )
      const result = (await response.json()) as { error?: string }

      if (!response.ok) {
        toast.error(result.error ?? "No se pudo enviar el comprobante.")
        return
      }

      toast.success("Comprobante enviado correctamente.")
      router.push(`/checkout/success?orderId=${orderId}`)
    } catch {
      toast.error("No se pudo enviar el comprobante.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-off-white pt-28 pb-16">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[900px]">
        <Link
          href="/checkout"
          className="text-[11px] tracking-widest text-subtle font-sans uppercase hover:text-primary transition-colors"
        >
          ← VOLVER
        </Link>

        <h1 className="font-serif text-3xl md:text-4xl lg:text-[48px] font-normal italic text-dark-brown leading-tight mt-4">
          Transferencia Bancaria
        </h1>

        <p className="text-[15px] text-subtle font-sans mt-3">
          Realizá el depósito con los siguientes datos para confirmar tu reserva.
        </p>

        <div className="flex justify-end mt-6">
          <div className="bg-primary text-off-white text-sm font-sans px-4 py-2">
            Tiempo Restante:{" "}
            {isLoadingOrder ? "--:--" : formatTime(timeLeft)}
          </div>
        </div>

        <div className="mt-4 border border-dark-brown/20 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-dark-brown/20">
            <h2 className="text-base font-bold text-dark-brown font-sans">
              Datos de la Cuenta
            </h2>
          </div>

          <div className="divide-y divide-dark-brown/10">
            {bankData.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between px-6 py-4"
              >
                <span className="text-[15px] font-sans text-dark-brown">
                  {item.label}
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className={
                      item.isPrice
                        ? "font-sans text-lg font-bold text-dark-brown"
                        : "text-[15px] font-sans text-dark-brown font-medium"
                    }
                  >
                    {item.value}
                  </span>
                  {item.copyable && (
                    <button
                      onClick={() => copyToClipboard(item.value, item.label)}
                      className="text-primary hover:text-primary/70 transition-colors"
                      aria-label={`Copiar ${item.label}`}
                    >
                      {copiedField === item.label ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 border border-dark-brown/20 bg-white overflow-hidden">
          <div className="flex items-center justify-between p-6 gap-6">
            <div className="flex items-start gap-4 min-w-0">
              <FileText className="w-6 h-6 text-dark-brown shrink-0 mt-0.5" />
              <div className="min-w-0">
                <h3 className="text-base font-bold text-dark-brown font-sans">
                  Adjuntar comprobante
                </h3>
                <p className="text-[13px] text-subtle font-sans mt-0.5 leading-relaxed">
                  Subí tu comprobante en formato PDF para validar tu reserva.
                </p>
                {selectedFile && (
                  <p className="text-sm text-primary font-sans mt-2 font-medium truncate">
                    {selectedFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center shrink-0">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 border border-dark-brown/20 bg-off-white flex flex-col items-center justify-center gap-1.5 hover:bg-dark-brown/5 transition-colors"
              >
                <Plus className="w-5 h-5 text-primary" />
                <span className="text-[11px] text-dark-brown font-sans font-medium text-center leading-tight">
                  Seleccionar PDF
                </span>
              </button>
              <span className="text-[11px] text-subtle font-sans mt-2">
                Tamaño máx. 5MB
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedFile || isSubmitting || isLoadingOrder}
          className={`w-full mt-8 text-off-white text-center text-base font-bold font-sans py-4 transition-colors ${
            !selectedFile || isSubmitting || isLoadingOrder
              ? "bg-dark-brown/40 cursor-not-allowed"
              : "bg-dark-brown hover:bg-dark-brown/80 cursor-pointer"
          }`}
        >
          {isSubmitting ? "Enviando..." : "Enviar"}
        </button>

        <p className="text-[12px] text-subtle font-sans text-center mt-4">
          Pago Seguro • Apacheta Travel Agency
        </p>
      </div>
    </main>
  )
}
