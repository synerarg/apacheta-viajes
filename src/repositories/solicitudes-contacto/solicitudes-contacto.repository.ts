import { SolicitudesContactoRepositoryException } from "@/exceptions/solicitudes-contacto/solicitudes-contacto.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { SolicitudesContactoUpdate } from "@/types/solicitudes-contacto/solicitudes-contacto.types"

export class SolicitudesContactoRepository extends BaseRepository<"solicitudes_contacto"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "solicitudes_contacto")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new SolicitudesContactoRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: SolicitudesContactoUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createSolicitudesContactoRepository(
  supabase: DatabaseClient,
) {
  return new SolicitudesContactoRepository(supabase)
}
