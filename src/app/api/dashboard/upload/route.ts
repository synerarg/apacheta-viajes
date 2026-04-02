import { NextResponse } from "next/server"

import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error"
import { adminClient } from "@/lib/supabase/admin-client"
import { requireAdminSession } from "@/lib/dashboard/admin-auth"

const BUCKET = process.env.CMS_IMAGES_BUCKET ?? "media"
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"]
const FOLDER_PATTERN = /^[a-zA-Z0-9/_-]+$/

async function assertCmsBucketConfigured() {
  const { data, error } = await adminClient.storage.listBuckets()

  if (error) {
    throw new Error("No se pudo verificar el bucket de imágenes del dashboard.")
  }

  const bucket = data.find((item) => item.name === BUCKET || item.id === BUCKET)

  if (!bucket) {
    throw new Error(
      `No existe el bucket "${BUCKET}". Crealo en Supabase Storage o definí CMS_IMAGES_BUCKET correctamente.`,
    )
  }

  if (!bucket.public) {
    throw new Error(
      `El bucket "${BUCKET}" debe ser público para poder previsualizar imágenes del CMS.`,
    )
  }
}

function sanitizeFolder(folder: string) {
  const normalized = folder.trim().replace(/^\/+|\/+$/g, "")

  if (!normalized || !FOLDER_PATTERN.test(normalized)) {
    throw new Error("Carpeta inválida")
  }

  return normalized
}

function sanitizeFileName(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase()

  return extension && extension.length <= 6 && /^[a-z0-9]+$/.test(extension)
    ? extension
    : "bin"
}

export async function POST(request: Request) {
  try {
    await requireAdminSession()
    await assertCmsBucketConfigured()

    const body = (await request.json()) as {
      fileName?: string
      fileType?: string
      fileSize?: number
      folder?: string
    }
    const fileName = body.fileName?.trim()
    const fileType = body.fileType?.trim()
    const fileSize = Number(body.fileSize ?? 0)
    const folder = sanitizeFolder(body.folder ?? "general")

    if (!fileName || !fileType || !Number.isFinite(fileSize) || fileSize <= 0) {
      return NextResponse.json(
        { error: "Metadata de archivo inválida" },
        { status: 400 },
      )
    }

    if (fileSize > MAX_SIZE) {
      return NextResponse.json(
        { error: "El archivo supera 10 MB" },
        { status: 400 },
      )
    }

    if (!ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Usá JPG, PNG, WebP o AVIF." },
        { status: 400 },
      )
    }

    const extension = sanitizeFileName(fileName)
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`
    const { data, error } = await adminClient.storage
      .from(BUCKET)
      .createSignedUploadUrl(path)

    if (error || !data) {
      return NextResponse.json(
        {
          error: getUserFacingErrorMessage(
            error,
            "No se pudo preparar la subida de la imagen.",
          ),
        },
        { status: 500 },
      )
    }

    const {
      data: { publicUrl },
    } = adminClient.storage.from(BUCKET).getPublicUrl(path)

    return NextResponse.json({
      bucket: BUCKET,
      path,
      token: data.token,
      url: publicUrl,
    })
  } catch (error) {
    const message = getUserFacingErrorMessage(
      error,
      "No se pudo autorizar la subida.",
    )
    const status =
      message === "No autenticado" ? 401 : message === "No autorizado" ? 403 : 400

    return NextResponse.json({ error: message }, { status })
  }
}
