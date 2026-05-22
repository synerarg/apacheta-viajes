// Replica el formato del cotizador HTML original (getItineraryText).
// El texto se usa para WhatsApp, mailto y portapapeles.

export interface ItineraryItem {
  dia_offset: number
  fecha: string | Date | null
  servicio_nombre: string
  servicio_descripcion: string | null
  adultos: number
  menores: number
  subtotal_venta: number
  is_special?: boolean
}

export interface ItineraryQuote {
  cliente_nombre: string | null
  cliente_email: string | null
  cliente_telefono: string | null
  fecha_inicio: string | Date | null
  fecha_fin: string | Date | null
  items: ItineraryItem[]
  total_venta: number
  total_comision: number
  total_impuesto: number
  total_final: number
  aplica_impuesto: boolean
  impuesto_pct: number
}

function formatARS(n: number | null | undefined): string {
  const v = Math.round(Number(n) || 0)
  return `$${v.toLocaleString("es-AR")}`
}

function toDate(d: string | Date | null): Date | null {
  if (!d) return null
  if (d instanceof Date) return d
  // Las fechas vienen como YYYY-MM-DD (sin TZ)
  const s = typeof d === "string" && d.length === 10 ? `${d}T00:00:00` : d
  const dt = new Date(s)
  return Number.isNaN(dt.getTime()) ? null : dt
}

function formatLongDate(d: Date): string {
  return d.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatWeekday(d: Date): string {
  return d.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

export function generateItineraryText(
  cotizacion: ItineraryQuote,
  publicUrl?: string,
): string {
  const inicio = toDate(cotizacion.fecha_inicio)
  const fin = toDate(cotizacion.fecha_fin)
  const inicioStr = inicio ? formatLongDate(inicio) : ""
  const finStr = fin ? formatLongDate(fin) : ""

  let text = `🌄 *Cotización Apacheta Viajes*\n`
  text += `👤 ${cotizacion.cliente_nombre ?? ""}\n`
  text += `📧 ${cotizacion.cliente_email ?? ""} | 📞 ${cotizacion.cliente_telefono ?? ""}\n`
  text += `📅 ${inicioStr}${finStr ? ` al ${finStr}` : ""}\n\n`

  // Agrupar por día
  const byDay = new Map<number, ItineraryItem[]>()
  for (const it of cotizacion.items) {
    const arr = byDay.get(it.dia_offset) ?? []
    arr.push(it)
    byDay.set(it.dia_offset, arr)
  }

  const sortedDayOffsets = [...byDay.keys()].sort((a, b) => a - b)

  for (const day of sortedDayOffsets) {
    const items = byDay.get(day)!
    let dayDate: Date | null = null
    if (items[0]?.fecha) {
      dayDate = toDate(items[0].fecha)
    } else if (inicio) {
      dayDate = new Date(inicio.getTime())
      dayDate.setDate(dayDate.getDate() + day)
    }
    const fechaStr = dayDate ? formatWeekday(dayDate) : ""
    text += `*Día ${day + 1}: ${fechaStr}*\n`

    if (items.length === 0) {
      text += `   (sin servicios)\n`
    } else {
      for (const s of items) {
        text += `• ${s.servicio_nombre}\n`
        if (s.servicio_descripcion) {
          text += `   ${s.servicio_descripcion}\n`
        }
        if (s.is_special) {
          text += `   Precio: ${formatARS(s.subtotal_venta)}\n`
        } else {
          text += `   (${s.adultos} ad / ${s.menores} ch) → ${formatARS(s.subtotal_venta)}\n`
        }
      }
    }
    text += `\n`
  }

  text += `\n💰 *RESUMEN DE COSTOS*\n`
  text += `Total: ${formatARS(cotizacion.total_venta)}\n`
  if (cotizacion.aplica_impuesto) {
    text += `Impuestos (${Number(cotizacion.impuesto_pct).toFixed(1)}%): ${formatARS(cotizacion.total_impuesto)}\n`
  } else {
    text += `Impuestos (${Number(cotizacion.impuesto_pct).toFixed(1)}%): No aplicado\n`
  }
  text += `*TOTAL FINAL: ${formatARS(cotizacion.total_final)}*`

  if (publicUrl) {
    text += `\n🔗 Ver online: ${publicUrl}\n`
  }

  return text
}
