import Link from "next/link"
import { notFound } from "next/navigation"
import { CaretLeft } from "@phosphor-icons/react/dist/ssr"

import { OperatorTypeForm } from "@/components/dashboard/operator-type-form"
import { DeleteQuoterItemButton } from "@/components/dashboard/delete-quoter-item-button"
import { createServerOperatorTypesController } from "@/controllers/operator-types/operator-types.controller"

interface EditarTipoOperadorPageProps {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export default async function EditarTipoOperadorPage({
  params,
}: EditarTipoOperadorPageProps) {
  const { id } = await params
  const controller = await createServerOperatorTypesController()

  let tipo
  try {
    tipo = await controller.getById(id)
  } catch {
    notFound()
  }

  if (!tipo) notFound()

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="font-playfair text-xl sm:text-2xl font-bold text-neutral-900">
            {tipo.nombre}
          </h1>
          <DeleteQuoterItemButton
            endpoint={`/api/dashboard/operator-types/${tipo.id}`}
            label="Eliminar tipo"
            redirectTo="/dashboard/operadores/tipos"
            variant="button"
          />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <OperatorTypeForm initialData={tipo} isEdit />
      </div>
    </div>
  )
}
