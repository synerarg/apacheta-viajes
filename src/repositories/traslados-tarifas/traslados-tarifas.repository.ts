import { TrasladosTarifasRepositoryException } from "@/exceptions/traslados-tarifas/traslados-tarifas.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { TrasladosTarifasUpdate } from "@/types/traslados-tarifas/traslados-tarifas.types"

export class TrasladosTarifasRepository extends BaseRepository<"traslados_tarifas"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "traslados_tarifas")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new TrasladosTarifasRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: TrasladosTarifasUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createTrasladosTarifasRepository(supabase: DatabaseClient) {
  return new TrasladosTarifasRepository(supabase)
}
