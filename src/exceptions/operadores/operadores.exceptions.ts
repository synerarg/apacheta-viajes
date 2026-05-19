import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class OperadoresRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("operadores", operation, cause)
  }
}

export class OperadoresServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("operadores", operation, cause)
  }
}

export class OperadoresNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("operadores", criteria)
  }
}
