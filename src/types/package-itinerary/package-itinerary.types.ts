export interface PackageItineraryRow {
  id: string
  paquete_id: string
  dia_numero: number
  titulo: string
  descripcion: string
  created_at: string | null
}

export interface PackageItineraryInsert {
  id?: string
  paquete_id: string
  dia_numero: number
  titulo: string
  descripcion: string
  created_at?: string | null
}

export interface PackageItineraryUpdate {
  id?: string
  paquete_id?: string
  dia_numero?: number
  titulo?: string
  descripcion?: string
  created_at?: string | null
}
