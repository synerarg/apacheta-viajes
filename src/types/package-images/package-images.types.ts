export interface PackageImagesRow {
  id: string
  paquete_id: string
  url: string
  alt_text: string | null
  orden: number | null
  created_at: string | null
}

export interface PackageImagesInsert {
  id?: string
  paquete_id: string
  url: string
  alt_text?: string | null
  orden?: number | null
  created_at?: string | null
}

export interface PackageImagesUpdate {
  id?: string
  paquete_id?: string
  url?: string
  alt_text?: string | null
  orden?: number | null
  created_at?: string | null
}
