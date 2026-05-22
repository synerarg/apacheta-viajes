import { PackageImagesRepositoryException } from "@/exceptions/package-images/package-images.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { PackageImagesUpdate } from "@/types/package-images/package-images.types"

export class PackageImagesRepository extends BaseRepository<"paquetes_imagenes"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "paquetes_imagenes")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new PackageImagesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: PackageImagesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createPackageImagesRepository(supabase: DatabaseClient) {
  return new PackageImagesRepository(supabase)
}
