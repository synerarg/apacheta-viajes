import { PackageDatesRepositoryException } from "@/exceptions/package-dates/package-dates.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { PackageDatesUpdate } from "@/types/package-dates/package-dates.types"

export class PackageDatesRepository extends BaseRepository<"paquetes_fechas"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "paquetes_fechas")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new PackageDatesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: PackageDatesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createPackageDatesRepository(supabase: DatabaseClient) {
  return new PackageDatesRepository(supabase)
}
