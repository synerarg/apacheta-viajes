import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class OrdersRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("ordenes", operation, cause)
  }
}

export class OrdersServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("ordenes", operation, cause)
  }
}

export class OrdersNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("ordenes", criteria)
  }
}
