import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class TrasladosRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("traslados", operation, cause)
  }
}

export class TrasladosServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("traslados", operation, cause)
  }
}

export class TrasladosNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("traslados", criteria)
  }
}
