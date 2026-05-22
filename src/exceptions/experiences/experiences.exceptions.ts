import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class ExperienciasRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("experiencias", operation, cause)
  }
}

export class ExperienciasServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("experiencias", operation, cause)
  }
}

export class ExperienciasNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("experiencias", criteria)
  }
}
