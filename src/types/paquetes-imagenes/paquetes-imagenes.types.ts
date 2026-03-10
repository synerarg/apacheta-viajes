export interface PaquetesImagenesRow {
  id: string
  paquete_id: string
  url: string
  alt_text: string | null
  orden: number | null
  created_at: string | null
}

export interface PaquetesImagenesInsert {
  id?: string
  paquete_id: string
  url: string
  alt_text?: string | null
  orden?: number | null
  created_at?: string | null
}

export interface PaquetesImagenesUpdate {
  id?: string
  paquete_id?: string
  url?: string
  alt_text?: string | null
  orden?: number | null
  created_at?: string | null
}
