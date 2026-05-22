export interface ExperienceImagesRow {
  id: string
  experiencia_id: string
  url: string
  alt_text: string | null
  orden: number | null
  created_at: string | null
}

export interface ExperienceImagesInsert {
  id?: string
  experiencia_id: string
  url: string
  alt_text?: string | null
  orden?: number | null
  created_at?: string | null
}

export interface ExperienceImagesUpdate {
  id?: string
  experiencia_id?: string
  url?: string
  alt_text?: string | null
  orden?: number | null
  created_at?: string | null
}
