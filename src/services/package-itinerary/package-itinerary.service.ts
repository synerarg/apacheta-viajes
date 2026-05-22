import {
  PaquetesItinerarioNotFoundException,
  PaquetesItinerarioServiceException,
} from "@/exceptions/paquetes-itinerario/paquetes-itinerario.exceptions"
import { PaquetesItinerarioRepository } from "@/repositories/paquetes-itinerario/paquetes-itinerario.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  PaquetesItinerarioRow,
  PaquetesItinerarioUpdate,
} from "@/types/paquetes-itinerario/paquetes-itinerario.types"

export class PaquetesItinerarioService extends BaseService<"paquetes_itinerario"> {
  constructor(repository: PaquetesItinerarioRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new PaquetesItinerarioServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new PaquetesItinerarioNotFoundException(criteria)
  }

  async getById(id: string): Promise<PaquetesItinerarioRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: PaquetesItinerarioUpdate,
  ): Promise<PaquetesItinerarioRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createPaquetesItinerarioService(
  repository: PaquetesItinerarioRepository,
) {
  return new PaquetesItinerarioService(repository)
}
