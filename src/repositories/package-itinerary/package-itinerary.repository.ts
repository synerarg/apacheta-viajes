import { PaquetesItinerarioRepositoryException } from "@/exceptions/paquetes-itinerario/paquetes-itinerario.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { PaquetesItinerarioUpdate } from "@/types/paquetes-itinerario/paquetes-itinerario.types"

export class PaquetesItinerarioRepository extends BaseRepository<"paquetes_itinerario"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "paquetes_itinerario")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new PaquetesItinerarioRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: PaquetesItinerarioUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createPaquetesItinerarioRepository(supabase: DatabaseClient) {
  return new PaquetesItinerarioRepository(supabase)
}
