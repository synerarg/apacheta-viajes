import { CheckoutProfilesRepositoryException } from "@/exceptions/checkout-profiles/checkout-profiles.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { CheckoutProfilesInsert, CheckoutProfilesUpdate } from "@/types/checkout-profiles/checkout-profiles.types"

export class CheckoutProfilesRepository extends BaseRepository<"checkout_profiles"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "checkout_profiles")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new CheckoutProfilesRepositoryException(operation, cause)
  }

  async findByUserId(userId: string) {
    return this.findOne({ usuario_id: userId })
  }

  async deleteByUserId(userId: string) {
    return this.delete({ usuario_id: userId })
  }

  async upsertByUserId(userId: string, payload: CheckoutProfilesUpdate) {
    const existing = await this.findByUserId(userId)

    if (existing) {
      return this.update({ usuario_id: userId }, payload)
    }

    const createPayload: Omit<CheckoutProfilesInsert, "usuario_id"> = {
      contact_first_name: payload.contact_first_name,
      contact_last_name: payload.contact_last_name,
      contact_email: payload.contact_email,
      contact_phone: payload.contact_phone,
      passenger_full_name: payload.passenger_full_name,
      passenger_document_number: payload.passenger_document_number,
      passenger_birth_date: payload.passenger_birth_date,
      passenger_nationality: payload.passenger_nationality,
      passenger_special_requirements: payload.passenger_special_requirements,
      created_at: payload.created_at,
      updated_at: payload.updated_at,
    }

    return this.create({
      usuario_id: userId,
      ...createPayload,
    })
  }
}

export function createCheckoutProfilesRepository(supabase: DatabaseClient) {
  return new CheckoutProfilesRepository(supabase)
}
