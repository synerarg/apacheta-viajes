import { PaquetesImagenesRepositoryException } from "@/exceptions/paquetes-imagenes/paquetes-imagenes.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { PaquetesImagenesUpdate } from "@/types/paquetes-imagenes/paquetes-imagenes.types"

export class PaquetesImagenesRepository extends BaseRepository<"paquetes_imagenes"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "paquetes_imagenes")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new PaquetesImagenesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: PaquetesImagenesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createPaquetesImagenesRepository(supabase: DatabaseClient) {
  return new PaquetesImagenesRepository(supabase)
}
