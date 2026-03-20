type DatabaseJson =
  | string
  | number
  | boolean
  | null
  | { [key: string]: DatabaseJson | undefined }
  | DatabaseJson[]

export interface PagosEventosRow {
  id: string
  pago_id: string
  tipo: string
  estado: string | null
  mensaje: string | null
  payload: DatabaseJson | null
  created_at: string | null
}

export interface PagosEventosInsert {
  id?: string
  pago_id: string
  tipo: string
  estado?: string | null
  mensaje?: string | null
  payload?: DatabaseJson | null
  created_at?: string | null
}

export interface PagosEventosUpdate {
  id?: string
  pago_id?: string
  tipo?: string
  estado?: string | null
  mensaje?: string | null
  payload?: DatabaseJson | null
  created_at?: string | null
}
