import { createServerCategoriasExperienciaController } from "@/controllers/categorias-experiencia/categorias-experiencia.controller"
import { createServerEmisivoDestinosController } from "@/controllers/emisivo-destinos/emisivo-destinos.controller"
import { createServerEstadisticasHomeController } from "@/controllers/estadisticas-home/estadisticas-home.controller"
import { createServerExperienciasController } from "@/controllers/experiencias/experiencias.controller"
import { createServerHotelesController } from "@/controllers/hoteles/hoteles.controller"
import { createServerPaquetesCategoriasController } from "@/controllers/paquetes-categorias/paquetes-categorias.controller"
import { createServerPaquetesController } from "@/controllers/paquetes/paquetes.controller"
import { createServerPaquetesFechasController } from "@/controllers/paquetes-fechas/paquetes-fechas.controller"
import type {
  StorefrontEmisivoDestinationItem,
  StorefrontExperienceCategoryItem,
  StorefrontExperienceItem,
  StorefrontHotelItem,
  StorefrontMetricItem,
  StorefrontPackageItem,
} from "@/types/storefront/storefront.types"

function sortByNullableOrder<T extends { orden: number | null }>(items: T[]) {
  return [...items].sort((leftItem, rightItem) => {
    const leftOrder = leftItem.orden ?? Number.MAX_SAFE_INTEGER
    const rightOrder = rightItem.orden ?? Number.MAX_SAFE_INTEGER

    return leftOrder - rightOrder
  })
}

function formatDateLabel(dateValue: string) {
  const formatted = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${dateValue}T00:00:00`))

  return formatted.replace(".", "").replace(/^\w/, (letter) => letter.toUpperCase())
}

function formatDateRange(startDate: string, endDate: string) {
  return `${formatDateLabel(startDate)} — ${formatDateLabel(endDate)}`
}

function withFallbackImage(image: string | null | undefined, fallbackImage: string) {
  return image?.trim() || fallbackImage
}

async function getPackageCategoryMaps() {
  const [paquetesCategoriasController, categoriasController] = await Promise.all([
    createServerPaquetesCategoriasController(),
    createServerCategoriasExperienciaController(),
  ])
  const [relations, categories] = await Promise.all([
    paquetesCategoriasController.list(),
    categoriasController.list({
      activo: true,
    }),
  ])
  const categoryById = new Map(categories.map((category) => [category.id, category]))
  const categoryNameByPackageId = new Map<string, string>()

  for (const relation of relations) {
    if (!categoryNameByPackageId.has(relation.paquete_id)) {
      const category = categoryById.get(relation.categoria_id)

      if (category) {
        categoryNameByPackageId.set(relation.paquete_id, category.nombre)
      }
    }
  }

  return {
    categoryNameByPackageId,
    categories,
  }
}

export async function getPackagesCatalogData() {
  const [paquetesController, paquetesFechasController] = await Promise.all([
    createServerPaquetesController(),
    createServerPaquetesFechasController(),
  ])
  const [{ categoryNameByPackageId }, paquetes, fechas] = await Promise.all([
    getPackageCategoryMaps(),
    paquetesController.list({
      activo: true,
    }),
    paquetesFechasController.list({
      activo: true,
    }),
  ])
  const datesByPackageId = new Map<string, typeof fechas>()

  for (const fecha of fechas) {
    const existingDates = datesByPackageId.get(fecha.paquete_id) ?? []
    existingDates.push(fecha)
    datesByPackageId.set(fecha.paquete_id, existingDates)
  }

  const items = sortByNullableOrder(paquetes).map<StorefrontPackageItem>((paquete) => {
    const nextDate = [...(datesByPackageId.get(paquete.id) ?? [])].sort((leftDate, rightDate) =>
      leftDate.fecha_inicio.localeCompare(rightDate.fecha_inicio),
    )[0]

    return {
      id: paquete.id,
      slug: paquete.slug,
      category: categoryNameByPackageId.get(paquete.id) ?? "Paquete",
      name: paquete.nombre,
      description: paquete.descripcion_corta ?? "",
      price: nextDate?.precio_por_persona ?? paquete.precio_desde,
      currency: nextDate?.moneda ?? paquete.moneda ?? "ARS",
      image: withFallbackImage(paquete.imagen_url, "/landing/placeholder.png"),
      durationDays: paquete.duracion_dias,
      departureLabel: nextDate
        ? formatDateRange(nextDate.fecha_inicio, nextDate.fecha_fin)
        : undefined,
    }
  })
  const categories = [
    "Todos",
    ...new Set(items.map((item) => item.category).filter(Boolean)),
  ]

  return {
    items,
    categories,
  }
}

export async function getExperiencesCatalogData() {
  const [experienciasController, categoriasController] = await Promise.all([
    createServerExperienciasController(),
    createServerCategoriasExperienciaController(),
  ])
  const [experiencias, categorias] = await Promise.all([
    experienciasController.list({
      activo: true,
    }),
    categoriasController.list({
      activo: true,
    }),
  ])
  const categoryById = new Map(categorias.map((category) => [category.id, category]))

  const items = sortByNullableOrder(experiencias).map<StorefrontExperienceItem>(
    (experiencia) => {
      const category = experiencia.categoria_id
        ? categoryById.get(experiencia.categoria_id)
        : null

      return {
        id: experiencia.id,
        slug: experiencia.slug,
        category: category?.nombre ?? "Experiencia",
        categorySlug: category?.slug,
        name: experiencia.nombre,
        description: experiencia.descripcion_corta ?? "",
        image: withFallbackImage(
          experiencia.imagen_url,
          "/landing/experiences/experience-1.jpg",
        ),
        price: Number(experiencia.precio ?? 0),
        currency: experiencia.moneda ?? "ARS",
      }
    },
  )
  const categories = [
    "Todos",
    ...new Set(items.map((item) => item.category).filter(Boolean)),
  ]

  return {
    items,
    categories,
  }
}

export async function getHomeMetricsData(): Promise<StorefrontMetricItem[]> {
  const estadisticasController = await createServerEstadisticasHomeController()
  const stats = await estadisticasController.list({
    activo: true,
  })

  return sortByNullableOrder(stats).map((stat) => ({
    value: stat.valor,
    label: stat.descripcion.toUpperCase(),
  }))
}

export async function getFeaturedPackagesData(limit = 3) {
  const { items } = await getPackagesCatalogData()

  return items.slice(0, limit)
}

export async function getFeaturedExperienceCategoriesData(
  limit = 6,
): Promise<StorefrontExperienceCategoryItem[]> {
  const { items } = await getExperiencesCatalogData()
  const categoriesByName = new Map<string, StorefrontExperienceCategoryItem>()

  for (const item of items) {
    if (!categoriesByName.has(item.category)) {
      categoriesByName.set(item.category, {
        id: item.categorySlug ?? item.id,
        name: item.category,
        image: item.image,
        href: item.categorySlug
          ? `/experiencias?categoria=${encodeURIComponent(item.category)}`
          : "/experiencias",
      })
    }
  }

  return [...categoriesByName.values()].slice(0, limit)
}

export async function getFeaturedHotelsData(limit = 3): Promise<StorefrontHotelItem[]> {
  const hotelesController = await createServerHotelesController()
  const hoteles = await hotelesController.list({
    activo: true,
  })

  return sortByNullableOrder(hoteles)
    .slice(0, limit)
    .map((hotel) => ({
      id: hotel.id,
      name: hotel.nombre,
      location: [hotel.ciudad, hotel.provincia].filter(Boolean).join(", "),
      image: withFallbackImage(hotel.imagen_url, "/landing/placeholder-2.png"),
      stars: hotel.estrellas ?? 0,
      href: "/#contacto",
    }))
}

export async function getEmisivoDestinationsData(
  limit?: number,
): Promise<StorefrontEmisivoDestinationItem[]> {
  const emisivoDestinosController = await createServerEmisivoDestinosController()
  const destinos = await emisivoDestinosController.list({
    activo: true,
  })
  const items = sortByNullableOrder(destinos).map((destino) => ({
    id: destino.id,
    slug: destino.slug,
    name: destino.nombre,
    description: destino.descripcion_corta ?? destino.pais,
    image: withFallbackImage(destino.imagen_url, "/landing/placeholder-3.png"),
    country: destino.pais,
    href: "/emisivo",
  }))

  return typeof limit === "number" ? items.slice(0, limit) : items
}
