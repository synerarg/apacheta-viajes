// Helpers de fecha en formato YYYY-MM-DD.
// Todas las operaciones se hacen en aritmética local para evitar el corrimiento
// que produce toISOString() en zonas con offset.

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function isValidIsoDate(value: string | null | undefined): value is string {
  if (typeof value !== "string" || !ISO_DATE_RE.test(value)) return false
  const [y, m, d] = value.split("-").map(Number)
  if (!y || !m || !d) return false
  const date = new Date(y, m - 1, d)
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  )
}

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

export function formatLocalDate(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

export function parseIsoDate(value: string): Date | null {
  if (!isValidIsoDate(value)) return null
  const [y, m, d] = value.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function addDaysIso(value: string, days: number): string | null {
  const date = parseIsoDate(value)
  if (!date) return null
  date.setDate(date.getDate() + days)
  return formatLocalDate(date)
}

export function daysBetweenInclusive(
  start: string | null | undefined,
  end: string | null | undefined,
): number {
  if (!start || !end) return 0
  const s = parseIsoDate(start)
  const e = parseIsoDate(end)
  if (!s || !e) return 0
  if (e < s) return 0
  const ms = e.getTime() - s.getTime()
  return Math.round(ms / 86_400_000) + 1
}

export function isoRange(
  start: string | null | undefined,
  end: string | null | undefined,
): string[] {
  if (!start || !end) return []
  const s = parseIsoDate(start)
  const e = parseIsoDate(end)
  if (!s || !e || e < s) return []
  const out: string[] = []
  const cur = new Date(s)
  while (cur <= e) {
    out.push(formatLocalDate(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return out
}

export function todayIso(): string {
  return formatLocalDate(new Date())
}

export function isBeforeIso(a: string, b: string): boolean {
  return a < b
}
