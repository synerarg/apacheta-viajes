import { PackageItineraryRepositoryException } from "@/exceptions/package-itinerary/package-itinerary.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { PackageItineraryUpdate } from "@/types/package-itinerary/package-itinerary.types"

export class PackageItineraryRepository extends BaseRepository<"paquetes_itinerario"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "paquetes_itinerario")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new PackageItineraryRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: PackageItineraryUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createPackageItineraryRepository(supabase: DatabaseClient) {
  return new PackageItineraryRepository(supabase)
}
