import {
  UsuariosNotFoundException,
  UsuariosServiceException,
} from "@/exceptions/usuarios/usuarios.exceptions"
import { UsuariosRepository } from "@/repositories/usuarios/usuarios.repository"
import { BaseService } from "@/services/base/base.service"
import type { UsuariosRow, UsuariosUpdate } from "@/types/usuarios/usuarios.types"

export class UsuariosService extends BaseService<"usuarios"> {
  constructor(repository: UsuariosRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new UsuariosServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new UsuariosNotFoundException(criteria)
  }

  async getById(id: string): Promise<UsuariosRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(id: string, payload: UsuariosUpdate): Promise<UsuariosRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createUsuariosService(repository: UsuariosRepository) {
  return new UsuariosService(repository)
}
