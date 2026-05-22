import Link from "next/link"
import { notFound } from "next/navigation"
import { CaretLeft } from "@phosphor-icons/react/dist/ssr"

import { QuoterCategoryForm } from "@/components/dashboard/quoter-category-form"
import { DeleteQuoterItemButton } from "@/components/dashboard/delete-quoter-item-button"
import { createServerQuoterCategoriesController } from "@/controllers/quoter-categories/quoter-categories.controller"

interface EditarCategoriaPageProps {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export default async function EditarCategoriaPage({
  params,
}: EditarCategoriaPageProps) {
  const { id } = await params
  const controller = await createServerQuoterCategoriesController()

  let categoria
  try {
    categoria = await controller.getById(id)
  } catch {
    notFound()
  }

  if (!categoria) notFound()

  return (
    <div className="min-h-full bg-neutral-50 pb-16">
      <div className="border-b border-neutral-200 bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <Link
          href="/dashboard/cotizador/catalogo"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-700"
        >
          <CaretLeft className="h-3.5 w-3.5" />
          Volver al catálogo
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="font-playfair text-xl sm:text-2xl font-bold text-neutral-900">
            {categoria.nombre}
          </h1>
          <DeleteQuoterItemButton
            endpoint={`/api/dashboard/cotizador-categorias/${categoria.id}`}
            label="Eliminar categoría"
            redirectTo="/dashboard/cotizador/catalogo"
          />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <QuoterCategoryForm initialData={categoria} isEdit />
      </div>
    </div>
  )
}
