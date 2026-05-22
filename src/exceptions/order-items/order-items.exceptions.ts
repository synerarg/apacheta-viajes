import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class OrderItemsRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("ordenes_items", operation, cause)
  }
}

export class OrderItemsServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("ordenes_items", operation, cause)
  }
}

export class OrderItemsNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("ordenes_items", criteria)
  }
}
