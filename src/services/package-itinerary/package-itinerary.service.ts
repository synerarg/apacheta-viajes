import {
  PackageItineraryNotFoundException,
  PackageItineraryServiceException,
} from "@/exceptions/package-itinerary/package-itinerary.exceptions"
import { PackageItineraryRepository } from "@/repositories/package-itinerary/package-itinerary.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  PackageItineraryRow,
  PackageItineraryUpdate,
} from "@/types/package-itinerary/package-itinerary.types"

export class PackageItineraryService extends BaseService<"paquetes_itinerario"> {
  constructor(repository: PackageItineraryRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new PackageItineraryServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new PackageItineraryNotFoundException(criteria)
  }

  async getById(id: string): Promise<PackageItineraryRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: PackageItineraryUpdate,
  ): Promise<PackageItineraryRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createPackageItineraryService(
  repository: PackageItineraryRepository,
) {
  return new PackageItineraryService(repository)
}
