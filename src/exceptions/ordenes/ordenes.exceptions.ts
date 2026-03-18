import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class OrdenesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("ordenes", operation, cause)
  }
}

export class OrdenesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("ordenes", operation, cause)
  }
}

export class OrdenesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("ordenes", criteria)
  }
}
