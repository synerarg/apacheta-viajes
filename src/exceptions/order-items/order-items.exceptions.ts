import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class OrdenesItemsRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("ordenes_items", operation, cause)
  }
}

export class OrdenesItemsServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("ordenes_items", operation, cause)
  }
}

export class OrdenesItemsNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("ordenes_items", criteria)
  }
}
