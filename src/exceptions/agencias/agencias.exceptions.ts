import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class AgenciasRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("agencias", operation, cause)
  }
}

export class AgenciasServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("agencias", operation, cause)
  }
}

export class AgenciasNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("agencias", criteria)
  }
}
