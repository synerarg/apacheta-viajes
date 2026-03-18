"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Copy, Check, Plus, FileText } from "lucide-react"

const bankData = [
  { label: "Total a Pagar", value: "$45.000", isPrice: true },
  { label: "Banco", value: "Banco Galicia" },
  { label: "CBU", value: "0000000008000000000000", copyable: true },
  { label: "Alias", value: "VIAJES.APA.CHETA", copyable: true },
  { label: "CUIT", value: "30-71111111-9" },
]

export default function TransferenciaPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(20 * 60)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size <= 5 * 1024 * 1024) {
      setSelectedFile(file)
    }
  }

  const handleSubmit = () => {
    if (selectedFile) {
      router.push("/checkout/success")
    }
  }

  return (
    <main className="min-h-screen bg-off-white pt-28 pb-16">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[900px]">
        {/* Back link */}
        <Link
          href="/checkout"
          className="text-[11px] tracking-widest text-subtle font-sans uppercase hover:text-primary transition-colors"
        >
          ← VOLVER
        </Link>

        {/* Heading */}
        <h1 className="font-serif text-3xl md:text-4xl lg:text-[48px] font-normal italic text-dark-brown leading-tight mt-4">
          Transferencia Bancaria
        </h1>

        <p className="text-[15px] text-subtle font-sans mt-3">
          Realizá el depósito con los siguientes datos para confirmar tu reserva.
        </p>

        {/* Timer */}
        <div className="flex justify-end mt-6">
          <div className="bg-primary text-off-white text-sm font-sans px-4 py-2">
            Tiempo Restante: {formatTime(timeLeft)}
          </div>
        </div>

        {/* Bank data card */}
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

        {/* File upload section */}
        <div className="mt-6 border border-dark-brown/20 bg-white overflow-hidden">
          <div className="flex items-center justify-between p-6 gap-6">
            {/* Left: info */}
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

            {/* Right: select button */}
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

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!selectedFile}
          className={`w-full mt-8 text-off-white text-center text-base font-bold font-sans py-4 transition-colors ${
            selectedFile
              ? "bg-dark-brown hover:bg-dark-brown/80 cursor-pointer"
              : "bg-dark-brown/40 cursor-not-allowed"
          }`}
        >
          Enviar
        </button>

        <p className="text-[12px] text-subtle font-sans text-center mt-4">
          Pago Seguro • Apacheta Travel Agency
        </p>
      </div>
    </main>
  )
}
