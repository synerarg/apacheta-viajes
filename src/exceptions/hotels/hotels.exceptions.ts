import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class HotelsRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("hoteles", operation, cause)
  }
}

export class HotelsServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("hoteles", operation, cause)
  }
}

export class HotelsNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("hoteles", criteria)
  }
}
