"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect-error"

import { requireAdminSession } from "@/lib/dashboard/admin-auth"
import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error"
import { adminClient } from "@/lib/supabase/admin-client"
import type { Moneda } from "@/types/shared/enums"
import type {
  TrasladoModalidad,
  TrasladoTipoServicio,
  TrasladoVehiculoTipo,
} from "@/types/traslados/traslados.types"

export interface ActionState {
  error?: string
  fieldErrors?: Record<string, string>
}

const TIPO_SERVICIO_VALUES: TrasladoTipoServicio[] = ["regular", "privado"]
const MODALIDAD_VALUES: TrasladoModalidad[] = [
  "ida",
  "ida_vuelta",
  "punto_a_punto",
]
const VEHICULO_VALUES: TrasladoVehiculoTipo[] = [
  "auto",
  "combi",
  "minibus",
  "camioneta_4x4",
  "bus",
]

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

function parseNullableString(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null
}

function parseNullableNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null
  }

  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : null
}

function parseBoolean(value: FormDataEntryValue | null) {
  return value === "true"
}

function parseJsonField<TValue>(
  value: FormDataEntryValue | null,
  fallback: TValue,
): TValue {
  if (typeof value !== "string" || value.trim().length === 0) {
    return fallback
  }

  try {
    return JSON.parse(value) as TValue
  } catch {
    return fallback
  }
}

function parseTipoServicio(
  value: FormDataEntryValue | null,
): TrasladoTipoServicio {
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (TIPO_SERVICIO_VALUES.includes(trimmed as TrasladoTipoServicio)) {
      return trimmed as TrasladoTipoServicio
    }
  }
  return "regular"
}

function parseModalidad(value: FormDataEntryValue | null): TrasladoModalidad {
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (MODALIDAD_VALUES.includes(trimmed as TrasladoModalidad)) {
      return trimmed as TrasladoModalidad
    }
  }
  return "ida"
}

function parseVehiculoTipo(
  value: FormDataEntryValue | null,
): TrasladoVehiculoTipo | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (trimmed.length === 0) return null
  return VEHICULO_VALUES.includes(trimmed as TrasladoVehiculoTipo)
    ? (trimmed as TrasladoVehiculoTipo)
    : null
}

async function buildUniqueSlug(
  base: string,
  excludeId?: string,
): Promise<string> {
  const slug = slugify(base)
  let query = adminClient
    .from("traslados")
    .select("slug")
    .like("slug", `${slug}%`)
  if (excludeId) query = query.neq("id", excludeId)
  const { data } = await query
  if (!data || data.length === 0) return slug
  const existing = new Set(data.map((row) => row.slug))
  if (!existing.has(slug)) return slug
  return `${slug}-${Date.now()}`
}

async function syncGallery(trasladoId: string, gallery: string[]) {
  await adminClient
    .from("traslados_imagenes")
    .delete()
    .eq("traslado_id", trasladoId)

  if (gallery.length === 0) {
    return
  }

  await adminClient.from("traslados_imagenes").insert(
    gallery.map((url, index) => ({
      traslado_id: trasladoId,
      url,
      orden: index,
    })),
  )
}

function buildTrasladoPayload(formData: FormData) {
  return {
    nombre: parseNullableString(formData.get("nombre")),
    descripcion: parseNullableString(formData.get("descripcion")),
    descripcion_corta: parseNullableString(formData.get("descripcion_corta")),
    origen: parseNullableString(formData.get("origen")),
    destino: parseNullableString(formData.get("destino")),
    tipo_servicio: parseTipoServicio(formData.get("tipo_servicio")),
    modalidad: parseModalidad(formData.get("modalidad")),
    vehiculo_tipo: parseVehiculoTipo(formData.get("vehiculo_tipo")),
    capacidad_max: parseNullableNumber(formData.get("capacidad_max")),
    base_minima_pax:
      parseNullableNumber(formData.get("base_minima_pax")) ?? 1,
    precio_desde: parseNullableNumber(formData.get("precio_desde")) ?? 0,
    moneda: (parseNullableString(formData.get("moneda")) ?? "ARS") as Moneda,
    duracion_minutos: parseNullableNumber(formData.get("duracion_minutos")),
    incluye_equipaje: parseBoolean(formData.get("incluye_equipaje")),
    incluye_iva: parseBoolean(formData.get("incluye_iva")),
    impuestos_adicionales_pct: parseNullableNumber(
      formData.get("impuestos_adicionales_pct"),
    ),
    imagen_url: parseNullableString(formData.get("imagen_url")),
    destino_id: parseNullableString(formData.get("destino_id")),
    activo: parseBoolean(formData.get("activo")),
    destacado: parseBoolean(formData.get("destacado")),
    orden: parseNullableNumber(formData.get("orden")),
    gallery: parseJsonField<string[]>(formData.get("gallery"), []).filter(
      Boolean,
    ),
  }
}

export async function createTraslado(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireAdminSession()
    const input = buildTrasladoPayload(formData)

    const fieldErrors: Record<string, string> = {}
    if (!input.nombre) fieldErrors.nombre = "El nombre es requerido"
    if (!input.origen) fieldErrors.origen = "El origen es requerido"
    if (!input.destino) fieldErrors.destino = "El destino es requerido"
    if (input.descripcion_corta && input.descripcion_corta.length > 160) {
      fieldErrors.descripcion_corta = "Máximo 160 caracteres"
    }
    if (Object.keys(fieldErrors).length > 0) {
      return { fieldErrors }
    }

    const slug = await buildUniqueSlug(input.nombre as string)

    const { data: traslado, error } = await adminClient
      .from("traslados")
      .insert({
        nombre: input.nombre as string,
        slug,
        descripcion: input.descripcion,
        descripcion_corta: input.descripcion_corta,
        origen: input.origen as string,
        destino: input.destino as string,
        tipo_servicio: input.tipo_servicio,
        modalidad: input.modalidad,
        vehiculo_tipo: input.vehiculo_tipo,
        capacidad_max: input.capacidad_max,
        base_minima_pax: input.base_minima_pax,
        precio_desde: input.precio_desde,
        moneda: input.moneda,
        duracion_minutos: input.duracion_minutos,
        incluye_equipaje: input.incluye_equipaje,
        incluye_iva: input.incluye_iva,
        impuestos_adicionales_pct: input.impuestos_adicionales_pct,
        imagen_url: input.imagen_url,
        destino_id: input.destino_id,
        activo: input.activo,
        destacado: input.destacado,
        orden: input.orden,
      })
      .select("id")
      .single()

    if (error || !traslado) {
      return {
        error: getUserFacingErrorMessage(error, "Error al crear el traslado."),
      }
    }

    await syncGallery(traslado.id, input.gallery)

    revalidatePath("/dashboard/traslados")
    revalidatePath("/traslados")
    redirect("/dashboard/traslados")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return {
      error: getUserFacingErrorMessage(error, "Error al crear el traslado."),
    }
  }
}

export async function updateTraslado(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireAdminSession()
    const input = buildTrasladoPayload(formData)

    const fieldErrors: Record<string, string> = {}
    if (!input.nombre) fieldErrors.nombre = "El nombre es requerido"
    if (!input.origen) fieldErrors.origen = "El origen es requerido"
    if (!input.destino) fieldErrors.destino = "El destino es requerido"
    if (input.descripcion_corta && input.descripcion_corta.length > 160) {
      fieldErrors.descripcion_corta = "Máximo 160 caracteres"
    }
    if (Object.keys(fieldErrors).length > 0) {
      return { fieldErrors }
    }

    const { error } = await adminClient
      .from("traslados")
      .update({
        nombre: input.nombre as string,
        descripcion: input.descripcion,
        descripcion_corta: input.descripcion_corta,
        origen: input.origen as string,
        destino: input.destino as string,
        tipo_servicio: input.tipo_servicio,
        modalidad: input.modalidad,
        vehiculo_tipo: input.vehiculo_tipo,
        capacidad_max: input.capacidad_max,
        base_minima_pax: input.base_minima_pax,
        precio_desde: input.precio_desde,
        moneda: input.moneda,
        duracion_minutos: input.duracion_minutos,
        incluye_equipaje: input.incluye_equipaje,
        incluye_iva: input.incluye_iva,
        impuestos_adicionales_pct: input.impuestos_adicionales_pct,
        imagen_url: input.imagen_url,
        destino_id: input.destino_id,
        activo: input.activo,
        destacado: input.destacado,
        orden: input.orden,
      })
      .eq("id", id)

    if (error) {
      return {
        error: getUserFacingErrorMessage(
          error,
          "Error al actualizar el traslado.",
        ),
      }
    }

    await syncGallery(id, input.gallery)

    revalidatePath("/dashboard/traslados")
    revalidatePath(`/dashboard/traslados/${id}/editar`)
    revalidatePath("/traslados")
    return {}
  } catch (error) {
    return {
      error: getUserFacingErrorMessage(
        error,
        "Error al actualizar el traslado.",
      ),
    }
  }
}

export async function deleteTraslado(id: string): Promise<void> {
  await requireAdminSession()

  await adminClient
    .from("traslados_imagenes")
    .delete()
    .eq("traslado_id", id)
  await adminClient
    .from("traslados_tarifas")
    .delete()
    .eq("traslado_id", id)
  await adminClient.from("traslados").delete().eq("id", id)

  revalidatePath("/dashboard/traslados")
  revalidatePath(`/dashboard/traslados/${id}/editar`)
  revalidatePath("/traslados")
}
