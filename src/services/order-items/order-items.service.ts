import {
  OrdenesItemsNotFoundException,
  OrdenesItemsServiceException,
} from "@/exceptions/ordenes-items/ordenes-items.exceptions"
import { OrdenesItemsRepository } from "@/repositories/ordenes-items/ordenes-items.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  OrdenesItemsRow,
  OrdenesItemsUpdate,
} from "@/types/ordenes-items/ordenes-items.types"

export class OrdenesItemsService extends BaseService<"ordenes_items"> {
  constructor(repository: OrdenesItemsRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new OrdenesItemsServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new OrdenesItemsNotFoundException(criteria)
  }

  async getById(id: string): Promise<OrdenesItemsRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async listByOrdenId(ordenId: string) {
    return this.list({ orden_id: ordenId })
  }

  async updateById(id: string, payload: OrdenesItemsUpdate) {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }
}

export function createOrdenesItemsService(repository: OrdenesItemsRepository) {
  return new OrdenesItemsService(repository)
}
