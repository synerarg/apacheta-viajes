import Link from "next/link"
import { notFound } from "next/navigation"
import { CaretLeft, CurrencyDollar } from "@phosphor-icons/react/dist/ssr"

import { QuoterServiceForm } from "@/components/dashboard/quoter-service-form"
import { DeleteQuoterItemButton } from "@/components/dashboard/delete-quoter-item-button"
import { createServerQuoterCategoriesController } from "@/controllers/quoter-categories/quoter-categories.controller"
import { createServerQuoterServicesController } from "@/controllers/quoter-services/quoter-services.controller"

export const dynamic = "force-dynamic"

interface EditarServicioPageProps {
  params: Promise<{ id: string }>
}

export default async function EditarServicioPage({
  params,
}: EditarServicioPageProps) {
  const { id } = await params

  const [categoriesController, servicesController] = await Promise.all([
    createServerQuoterCategoriesController(),
    createServerQuoterServicesController(),
  ])

  let servicio
  try {
    servicio = await servicesController.getById(id)
  } catch {
    notFound()
  }

  if (!servicio) notFound()

  const categorias = await categoriesController.list()

  return (
    <div className="min-h-full bg-neutral-50 pb-16">
      <div className="border-b border-neutral-200 bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <Link
          href="/dashboard/cotizador/catalogo/servicios"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-700"
        >
          <CaretLeft className="h-3.5 w-3.5" />
          Volver a servicios
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="font-playfair text-xl sm:text-2xl font-bold text-neutral-900">
            {servicio.nombre}
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/cotizador/catalogo/precios/${servicio.id}`}
              className="inline-flex items-center gap-2 border border-primary px-3 py-1.5 text-sm text-primary hover:bg-primary/5"
            >
              <CurrencyDollar className="h-4 w-4" />
              Precios
            </Link>
            <DeleteQuoterItemButton
              endpoint={`/api/dashboard/cotizador-servicios/${servicio.id}`}
              label="Eliminar servicio"
              redirectTo="/dashboard/cotizador/catalogo/servicios"
            />
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <QuoterServiceForm
          categorias={categorias}
          initialData={servicio}
          isEdit
        />
      </div>
    </div>
  )
}
