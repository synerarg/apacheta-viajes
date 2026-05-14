export interface TrasladosImagenesRow {
  id: string
  traslado_id: string
  url: string
  orden: number | null
  created_at: string | null
}

export interface TrasladosImagenesInsert {
  id?: string
  traslado_id: string
  url: string
  orden?: number | null
  created_at?: string | null
}

export interface TrasladosImagenesUpdate {
  id?: string
  traslado_id?: string
  url?: string
  orden?: number | null
  created_at?: string | null
}
