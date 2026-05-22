import { PaquetesRepositoryException } from "@/exceptions/paquetes/paquetes.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { PaquetesUpdate } from "@/types/paquetes/paquetes.types"

export class PaquetesRepository extends BaseRepository<"paquetes"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "paquetes")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new PaquetesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: PaquetesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createPaquetesRepository(supabase: DatabaseClient) {
  return new PaquetesRepository(supabase)
}
