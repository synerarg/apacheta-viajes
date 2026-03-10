export interface PaquetesItinerarioRow {
  id: string
  paquete_id: string
  dia_numero: number
  titulo: string
  descripcion: string
  created_at: string | null
}

export interface PaquetesItinerarioInsert {
  id?: string
  paquete_id: string
  dia_numero: number
  titulo: string
  descripcion: string
  created_at?: string | null
}

export interface PaquetesItinerarioUpdate {
  id?: string
  paquete_id?: string
  dia_numero?: number
  titulo?: string
  descripcion?: string
  created_at?: string | null
}
