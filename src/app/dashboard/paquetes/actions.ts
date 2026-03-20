"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect-error"

import { requireAdminSession } from "@/lib/dashboard/admin-auth"
import { adminClient } from "@/lib/supabase/admin-client"
import type { Moneda } from "@/types/shared/enums"

export interface ActionState {
  error?: string
  fieldErrors?: Record<string, string>
}

interface PackageDateDraft {
  id?: string
  fecha_inicio: string
  fecha_fin: string
  precio_por_persona: number
  moneda: Moneda
  cupo_total: number
  cupo_disponible: number
  activo: boolean
}

interface PackageItineraryDraft {
  id?: string
  dia_numero: number
  titulo: string
  descripcion: string
}

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function parseJsonField<TValue>(value: FormDataEntryValue | null, fallback: TValue): TValue {
  if (typeof value !== "string" || value.trim().length === 0) {
    return fallback
  }

  try {
    return JSON.parse(value) as TValue
  } catch {
    return fallback
  }
}

function parseBoolean(value: FormDataEntryValue | null) {
  return value === "true"
}

function parseNullableString(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null
}

function parseNullableNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null
  }

  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : null
}

function normalizePackageDates(rawDates: PackageDateDraft[]) {
  return rawDates
    .map((date) => ({
      id: typeof date.id === "string" && date.id.length > 0 ? date.id : undefined,
      fecha_inicio: String(date.fecha_inicio ?? "").trim(),
      fecha_fin: String(date.fecha_fin ?? "").trim(),
      precio_por_persona: Number(date.precio_por_persona ?? 0),
      moneda: (date.moneda ?? "ARS") as Moneda,
      cupo_total: Number(date.cupo_total ?? 0),
      cupo_disponible: Number(date.cupo_disponible ?? 0),
      activo: date.activo !== false,
    }))
    .filter((date) => date.fecha_inicio && date.fecha_fin)
}

function normalizePackageItinerary(rawItems: PackageItineraryDraft[]) {
  return rawItems
    .map((item) => ({
      id: typeof item.id === "string" && item.id.length > 0 ? item.id : undefined,
      dia_numero: Number(item.dia_numero ?? 0),
      titulo: String(item.titulo ?? "").trim(),
      descripcion: String(item.descripcion ?? "").trim(),
    }))
    .filter((item) => item.dia_numero > 0 && item.titulo && item.descripcion)
}

async function buildUniqueSlug(base: string, excludeId?: string): Promise<string> {
  const slug = slugify(base)
  let query = adminClient.from("paquetes").select("slug").like("slug", `${slug}%`)
  if (excludeId) query = query.neq("id", excludeId)
  const { data } = await query
  if (!data || data.length === 0) return slug
  const existing = new Set(data.map((row) => row.slug))
  if (!existing.has(slug)) return slug
  return `${slug}-${Date.now()}`
}

async function checkDestacadoLimit(excludeId?: string): Promise<boolean> {
  let query = adminClient
    .from("paquetes")
    .select("id", { count: "exact", head: true })
    .eq("destacado", true)
  if (excludeId) query = query.neq("id", excludeId)
  const { count } = await query
  return (count ?? 0) >= 3
}

async function syncPackageCategories(paqueteId: string, categoriaIds: string[]) {
  await adminClient.from("paquetes_categorias").delete().eq("paquete_id", paqueteId)

  if (categoriaIds.length === 0) {
    return
  }

  await adminClient.from("paquetes_categorias").insert(
    categoriaIds.map((categoriaId) => ({
      paquete_id: paqueteId,
      categoria_id: categoriaId,
    })),
  )
}

async function syncPackageGallery(paqueteId: string, gallery: string[]) {
  await adminClient.from("paquetes_imagenes").delete().eq("paquete_id", paqueteId)

  if (gallery.length === 0) {
    return
  }

  await adminClient.from("paquetes_imagenes").insert(
    gallery.map((url, index) => ({
      paquete_id: paqueteId,
      url,
      orden: index,
    })),
  )
}

async function syncPackageItinerary(
  paqueteId: string,
  itinerary: ReturnType<typeof normalizePackageItinerary>,
) {
  const { data: existingItems } = await adminClient
    .from("paquetes_itinerario")
    .select("id")
    .eq("paquete_id", paqueteId)

  const existingIds = new Set((existingItems ?? []).map((item) => item.id))
  const submittedIds = new Set(itinerary.map((item) => item.id).filter(Boolean))

  for (const item of itinerary) {
    if (item.id) {
      await adminClient
        .from("paquetes_itinerario")
        .update({
          dia_numero: item.dia_numero,
          titulo: item.titulo,
          descripcion: item.descripcion,
        })
        .eq("id", item.id)
        .eq("paquete_id", paqueteId)
      continue
    }

    await adminClient.from("paquetes_itinerario").insert({
      paquete_id: paqueteId,
      dia_numero: item.dia_numero,
      titulo: item.titulo,
      descripcion: item.descripcion,
    })
  }

  const idsToDelete = [...existingIds].filter((id) => !submittedIds.has(id))

  if (idsToDelete.length > 0) {
    await adminClient.from("paquetes_itinerario").delete().in("id", idsToDelete)
  }
}

async function syncPackageDates(
  paqueteId: string,
  dates: ReturnType<typeof normalizePackageDates>,
) {
  const { data: existingDates } = await adminClient
    .from("paquetes_fechas")
    .select("id")
    .eq("paquete_id", paqueteId)

  const existingIds = new Set((existingDates ?? []).map((date) => date.id))
  const submittedIds = new Set(dates.map((date) => date.id).filter(Boolean))
  const idsToDelete = [...existingIds].filter((id) => !submittedIds.has(id))

  if (idsToDelete.length > 0) {
    const { count } = await adminClient
      .from("reservas")
      .select("id", { count: "exact", head: true })
      .in("paquete_fecha_id", idsToDelete)

    if ((count ?? 0) > 0) {
      throw new Error(
        "No podés eliminar salidas que ya tienen reservas asociadas.",
      )
    }

    await adminClient.from("paquetes_fechas").delete().in("id", idsToDelete)
  }

  for (const date of dates) {
    const payload = {
      fecha_inicio: date.fecha_inicio,
      fecha_fin: date.fecha_fin,
      precio_por_persona: date.precio_por_persona,
      moneda: date.moneda,
      cupo_total: date.cupo_total,
      cupo_disponible: date.cupo_disponible,
      activo: date.activo,
    }

    if (date.id) {
      await adminClient
        .from("paquetes_fechas")
        .update(payload)
        .eq("id", date.id)
        .eq("paquete_id", paqueteId)
      continue
    }

    await adminClient.from("paquetes_fechas").insert({
      paquete_id: paqueteId,
      ...payload,
    })
  }
}

function validatePackageInput(input: {
  nombre: string | null
  descripcionCorta: string | null
  dates: ReturnType<typeof normalizePackageDates>
  itinerary: ReturnType<typeof normalizePackageItinerary>
}): ActionState | null {
  if (!input.nombre) {
    return { fieldErrors: { nombre: "El nombre es requerido" } }
  }

  if (input.descripcionCorta && input.descripcionCorta.length > 160) {
    return {
      fieldErrors: { descripcion_corta: "Máximo 160 caracteres" },
    }
  }

  const itineraryDays = input.itinerary.map((item) => item.dia_numero)
  if (new Set(itineraryDays).size !== itineraryDays.length) {
    return { error: "El itinerario no puede repetir días." }
  }

  for (const date of input.dates) {
    if (date.fecha_fin < date.fecha_inicio) {
      return { error: "Cada salida debe tener una fecha fin posterior o igual a la inicial." }
    }

    if (date.precio_por_persona < 0) {
      return { error: "El precio por persona no puede ser negativo." }
    }

    if (date.cupo_total < 1) {
      return { error: "Cada salida debe tener al menos 1 lugar disponible." }
    }

    if (date.cupo_disponible < 0 || date.cupo_disponible > date.cupo_total) {
      return { error: "El cupo disponible debe estar entre 0 y el cupo total." }
    }
  }

  return null
}

function buildPackagePayload(formData: FormData) {
  const nombre = parseNullableString(formData.get("nombre"))
  const descripcion_corta = parseNullableString(formData.get("descripcion_corta"))
  const descripcion = parseNullableString(formData.get("descripcion"))
  const activo = parseBoolean(formData.get("activo"))
  const destacado = parseBoolean(formData.get("destacado"))
  const imagen_url = parseNullableString(formData.get("imagen_url"))
  const duracion_dias = Math.max(1, Number(formData.get("duracion_dias") ?? 1))
  const precio_desde = Math.max(0, Number(formData.get("precio_desde") ?? 0))
  const moneda = (parseNullableString(formData.get("moneda")) ?? "ARS") as Moneda
  const destino_id = parseNullableString(formData.get("destino_id"))
  const orden = parseNullableNumber(formData.get("orden"))
  const gallery = parseJsonField<string[]>(formData.get("gallery"), []).filter(Boolean)
  const categoriaIds = [
    ...new Set(
      parseJsonField<string[]>(formData.get("categoria_ids"), []).filter(Boolean),
    ),
  ]
  const dates = normalizePackageDates(
    parseJsonField<PackageDateDraft[]>(formData.get("dates"), []),
  )
  const itinerary = normalizePackageItinerary(
    parseJsonField<PackageItineraryDraft[]>(formData.get("itinerary"), []),
  )

  return {
    nombre,
    descripcion_corta,
    descripcion,
    activo,
    destacado,
    imagen_url,
    duracion_dias,
    precio_desde,
    moneda,
    destino_id,
    orden,
    incluye_alojamiento: parseBoolean(formData.get("incluye_alojamiento")),
    incluye_traslado: parseBoolean(formData.get("incluye_traslado")),
    incluye_comidas: parseBoolean(formData.get("incluye_comidas")),
    incluye_guia: parseBoolean(formData.get("incluye_guia")),
    incluye_entradas: parseBoolean(formData.get("incluye_entradas")),
    gallery,
    categoriaIds,
    dates,
    itinerary,
  }
}

export async function createPaquete(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireAdminSession()
    const input = buildPackagePayload(formData)
    const validation = validatePackageInput({
      nombre: input.nombre,
      descripcionCorta: input.descripcion_corta,
      dates: input.dates,
      itinerary: input.itinerary,
    })

    if (validation) {
      return validation
    }

    if (input.destacado && (await checkDestacadoLimit())) {
      return {
        error: "Ya hay 3 paquetes destacados. Quitá uno para poder destacar este.",
      }
    }

    const slug = await buildUniqueSlug(input.nombre!)
    const { data: paquete, error } = await adminClient
      .from("paquetes")
      .insert({
        nombre: input.nombre,
        slug,
        descripcion_corta: input.descripcion_corta,
        descripcion: input.descripcion,
        activo: input.activo,
        destacado: input.destacado,
        imagen_url: input.imagen_url,
        duracion_dias: input.duracion_dias,
        precio_desde: input.precio_desde,
        moneda: input.moneda,
        destino_id: input.destino_id,
        orden: input.orden,
        incluye_alojamiento: input.incluye_alojamiento,
        incluye_traslado: input.incluye_traslado,
        incluye_comidas: input.incluye_comidas,
        incluye_guia: input.incluye_guia,
        incluye_entradas: input.incluye_entradas,
      })
      .select("id")
      .single()

    if (error || !paquete) {
      return { error: error?.message ?? "Error al crear el paquete" }
    }

    await Promise.all([
      syncPackageGallery(paquete.id, input.gallery),
      syncPackageCategories(paquete.id, input.categoriaIds),
      syncPackageDates(paquete.id, input.dates),
      syncPackageItinerary(paquete.id, input.itinerary),
    ])

    revalidatePath("/dashboard/paquetes")
    redirect("/dashboard/paquetes")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return {
      error: error instanceof Error ? error.message : "Error al crear el paquete",
    }
  }
}

export async function updatePaquete(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireAdminSession()
    const input = buildPackagePayload(formData)
    const validation = validatePackageInput({
      nombre: input.nombre,
      descripcionCorta: input.descripcion_corta,
      dates: input.dates,
      itinerary: input.itinerary,
    })

    if (validation) {
      return validation
    }

    if (input.destacado) {
      const { data: current } = await adminClient
        .from("paquetes")
        .select("destacado")
        .eq("id", id)
        .single()

      if (!current?.destacado && (await checkDestacadoLimit(id))) {
        return {
          error: "Ya hay 3 paquetes destacados. Quitá uno para poder destacar este.",
        }
      }
    }

    const { error } = await adminClient
      .from("paquetes")
      .update({
        nombre: input.nombre,
        descripcion_corta: input.descripcion_corta,
        descripcion: input.descripcion,
        activo: input.activo,
        destacado: input.destacado,
        imagen_url: input.imagen_url,
        duracion_dias: input.duracion_dias,
        precio_desde: input.precio_desde,
        moneda: input.moneda,
        destino_id: input.destino_id,
        orden: input.orden,
        incluye_alojamiento: input.incluye_alojamiento,
        incluye_traslado: input.incluye_traslado,
        incluye_comidas: input.incluye_comidas,
        incluye_guia: input.incluye_guia,
        incluye_entradas: input.incluye_entradas,
      })
      .eq("id", id)

    if (error) {
      return { error: error.message }
    }

    await Promise.all([
      syncPackageGallery(id, input.gallery),
      syncPackageCategories(id, input.categoriaIds),
      syncPackageDates(id, input.dates),
      syncPackageItinerary(id, input.itinerary),
    ])

    revalidatePath("/dashboard/paquetes")
    revalidatePath(`/dashboard/paquetes/${id}/editar`)
    return {}
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Error al actualizar el paquete",
    }
  }
}

export async function deletePaquete(id: string): Promise<void> {
  await requireAdminSession()

  const { data: packageDates } = await adminClient
    .from("paquetes_fechas")
    .select("id")
    .eq("paquete_id", id)

  const dateIds = (packageDates ?? []).map((date) => date.id)

  if (dateIds.length > 0) {
    const { count } = await adminClient
      .from("reservas")
      .select("id", { count: "exact", head: true })
      .in("paquete_fecha_id", dateIds)

    if ((count ?? 0) > 0) {
      throw new Error(
        "No podés eliminar un paquete que ya tiene reservas asociadas.",
      )
    }
  }

  await adminClient.from("paquetes_imagenes").delete().eq("paquete_id", id)
  await adminClient.from("paquetes_categorias").delete().eq("paquete_id", id)
  await adminClient.from("paquetes_itinerario").delete().eq("paquete_id", id)
  await adminClient.from("paquetes_fechas").delete().eq("paquete_id", id)
  await adminClient.from("paquetes").delete().eq("id", id)
  revalidatePath("/dashboard/paquetes")
  redirect("/dashboard/paquetes")
}
