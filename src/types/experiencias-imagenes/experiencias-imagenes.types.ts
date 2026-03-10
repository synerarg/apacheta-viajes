export interface ExperienciasImagenesRow {
  id: string
  experiencia_id: string
  url: string
  alt_text: string | null
  orden: number | null
  created_at: string | null
}

export interface ExperienciasImagenesInsert {
  id?: string
  experiencia_id: string
  url: string
  alt_text?: string | null
  orden?: number | null
  created_at?: string | null
}

export interface ExperienciasImagenesUpdate {
  id?: string
  experiencia_id?: string
  url?: string
  alt_text?: string | null
  orden?: number | null
  created_at?: string | null
}
