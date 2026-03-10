import { UsuariosRepositoryException } from "@/exceptions/usuarios/usuarios.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { UsuariosUpdate } from "@/types/usuarios/usuarios.types"

export class UsuariosRepository extends BaseRepository<"usuarios"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "usuarios")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new UsuariosRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: UsuariosUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createUsuariosRepository(supabase: DatabaseClient) {
  return new UsuariosRepository(supabase)
}
