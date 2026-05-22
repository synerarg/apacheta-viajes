export interface EmisivoImagenesRow {
  id: string
  emisivo_destino_id: string
  url: string
  alt_text: string | null
  orden: number | null
  created_at: string | null
}

export interface EmisivoImagenesInsert {
  id?: string
  emisivo_destino_id: string
  url: string
  alt_text?: string | null
  orden?: number | null
  created_at?: string | null
}

export interface EmisivoImagenesUpdate {
  id?: string
  emisivo_destino_id?: string
  url?: string
  alt_text?: string | null
  orden?: number | null
  created_at?: string | null
}
