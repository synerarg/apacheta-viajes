// Replica generateRecommendations() del cotizador HTML.
// Devuelve la lista de tips a guardar en cotizaciones.recomendaciones (text[]).

export interface RecommendationItem {
  servicio_nombre: string
}

export function generateRecommendations(
  items: RecommendationItem[],
  fechaInicio?: Date | null,
): string[] {
  const names = [...new Set(items.map((i) => i.servicio_nombre || ""))]

  const has = (needle: string) =>
    names.some((n) => n.toLowerCase().includes(needle.toLowerCase()))

  const hasAltitude =
    has("Salinas Grandes") ||
    has("Hornocal") ||
    has("Iruya") ||
    has("Safari a las Nubes") ||
    has("San Antonio de los Cobres") ||
    has("Tren a las Nubes")
  const hasSalinas = has("Salinas Grandes")
  const hasHornocal = has("Hornocal")
  const hasQuebrada = has("Quebrada de Humahuaca") || has("Humahuaca")
  const hasCafayate = has("Cafayate")
  const hasPurmamarca = has("Purmamarca")
  const hasHumahuaca = has("Humahuaca")

  const month = fechaInicio ? fechaInicio.getMonth() + 1 : null
  const isWinter = month !== null && month >= 6 && month <= 8

  const recs: string[] = [
    "🌞 *General*: Se recomienda llevar siempre agua, protector solar, gorro y calzado cómodo.",
  ]

  if (hasAltitude) {
    recs.push(
      "🏔️ *Altitud*: Durante estas jornadas se alcanzan los 4.170 msnm (Cuesta de Lipán) y 4.200 msnm (Hornocal). Se recomienda beber mucha agua, evitar movimientos bruscos, realizar comidas ligeras y aclimatarse previamente.",
    )
    if (isWinter) {
      recs.push(
        "❄️ *Clima invernal*: En los meses de invierno las temperaturas en altura pueden descender varios grados bajo cero. Es imprescindible llevar ropa de abrigo adecuada (campera térmica, guantes, gorro de lana).",
      )
    }
  }

  if (hasSalinas || hasQuebrada) {
    recs.push(
      "🕶️ *Indumentaria*: Es fundamental el uso de anteojos de sol, protector solar y ropa de abrigo (incluso en días soleados la temperatura baja drásticamente en la altura). Se recomienda vestirse en capas.",
    )
  }

  if (hasSalinas || hasHornocal) {
    recs.push(
      "💵 *Ingresos*: Recordar que los ingresos a comunidades (Ojito del Salar) y miradores (Hornocal) son cánones locales que se abonan en efectivo en el lugar.",
    )
  }

  if (hasQuebrada || hasHumahuaca || hasPurmamarca) {
    recs.push(
      "🍴 *Gastronomía*: En Humahuaca y Purmamarca recomendamos probar las empanadas de carne cortada a cuchillo, los platos a base de quinoa y cordero, y las humitas en chala.",
    )
  }

  if (hasCafayate) {
    recs.push(
      "🍷 *Cafayate*: Recomendamos reservar bodegas con anticipación y considerar la altitud (1.660 msnm) en las degustaciones. Los vinos Torrontés y Malbec de altura son los más representativos.",
    )
  }

  return recs
}
