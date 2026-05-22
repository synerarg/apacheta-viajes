import {
  ContactRequestsNotFoundException,
  ContactRequestsServiceException,
} from "@/exceptions/contact-requests/contact-requests.exceptions"
import { ContactRequestsRepository } from "@/repositories/contact-requests/contact-requests.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  ContactRequestsRow,
  ContactRequestsUpdate,
} from "@/types/contact-requests/contact-requests.types"

export class ContactRequestsService extends BaseService<"solicitudes_contacto"> {
  constructor(repository: ContactRequestsRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new ContactRequestsServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new ContactRequestsNotFoundException(criteria)
  }

  async getById(id: string): Promise<ContactRequestsRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: ContactRequestsUpdate,
  ): Promise<ContactRequestsRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createContactRequestsService(
  repository: ContactRequestsRepository,
) {
  return new ContactRequestsService(repository)
}
