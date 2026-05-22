export interface TransferImagesRow {
  id: string
  traslado_id: string
  url: string
  orden: number | null
  created_at: string | null
}

export interface TransferImagesInsert {
  id?: string
  traslado_id: string
  url: string
  orden?: number | null
  created_at?: string | null
}

export interface TransferImagesUpdate {
  id?: string
  traslado_id?: string
  url?: string
  orden?: number | null
  created_at?: string | null
}
