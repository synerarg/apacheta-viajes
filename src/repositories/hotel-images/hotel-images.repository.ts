import { HotelImagesRepositoryException } from "@/exceptions/hotel-images/hotel-images.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { HotelImagesUpdate } from "@/types/hotel-images/hotel-images.types"

export class HotelImagesRepository extends BaseRepository<"hoteles_imagenes"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "hoteles_imagenes")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new HotelImagesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: HotelImagesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createHotelImagesRepository(supabase: DatabaseClient) {
  return new HotelImagesRepository(supabase)
}
