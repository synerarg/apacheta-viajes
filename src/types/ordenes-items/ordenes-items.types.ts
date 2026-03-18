type DatabaseJson =
  | string
  | number
  | boolean
  | null
  | { [key: string]: DatabaseJson | undefined }
  | DatabaseJson[]

export type OrdenItemTipo = "paquete" | "experiencia"

export interface OrdenesItemsRow {
  id: string
  orden_id: string
  reserva_id: string
  tipo: OrdenItemTipo
  nombre: string
  descripcion_corta: string | null
  imagen_url: string | null
  cantidad: number
  precio_unitario: number
  precio_total: number
  moneda: string
  metadata: DatabaseJson | null
  created_at: string | null
  updated_at: string | null
}

export interface OrdenesItemsInsert {
  id?: string
  orden_id: string
  reserva_id: string
  tipo: OrdenItemTipo
  nombre: string
  descripcion_corta?: string | null
  imagen_url?: string | null
  cantidad?: number
  precio_unitario: number
  precio_total: number
  moneda?: string
  metadata?: DatabaseJson | null
  created_at?: string | null
  updated_at?: string | null
}

export interface OrdenesItemsUpdate {
  id?: string
  orden_id?: string
  reserva_id?: string
  tipo?: OrdenItemTipo
  nombre?: string
  descripcion_corta?: string | null
  imagen_url?: string | null
  cantidad?: number
  precio_unitario?: number
  precio_total?: number
  moneda?: string
  metadata?: DatabaseJson | null
  created_at?: string | null
  updated_at?: string | null
}
