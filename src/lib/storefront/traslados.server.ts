import { createServerTrasladosController } from "@/controllers/traslados/traslados.controller"

export interface StorefrontTrasladoItem {
  id: string
  slug: string
  nombre: string
  descripcion: string
  origen: string
  destino: string
  tipoServicio: "regular" | "privado"
  modalidad: "ida" | "ida_vuelta" | "punto_a_punto"
  vehiculoTipo: string | null
  precioDesde: number
  moneda: string
  duracionMinutos: number | null
  imagen: string
  basePax: number
}

function sortByNullableOrder<T extends { orden: number | null }>(items: T[]) {
  return [...items].sort((leftItem, rightItem) => {
    const leftOrder = leftItem.orden ?? Number.MAX_SAFE_INTEGER
    const rightOrder = rightItem.orden ?? Number.MAX_SAFE_INTEGER

    return leftOrder - rightOrder
  })
}

function withFallbackImage(image: string | null | undefined, fallbackImage: string) {
  return image?.trim() || fallbackImage
}

export async function getTrasladosCatalogData() {
  const trasladosController = await createServerTrasladosController()
  const traslados = await trasladosController.list({ activo: true })

  const items = sortByNullableOrder(traslados).map<StorefrontTrasladoItem>(
    (traslado) => ({
      id: traslado.id,
      slug: traslado.slug,
      nombre: traslado.nombre,
      descripcion: traslado.descripcion_corta ?? traslado.descripcion ?? "",
      origen: traslado.origen,
      destino: traslado.destino,
      tipoServicio: traslado.tipo_servicio,
      modalidad: traslado.modalidad,
      vehiculoTipo: traslado.vehiculo_tipo,
      precioDesde: Number(traslado.precio_desde ?? 0),
      moneda: traslado.moneda ?? "ARS",
      duracionMinutos: traslado.duracion_minutos,
      imagen: withFallbackImage(traslado.imagen_url, "/landing/placeholder.png"),
      basePax: traslado.base_minima_pax ?? 1,
    }),
  )

  const origenes = ["Todos", ...new Set(items.map((item) => item.origen).filter(Boolean))]
  const tiposSet = new Set<"regular" | "privado">(
    items.map((item) => item.tipoServicio),
  )
  const tipos: ("regular" | "privado")[] = ["regular", "privado"].filter((tipo) =>
    tiposSet.has(tipo as "regular" | "privado"),
  ) as ("regular" | "privado")[]

  return {
    items,
    origenes,
    tipos,
  }
}
