import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class ContactRequestsRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("solicitudes_contacto", operation, cause)
  }
}

export class ContactRequestsServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("solicitudes_contacto", operation, cause)
  }
}

export class ContactRequestsNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("solicitudes_contacto", criteria)
  }
}
