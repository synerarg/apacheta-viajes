export interface OutboundImagesRow {
  id: string
  emisivo_destino_id: string
  url: string
  alt_text: string | null
  orden: number | null
  created_at: string | null
}

export interface OutboundImagesInsert {
  id?: string
  emisivo_destino_id: string
  url: string
  alt_text?: string | null
  orden?: number | null
  created_at?: string | null
}

export interface OutboundImagesUpdate {
  id?: string
  emisivo_destino_id?: string
  url?: string
  alt_text?: string | null
  orden?: number | null
  created_at?: string | null
}
