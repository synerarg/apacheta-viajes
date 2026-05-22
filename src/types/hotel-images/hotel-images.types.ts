export interface HotelImagesRow {
  id: string
  hotel_id: string
  url: string
  alt_text: string | null
  orden: number | null
  created_at: string | null
}

export interface HotelImagesInsert {
  id?: string
  hotel_id: string
  url: string
  alt_text?: string | null
  orden?: number | null
  created_at?: string | null
}

export interface HotelImagesUpdate {
  id?: string
  hotel_id?: string
  url?: string
  alt_text?: string | null
  orden?: number | null
  created_at?: string | null
}
