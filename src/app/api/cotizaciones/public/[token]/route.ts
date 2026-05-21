import { NextResponse } from "next/server"

import { createServerCotizacionesController } from "@/controllers/cotizaciones/cotizaciones.controller"
import { handleCotizadorError } from "@/lib/cotizaciones/errors"

// Endpoint público: NO requiere auth, devuelve la cotización solo si estado='enviada'.
// La vista pública no debe exponer total_neto/total_comision/subtotal_neto/subtotal_comision/comision_pct.

export async function GET(
  _req: Request,
  context: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await context.params
    const controller = await createServerCotizacionesController()
    const cotizacion = await controller.getByToken(token)
    if (!cotizacion) {
      return NextResponse.json({ error: "Cotización no encontrada" }, { status: 404 })
    }

    // Sanitizar: quitar campos sensibles antes de exponerlos públicamente.
    const publicCotizacion = {
      id: cotizacion.id,
      token: cotizacion.token,
      cliente_nombre: cotizacion.cliente_nombre,
      cliente_email: cotizacion.cliente_email,
      cliente_telefono: cotizacion.cliente_telefono,
      fecha_inicio: cotizacion.fecha_inicio,
      fecha_fin: cotizacion.fecha_fin,
      aplica_impuesto: cotizacion.aplica_impuesto,
      impuesto_pct: cotizacion.impuesto_pct,
      total_venta: cotizacion.total_venta,
      total_impuesto: cotizacion.total_impuesto,
      total_final: cotizacion.total_final,
      estado: cotizacion.estado,
      created_at: cotizacion.created_at,
      items: cotizacion.items.map((it) => ({
        id: it.id,
        dia_offset: it.dia_offset,
        fecha: it.fecha,
        servicio_nombre: it.servicio_nombre,
        servicio_descripcion: it.servicio_descripcion,
        adultos: it.adultos,
        menores: it.menores,
        subtotal_venta: it.subtotal_venta,
        is_special: it.is_special,
        orden: it.orden,
      })),
    }

    return NextResponse.json({ cotizacion: publicCotizacion }, { status: 200 })
  } catch (error) {
    return handleCotizadorError(error)
  }
}
