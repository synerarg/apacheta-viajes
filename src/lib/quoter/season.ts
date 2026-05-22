// Replica la lógica del cotizador HTML actual:
//   if (y === 2025 && m >= 10) return "Oct25-Mar26"
//   if (y === 2026 && m <= 3)  return "Ene-Mar26"
//   if (y === 2026 && m 4..6)  return "Abr-Jun26"
//   if (y === 2026 && m 7..9)  return "Jul-Sep26"
//   if (y === 2026 && m >= 10) return "Oct-Dic26"
//   fallback                   "Ene-Mar26"
//
// Si recibimos `availableSeasons` (las temporadas que efectivamente tiene un servicio)
// y la temporada detectada no está, intentamos un fallback razonable.

export type Temporada =
  | "Oct25-Mar26"
  | "Dic25"
  | "Ene-Mar26"
  | "Abr-Jun26"
  | "Jul-Sep26"
  | "Oct-Dic26"
  | "2025-2026"

export function detectSeason(date: Date, availableSeasons?: string[]): string {
  const y = date.getFullYear()
  const m = date.getMonth() + 1

  let detected: string
  if (y === 2025 && m >= 10) detected = "Oct25-Mar26"
  else if (y === 2026 && m <= 3) detected = "Ene-Mar26"
  else if (y === 2026 && m >= 4 && m <= 6) detected = "Abr-Jun26"
  else if (y === 2026 && m >= 7 && m <= 9) detected = "Jul-Sep26"
  else if (y === 2026 && m >= 10) detected = "Oct-Dic26"
  else detected = "Ene-Mar26"

  if (!availableSeasons || availableSeasons.length === 0) {
    return detected
  }

  // Si la temporada detectada existe, listo.
  if (availableSeasons.includes(detected)) return detected

  // Para meses 1-3 priorizar Ene-Mar26 si está disponible
  if (m <= 3 && availableSeasons.includes("Ene-Mar26")) return "Ene-Mar26"

  // Si el servicio tiene "Oct25-Mar26" (servicios que abarcan varias temporadas) y estamos en m<=3, usarlo
  if (m <= 3 && availableSeasons.includes("Oct25-Mar26")) return "Oct25-Mar26"

  // Servicios con temporada anual única (Tren Solar)
  if (availableSeasons.includes("2025-2026")) return "2025-2026"

  // Diciembre 2025 puede mapearse a "Dic25"
  if (y === 2025 && m === 12 && availableSeasons.includes("Dic25")) return "Dic25"

  // Sin coincidencia: devolver la primera temporada disponible como fallback
  return availableSeasons[0] ?? detected
}
