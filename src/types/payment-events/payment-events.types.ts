type DatabaseJson =
  | string
  | number
  | boolean
  | null
  | { [key: string]: DatabaseJson | undefined }
  | DatabaseJson[]

export interface PaymentEventsRow {
  id: string
  pago_id: string
  tipo: string
  estado: string | null
  mensaje: string | null
  payload: DatabaseJson | null
  created_at: string | null
}

export interface PaymentEventsInsert {
  id?: string
  pago_id: string
  tipo: string
  estado?: string | null
  mensaje?: string | null
  payload?: DatabaseJson | null
  created_at?: string | null
}

export interface PaymentEventsUpdate {
  id?: string
  pago_id?: string
  tipo?: string
  estado?: string | null
  mensaje?: string | null
  payload?: DatabaseJson | null
  created_at?: string | null
}
