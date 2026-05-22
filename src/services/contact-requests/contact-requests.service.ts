import {
  SolicitudesContactoNotFoundException,
  SolicitudesContactoServiceException,
} from "@/exceptions/solicitudes-contacto/solicitudes-contacto.exceptions"
import { SolicitudesContactoRepository } from "@/repositories/solicitudes-contacto/solicitudes-contacto.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  SolicitudesContactoRow,
  SolicitudesContactoUpdate,
} from "@/types/solicitudes-contacto/solicitudes-contacto.types"

export class SolicitudesContactoService extends BaseService<"solicitudes_contacto"> {
  constructor(repository: SolicitudesContactoRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new SolicitudesContactoServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new SolicitudesContactoNotFoundException(criteria)
  }

  async getById(id: string): Promise<SolicitudesContactoRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: SolicitudesContactoUpdate,
  ): Promise<SolicitudesContactoRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createSolicitudesContactoService(
  repository: SolicitudesContactoRepository,
) {
  return new SolicitudesContactoService(repository)
}
