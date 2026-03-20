"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect-error"

import type { ActionState } from "@/app/dashboard/paquetes/actions"
import { requireAdminSession } from "@/lib/dashboard/admin-auth"
import { adminClient } from "@/lib/supabase/admin-client"
import type { Moneda } from "@/types/shared/enums"

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
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null
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

async function buildUniqueSlug(base: string, excludeId?: string): Promise<string> {
  const slug = slugify(base)
  let query = adminClient
    .from("experiencias")
    .select("slug")
    .like("slug", `${slug}%`)
  if (excludeId) query = query.neq("id", excludeId)
  const { data } = await query
  if (!data || data.length === 0) return slug
  const existing = new Set(data.map((row) => row.slug))
  if (!existing.has(slug)) return slug
  return `${slug}-${Date.now()}`
}

async function checkDestacadoLimit(excludeId?: string): Promise<boolean> {
  let query = adminClient
    .from("experiencias")
    .select("id", { count: "exact", head: true })
    .eq("destacado", true)
  if (excludeId) query = query.neq("id", excludeId)
  const { count } = await query
  return (count ?? 0) >= 3
}

async function syncExperienceGallery(experienciaId: string, gallery: string[]) {
  await adminClient
    .from("experiencias_imagenes")
    .delete()
    .eq("experiencia_id", experienciaId)

  if (gallery.length === 0) {
    return
  }

  await adminClient.from("experiencias_imagenes").insert(
    gallery.map((url, index) => ({
      experiencia_id: experienciaId,
      url,
      orden: index,
    })),
  )
}

function buildExperiencePayload(formData: FormData) {
  return {
    nombre: parseNullableString(formData.get("nombre")),
    descripcion: parseNullableString(formData.get("descripcion")),
    descripcion_corta: parseNullableString(formData.get("descripcion_corta")),
    activo: parseBoolean(formData.get("activo")),
    destacado: parseBoolean(formData.get("destacado")),
    imagen_url: parseNullableString(formData.get("imagen_url")),
    ubicacion: parseNullableString(formData.get("ubicacion")),
    categoria_id: parseNullableString(formData.get("categoria_id")),
    destino_id: parseNullableString(formData.get("destino_id")),
    duracion_horas: parseNullableNumber(formData.get("duracion_horas")),
    precio: parseNullableNumber(formData.get("precio")),
    moneda: (parseNullableString(formData.get("moneda")) ?? "ARS") as Moneda,
    latitud: parseNullableNumber(formData.get("latitud")),
    longitud: parseNullableNumber(formData.get("longitud")),
    orden: parseNullableNumber(formData.get("orden")),
    gallery: parseJsonField<string[]>(formData.get("gallery"), []).filter(Boolean),
  }
}

export async function createExperiencia(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireAdminSession()
    const input = buildExperiencePayload(formData)

    if (!input.nombre) {
      return { fieldErrors: { nombre: "El nombre es requerido" } }
    }

    if (input.descripcion_corta && input.descripcion_corta.length > 160) {
      return {
        fieldErrors: { descripcion_corta: "Máximo 160 caracteres" },
      }
    }

    if (input.destacado && (await checkDestacadoLimit())) {
      return {
        error: "Ya hay 3 experiencias destacadas. Quitá una para poder destacar esta.",
      }
    }

    const slug = await buildUniqueSlug(input.nombre)
    const { data: experiencia, error } = await adminClient
      .from("experiencias")
      .insert({
        nombre: input.nombre,
        slug,
        descripcion: input.descripcion,
        descripcion_corta: input.descripcion_corta,
        activo: input.activo,
        destacado: input.destacado,
        imagen_url: input.imagen_url,
        ubicacion: input.ubicacion,
        categoria_id: input.categoria_id,
        destino_id: input.destino_id,
        duracion_horas: input.duracion_horas,
        precio: input.precio,
        moneda: input.moneda,
        latitud: input.latitud,
        longitud: input.longitud,
        orden: input.orden,
      })
      .select("id")
      .single()

    if (error || !experiencia) {
      return { error: error?.message ?? "Error al crear la experiencia" }
    }

    await syncExperienceGallery(experiencia.id, input.gallery)

    revalidatePath("/dashboard/experiencias")
    redirect("/dashboard/experiencias")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return {
      error:
        error instanceof Error ? error.message : "Error al crear la experiencia",
    }
  }
}

export async function updateExperiencia(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireAdminSession()
    const input = buildExperiencePayload(formData)

    if (!input.nombre) {
      return { fieldErrors: { nombre: "El nombre es requerido" } }
    }

    if (input.descripcion_corta && input.descripcion_corta.length > 160) {
      return {
        fieldErrors: { descripcion_corta: "Máximo 160 caracteres" },
      }
    }

    if (input.destacado) {
      const { data: current } = await adminClient
        .from("experiencias")
        .select("destacado")
        .eq("id", id)
        .single()

      if (!current?.destacado && (await checkDestacadoLimit(id))) {
        return {
          error: "Ya hay 3 experiencias destacadas. Quitá una para poder destacar esta.",
        }
      }
    }

    const { error } = await adminClient
      .from("experiencias")
      .update({
        nombre: input.nombre,
        descripcion: input.descripcion,
        descripcion_corta: input.descripcion_corta,
        activo: input.activo,
        destacado: input.destacado,
        imagen_url: input.imagen_url,
        ubicacion: input.ubicacion,
        categoria_id: input.categoria_id,
        destino_id: input.destino_id,
        duracion_horas: input.duracion_horas,
        precio: input.precio,
        moneda: input.moneda,
        latitud: input.latitud,
        longitud: input.longitud,
        orden: input.orden,
      })
      .eq("id", id)

    if (error) {
      return { error: error.message }
    }

    await syncExperienceGallery(id, input.gallery)

    revalidatePath("/dashboard/experiencias")
    revalidatePath(`/dashboard/experiencias/${id}/editar`)
    return {}
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Error al actualizar la experiencia",
    }
  }
}

export async function deleteExperiencia(id: string): Promise<void> {
  await requireAdminSession()

  const { count } = await adminClient
    .from("reservas")
    .select("id", { count: "exact", head: true })
    .eq("experiencia_id", id)

  if ((count ?? 0) > 0) {
    throw new Error(
      "No podés eliminar una experiencia que ya tiene reservas asociadas.",
    )
  }

  await adminClient.from("experiencias_imagenes").delete().eq("experiencia_id", id)
  await adminClient.from("experiencias").delete().eq("id", id)
  revalidatePath("/dashboard/experiencias")
  redirect("/dashboard/experiencias")
}
