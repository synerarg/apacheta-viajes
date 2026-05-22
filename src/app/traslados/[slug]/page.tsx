import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { createServerTransfersController } from "@/controllers/transfers/transfers.controller"
import { createServerTransferRatesController } from "@/controllers/transfer-rates/transfer-rates.controller"
import { createServerTransferImagesController } from "@/controllers/transfer-images/transfer-images.controller"
import {
  TransferView,
  type TransferRateRow,
  type TransferViewData,
} from "@/components/transfers/transfer-view"

interface Props {
  params: Promise<{ slug: string }>
}

async function getTransferViewData(slug: string): Promise<TransferViewData | null> {
  const transfersController = await createServerTransfersController()
  const [traslado] = await transfersController.list({
    slug,
    activo: true,
  })

  if (!traslado) {
    return null
  }

  const [tarifasController, imagenesController] = await Promise.all([
    createServerTransferRatesController(),
    createServerTransferImagesController(),
  ])

  const [tarifas, imagenes] = await Promise.all([
    tarifasController.list({ traslado_id: traslado.id }),
    imagenesController.list({ traslado_id: traslado.id }),
  ])

  const galeria = [
    traslado.imagen_url,
    ...imagenes
      .sort((leftImage, rightImage) => (leftImage.orden ?? 0) - (rightImage.orden ?? 0))
      .map((image) => image.url),
  ].filter((image): image is string => Boolean(image))

  const tarifasOrdenadas: TransferRateRow[] = [...tarifas]
    .sort((leftTarifa, rightTarifa) => {
      const leftOrder = leftTarifa.orden ?? Number.MAX_SAFE_INTEGER
      const rightOrder = rightTarifa.orden ?? Number.MAX_SAFE_INTEGER
      return leftOrder - rightOrder
    })
    .map((tarifa) => ({
      id: tarifa.id,
      vigencia_label: tarifa.vigencia_label ?? null,
      vigencia_desde: tarifa.vigencia_desde ?? null,
      vigencia_hasta: tarifa.vigencia_hasta ?? null,
      precio_adulto: Number(tarifa.precio_adulto ?? 0),
      precio_nino:
        tarifa.precio_nino !== null && tarifa.precio_nino !== undefined
          ? Number(tarifa.precio_nino)
          : null,
      moneda: tarifa.moneda ?? null,
      notas: tarifa.notas ?? null,
    }))

  return {
    id: traslado.id,
    slug: traslado.slug,
    nombre: traslado.nombre,
    descripcion: traslado.descripcion,
    descripcion_corta: traslado.descripcion_corta,
    origen: traslado.origen,
    destino: traslado.destino,
    tipo_servicio: traslado.tipo_servicio,
    modalidad: traslado.modalidad,
    vehiculo_tipo: traslado.vehiculo_tipo,
    capacidad_max: traslado.capacidad_max,
    base_minima_pax: traslado.base_minima_pax ?? 1,
    precio_desde: Number(traslado.precio_desde ?? 0),
    moneda: traslado.moneda ?? "ARS",
    duracion_minutos: traslado.duracion_minutos,
    incluye_equipaje: traslado.incluye_equipaje,
    incluye_iva: traslado.incluye_iva,
    impuestos_adicionales_pct:
      traslado.impuestos_adicionales_pct !== null &&
      traslado.impuestos_adicionales_pct !== undefined
        ? Number(traslado.impuestos_adicionales_pct)
        : null,
    imagen_url: traslado.imagen_url,
    galeria,
    tarifas: tarifasOrdenadas,
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const traslado = await getTransferViewData(slug)

  if (!traslado) {
    return {}
  }

  return {
    title: `${traslado.nombre} | Traslados | Apacheta Viajes`,
    description:
      traslado.descripcion_corta ??
      `Servicio de traslado ${traslado.tipo_servicio} entre ${traslado.origen} y ${traslado.destino}.`,
  }
}

export default async function TransferDetailPage({ params }: Props) {
  const { slug } = await params
  const traslado = await getTransferViewData(slug)

  if (!traslado) notFound()

  return <TransferView traslado={traslado} />
}
