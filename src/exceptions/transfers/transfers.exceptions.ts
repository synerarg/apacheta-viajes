import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class TransfersRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("traslados", operation, cause)
  }
}

export class TransfersServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("traslados", operation, cause)
  }
}

export class TransfersNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("traslados", criteria)
  }
}
