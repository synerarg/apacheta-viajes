import {
  PaquetesCategoriasNotFoundException,
  PaquetesCategoriasServiceException,
} from "@/exceptions/paquetes-categorias/paquetes-categorias.exceptions"
import { PaquetesCategoriasRepository } from "@/repositories/paquetes-categorias/paquetes-categorias.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  PaquetesCategoriasRow,
  PaquetesCategoriasUpdate,
} from "@/types/paquetes-categorias/paquetes-categorias.types"

export class PaquetesCategoriasService extends BaseService<"paquetes_categorias"> {
  constructor(repository: PaquetesCategoriasRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new PaquetesCategoriasServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new PaquetesCategoriasNotFoundException(criteria)
  }

  async getByCompositeKey(
    paqueteId: string,
    categoriaId: string,
  ): Promise<PaquetesCategoriasRow> {
    return this.getOrThrow(
      {
        paquete_id: paqueteId,
        categoria_id: categoriaId,
      },
      `paquete_id ${paqueteId} + categoria_id ${categoriaId}`,
    )
  }

  async updateByCompositeKey(
    paqueteId: string,
    categoriaId: string,
    payload: PaquetesCategoriasUpdate,
  ): Promise<PaquetesCategoriasRow> {
    return this.updateByFilters(
      {
        paquete_id: paqueteId,
        categoria_id: categoriaId,
      },
      payload,
      `paquete_id ${paqueteId} + categoria_id ${categoriaId}`,
    )
  }

  async deleteByCompositeKey(
    paqueteId: string,
    categoriaId: string,
  ): Promise<void> {
    return this.deleteByFilters({
      paquete_id: paqueteId,
      categoria_id: categoriaId,
    })
  }
}

export function createPaquetesCategoriasService(
  repository: PaquetesCategoriasRepository,
) {
  return new PaquetesCategoriasService(repository)
}
