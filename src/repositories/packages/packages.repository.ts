import { PackagesRepositoryException } from "@/exceptions/packages/packages.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { PackagesUpdate } from "@/types/packages/packages.types"

export class PackagesRepository extends BaseRepository<"paquetes"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "paquetes")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new PackagesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: PackagesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createPackagesRepository(supabase: DatabaseClient) {
  return new PackagesRepository(supabase)
}
