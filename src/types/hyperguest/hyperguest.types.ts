export type HyperGuestJson =
  | string
  | number
  | boolean
  | null
  | { [key: string]: HyperGuestJson | undefined }
  | HyperGuestJson[]

export type HyperGuestBookingStatus =
  | "search_started"
  | "searched"
  | "prebook_started"
  | "prebooked"
  | "book_started"
  | "booked"
  | "cancel_started"
  | "cancelled"
  | "failed"

export interface HyperGuestHotelMappingsRow {
  id: string
  hotel_id: string | null
  hyperguest_property_id: string
  hyperguest_hotel_id: string | null
  hyperguest_payload: HyperGuestJson | null
  last_synced_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface HyperGuestHotelMappingsInsert {
  id?: string
  hotel_id?: string | null
  hyperguest_property_id: string
  hyperguest_hotel_id?: string | null
  hyperguest_payload?: HyperGuestJson | null
  last_synced_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface HyperGuestHotelMappingsUpdate {
  id?: string
  hotel_id?: string | null
  hyperguest_property_id?: string
  hyperguest_hotel_id?: string | null
  hyperguest_payload?: HyperGuestJson | null
  last_synced_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface HyperGuestBookingIntentsRow {
  id: string
  usuario_id: string | null
  hotel_id: string | null
  hyperguest_property_id: string
  status: HyperGuestBookingStatus
  provider_booking_id: string | null
  provider_reference: string | null
  check_in: string | null
  check_out: string | null
  rooms: number | null
  adults: number | null
  children: number | null
  infants: number | null
  currency: string | null
  total_amount: number | null
  search_payload: HyperGuestJson | null
  search_response: HyperGuestJson | null
  prebook_payload: HyperGuestJson | null
  prebook_response: HyperGuestJson | null
  book_payload: HyperGuestJson | null
  book_response: HyperGuestJson | null
  cancel_payload: HyperGuestJson | null
  cancel_response: HyperGuestJson | null
  expires_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface HyperGuestBookingIntentsInsert {
  id?: string
  usuario_id?: string | null
  hotel_id?: string | null
  hyperguest_property_id: string
  status?: HyperGuestBookingStatus
  provider_booking_id?: string | null
  provider_reference?: string | null
  check_in?: string | null
  check_out?: string | null
  rooms?: number | null
  adults?: number | null
  children?: number | null
  infants?: number | null
  currency?: string | null
  total_amount?: number | null
  search_payload?: HyperGuestJson | null
  search_response?: HyperGuestJson | null
  prebook_payload?: HyperGuestJson | null
  prebook_response?: HyperGuestJson | null
  book_payload?: HyperGuestJson | null
  book_response?: HyperGuestJson | null
  cancel_payload?: HyperGuestJson | null
  cancel_response?: HyperGuestJson | null
  expires_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface HyperGuestBookingIntentsUpdate {
  id?: string
  usuario_id?: string | null
  hotel_id?: string | null
  hyperguest_property_id?: string
  status?: HyperGuestBookingStatus
  provider_booking_id?: string | null
  provider_reference?: string | null
  check_in?: string | null
  check_out?: string | null
  rooms?: number | null
  adults?: number | null
  children?: number | null
  infants?: number | null
  currency?: string | null
  total_amount?: number | null
  search_payload?: HyperGuestJson | null
  search_response?: HyperGuestJson | null
  prebook_payload?: HyperGuestJson | null
  prebook_response?: HyperGuestJson | null
  book_payload?: HyperGuestJson | null
  book_response?: HyperGuestJson | null
  cancel_payload?: HyperGuestJson | null
  cancel_response?: HyperGuestJson | null
  expires_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface HyperGuestEventsRow {
  id: string
  booking_intent_id: string | null
  type: string
  status: string
  message: string | null
  payload: HyperGuestJson | null
  created_at: string | null
}

export interface HyperGuestEventsInsert {
  id?: string
  booking_intent_id?: string | null
  type: string
  status: string
  message?: string | null
  payload?: HyperGuestJson | null
  created_at?: string | null
}

export interface HyperGuestEventsUpdate {
  id?: string
  booking_intent_id?: string | null
  type?: string
  status?: string
  message?: string | null
  payload?: HyperGuestJson | null
  created_at?: string | null
}

export interface HyperGuestRoomOccupancy {
  adults: number
  childrenAges?: number[]
  infants?: number
}

export interface HyperGuestAvailabilityInput {
  hotelId?: string
  propertyId?: string
  checkIn: string
  checkOut: string
  rooms: number
  adults: number
  children?: number
  infants?: number
  occupancy?: HyperGuestRoomOccupancy[]
  currency?: string
  nationality?: string
  providerPayload?: Record<string, unknown>
  userId?: string | null
}

export interface HyperGuestPrebookInput {
  bookingIntentId: string
  providerPayload?: Record<string, unknown>
  selectedOffer?: Record<string, unknown>
  selectedOffers?: Record<string, unknown>[]
}

export interface HyperGuestGuestContact {
  address?: string | null
  city?: string | null
  country?: string | null
  email?: string | null
  phone?: string | null
  state?: string | null
  zip?: string | null
}

export interface HyperGuestGuestDetails {
  firstName: string
  lastName: string
  title?: "MR" | "MS" | "MRS" | "C" | null
  birthDate?: string | null
  contact?: HyperGuestGuestContact | null
}

export interface HyperGuestBookInput {
  bookingIntentId: string
  guest: HyperGuestGuestDetails & {
    email: string
    phone?: string | null
  }
  roomGuests?: HyperGuestGuestDetails[][]
  specialRequests?: string[]
  meta?: Array<{ key: string; value: string }>
  providerPayload?: Record<string, unknown>
  userId?: string | null
}

export interface HyperGuestCancelInput {
  bookingIntentId: string
  providerBookingId?: string
  reason?: string | null
  providerPayload?: Record<string, unknown>
  userId?: string | null
}
