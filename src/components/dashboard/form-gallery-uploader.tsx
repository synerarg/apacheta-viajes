"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { Plus, Spinner, Trash } from "@phosphor-icons/react"

import { createClient } from "@/lib/supabase/client"

const MAX_IMAGES = 15
const supabase = createClient()

interface FormGalleryUploaderProps {
  name: string
  initialUrls?: string[]
  folder?: string
}

export function FormGalleryUploader({
  name,
  initialUrls = [],
  folder = "gallery",
}: FormGalleryUploaderProps) {
  const [urls, setUrls] = useState<string[]>(initialUrls)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File): Promise<string> {
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
    const { error } = await supabase.storage
      .from(json.bucket as string)
      .uploadToSignedUrl(json.path as string, json.token as string, file, {
        upsert: false,
      })

    if (error) {
      throw new Error(error.message)
    }

    return json.url as string
  }

  async function handleFiles(files: FileList) {
    const remaining = MAX_IMAGES - urls.length
    if (remaining <= 0) return
    const toUpload = Array.from(files).slice(0, remaining)
    setError(null)
    setUploading(true)
    try {
      const uploaded = await Promise.all(toUpload.map(uploadFile))
      setUrls((prev) => [...prev, ...uploaded])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir imagen")
    } finally {
      setUploading(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) handleFiles(e.target.files)
    e.target.value = ""
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files)
  }

  function removeUrl(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="border border-primary bg-white p-6">
      {/* Section header with count */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black text-neutral-900">Galería de Imágenes</h2>
        <span className="text-xs text-neutral-400">
          {urls.length}/{MAX_IMAGES} Imágenes
        </span>
      </div>

      <input type="hidden" name={name} value={JSON.stringify(urls)} />
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={handleChange}
      />

      <div className="flex flex-wrap gap-3">
        {urls.map((url, i) => (
          <div
            key={url + i}
            className="group relative h-20 w-20 overflow-hidden border border-neutral-200 bg-neutral-50"
          >
            <Image src={url} alt={`Imagen ${i + 1}`} fill className="object-cover" sizes="80px" />
            <button
              type="button"
              onClick={() => removeUrl(i)}
              className="absolute inset-0 flex items-center justify-center bg-black/0 text-transparent transition-all group-hover:bg-black/40 group-hover:text-white cursor-pointer"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        ))}

        {urls.length < MAX_IMAGES && (
          <div
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="flex h-20 w-20 cursor-pointer items-center justify-center border border-dashed border-neutral-300 bg-neutral-50 transition-colors hover:bg-neutral-100"
          >
            {uploading ? (
              <Spinner className="h-5 w-5 animate-spin text-neutral-400" />
            ) : (
              <Plus className="h-5 w-5 text-neutral-400" />
            )}
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  )
}
