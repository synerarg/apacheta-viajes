import Link from "next/link"
import { CaretLeft } from "@phosphor-icons/react/dist/ssr"

import { OperatorTypeForm } from "@/components/dashboard/operator-type-form"

export default function NuevoTipoOperadorPage() {
  return (
    <div className="min-h-full bg-neutral-50 pb-16">
      <div className="border-b border-neutral-200 bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <Link
          href="/dashboard/operadores/tipos"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-700"
        >
          <CaretLeft className="h-3.5 w-3.5" />
          Volver a tipos
        </Link>
        <h1 className="font-playfair text-xl sm:text-2xl font-bold text-neutral-900">
          Nuevo tipo de operador
        </h1>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <OperatorTypeForm />
      </div>
    </div>
  )
}
