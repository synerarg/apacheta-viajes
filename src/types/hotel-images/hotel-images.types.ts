export interface HotelesImagenesRow {
  id: string
  hotel_id: string
  url: string
  alt_text: string | null
  orden: number | null
  created_at: string | null
}

export interface HotelesImagenesInsert {
  id?: string
  hotel_id: string
  url: string
  alt_text?: string | null
  orden?: number | null
  created_at?: string | null
}

export interface HotelesImagenesUpdate {
  id?: string
  hotel_id?: string
  url?: string
  alt_text?: string | null
  orden?: number | null
  created_at?: string | null
}
