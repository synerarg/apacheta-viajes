import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class PagosRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("pagos", operation, cause)
  }
}

export class PagosServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("pagos", operation, cause)
  }
}

export class PagosNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("pagos", criteria)
  }
}
