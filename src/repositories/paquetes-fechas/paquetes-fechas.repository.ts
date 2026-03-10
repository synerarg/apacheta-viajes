import { PaquetesFechasRepositoryException } from "@/exceptions/paquetes-fechas/paquetes-fechas.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { PaquetesFechasUpdate } from "@/types/paquetes-fechas/paquetes-fechas.types"

export class PaquetesFechasRepository extends BaseRepository<"paquetes_fechas"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "paquetes_fechas")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new PaquetesFechasRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: PaquetesFechasUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createPaquetesFechasRepository(supabase: DatabaseClient) {
  return new PaquetesFechasRepository(supabase)
}
