"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { ImageSquare, Spinner, X } from "@phosphor-icons/react"

import { createClient } from "@/lib/supabase/client"

interface FormImageUploaderProps {
  name: string
  value?: string | null
  folder?: string
  label?: string
}

const supabase = createClient()

export function FormImageUploader({
  name,
  value,
  folder = "general",
  label = "Imagen principal",
}: FormImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(value ?? null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError(null)
    setUploading(true)
    try {
      const res = await fetch("/api/dashboard/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          folder,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Error al subir imagen")
      const { error: uploadError } = await supabase.storage
        .from(json.bucket as string)
        .uploadToSignedUrl(json.path as string, json.token as string, file, {
          upsert: false,
        })

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      setPreview(json.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir imagen")
    } finally {
      setUploading(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700">{label}</label>

      <input type="hidden" name={name} value={preview ?? ""} />
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={handleChange}
      />

      {preview ? (
        <div className="relative h-52 w-full overflow-hidden border border-neutral-200 bg-neutral-50">
          <Image src={preview} alt="Preview" fill className="object-cover" sizes="600px" />
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="absolute right-2 top-2 rounded bg-black/50 p-1 text-white transition-colors hover:bg-black/70 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex h-52 w-full cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-neutral-300 bg-neutral-50 transition-colors hover:bg-neutral-100"
        >
          {uploading ? (
            <Spinner className="h-8 w-8 animate-spin text-neutral-400" />
          ) : (
            <>
              <ImageSquare className="h-10 w-10 text-neutral-300" />
              <p className="text-sm text-neutral-400">
                Hacé clic o arrastrá una imagen
              </p>
              <p className="text-xs text-neutral-400">JPG, PNG, WebP o AVIF · Máx. 10 MB</p>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
