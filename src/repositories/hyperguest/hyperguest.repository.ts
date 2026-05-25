import { HotelsRepositoryException } from "@/exceptions/hotels/hotels.exceptions"
import type { DatabaseClient } from "@/types/database/database.types"
import type {
  HyperGuestBookingIntentsInsert,
  HyperGuestBookingIntentsRow,
  HyperGuestBookingIntentsUpdate,
  HyperGuestEventsInsert,
  HyperGuestHotelMappingsInsert,
  HyperGuestHotelMappingsRow,
} from "@/types/hyperguest/hyperguest.types"

export class HyperGuestRepository {
  constructor(private readonly supabase: DatabaseClient) {}

  private createRepositoryException(operation: string, cause?: unknown) {
    return new HotelsRepositoryException(`hyperguest.${operation}`, cause)
  }

  async findHotelMappingByPropertyId(
    propertyId: string,
  ): Promise<HyperGuestHotelMappingsRow | null> {
    const { data, error } = await this.supabase
      .from("hyperguest_hotel_mappings")
      .select("*")
      .eq("hyperguest_property_id", propertyId)
      .maybeSingle()

    if (error) {
      throw this.createRepositoryException("findHotelMappingByPropertyId", error)
    }

    return data as HyperGuestHotelMappingsRow | null
  }

  async findHotelMappingByHotelId(
    hotelId: string,
  ): Promise<HyperGuestHotelMappingsRow | null> {
    const { data, error } = await this.supabase
      .from("hyperguest_hotel_mappings")
      .select("*")
      .eq("hotel_id", hotelId)
      .maybeSingle()

    if (error) {
      throw this.createRepositoryException("findHotelMappingByHotelId", error)
    }

    return data as HyperGuestHotelMappingsRow | null
  }

  async upsertHotelMapping(payload: HyperGuestHotelMappingsInsert) {
    const { data, error } = await this.supabase
      .from("hyperguest_hotel_mappings")
      .upsert(payload as never, { onConflict: "hyperguest_property_id" })
      .select("*")
      .single()

    if (error) {
      throw this.createRepositoryException("upsertHotelMapping", error)
    }

    return data as HyperGuestHotelMappingsRow
  }

  async createBookingIntent(payload: HyperGuestBookingIntentsInsert) {
    const { data, error } = await this.supabase
      .from("hyperguest_booking_intents")
      .insert(payload as never)
      .select("*")
      .single()

    if (error) {
      throw this.createRepositoryException("createBookingIntent", error)
    }

    return data as HyperGuestBookingIntentsRow
  }

  async findBookingIntentById(id: string) {
    const { data, error } = await this.supabase
      .from("hyperguest_booking_intents")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (error) {
      throw this.createRepositoryException("findBookingIntentById", error)
    }

    return data as HyperGuestBookingIntentsRow | null
  }

  async findReservationsByUserId(userId: string) {
    const { data, error } = await this.supabase
      .from("hyperguest_booking_intents")
      .select("*, hotel:hoteles(id, nombre, slug, ciudad, provincia)")
      .eq("usuario_id", userId)
      .in("status", ["booked", "cancel_started", "cancelled"])
      .order("created_at", { ascending: false })

    if (error) {
      throw this.createRepositoryException("findReservationsByUserId", error)
    }

    return (data ?? []) as Array<
      HyperGuestBookingIntentsRow & {
        hotel: {
          id: string
          nombre: string
          slug: string
          ciudad: string | null
          provincia: string | null
        } | null
      }
    >
  }

  async updateBookingIntent(
    id: string,
    payload: HyperGuestBookingIntentsUpdate,
  ) {
    const { data, error } = await this.supabase
      .from("hyperguest_booking_intents")
      .update(payload as never)
      .eq("id", id)
      .select("*")
      .single()

    if (error) {
      throw this.createRepositoryException("updateBookingIntent", error)
    }

    return data as HyperGuestBookingIntentsRow
  }

  async createEvent(payload: HyperGuestEventsInsert) {
    const { data, error } = await this.supabase
      .from("hyperguest_events")
      .insert(payload as never)
      .select("*")
      .single()

    if (error) {
      throw this.createRepositoryException("createEvent", error)
    }

    return data
  }
}

export function createHyperGuestRepository(supabase: DatabaseClient) {
  return new HyperGuestRepository(supabase)
}
