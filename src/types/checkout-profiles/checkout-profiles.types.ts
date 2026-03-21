export interface CheckoutProfilesRow {
  usuario_id: string
  contact_first_name: string | null
  contact_last_name: string | null
  contact_email: string | null
  contact_phone: string | null
  passenger_full_name: string | null
  passenger_document_number: string | null
  passenger_birth_date: string | null
  passenger_nationality: string | null
  passenger_special_requirements: string | null
  created_at: string | null
  updated_at: string | null
}

export interface CheckoutProfilesInsert {
  usuario_id: string
  contact_first_name?: string | null
  contact_last_name?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  passenger_full_name?: string | null
  passenger_document_number?: string | null
  passenger_birth_date?: string | null
  passenger_nationality?: string | null
  passenger_special_requirements?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface CheckoutProfilesUpdate {
  usuario_id?: string
  contact_first_name?: string | null
  contact_last_name?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  passenger_full_name?: string | null
  passenger_document_number?: string | null
  passenger_birth_date?: string | null
  passenger_nationality?: string | null
  passenger_special_requirements?: string | null
  created_at?: string | null
  updated_at?: string | null
}
