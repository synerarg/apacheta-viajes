import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class EmisivoDestinosRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("emisivo_destinos", operation, cause)
  }
}

export class EmisivoDestinosServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("emisivo_destinos", operation, cause)
  }
}

export class EmisivoDestinosNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("emisivo_destinos", criteria)
  }
}
