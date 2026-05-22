import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class DestinationsRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("destinos", operation, cause)
  }
}

export class DestinationsServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("destinos", operation, cause)
  }
}

export class DestinationsNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("destinos", criteria)
  }
}
