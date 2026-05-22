import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class OperatorsRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("operadores", operation, cause)
  }
}

export class OperatorsServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("operadores", operation, cause)
  }
}

export class OperatorsNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("operadores", criteria)
  }
}
