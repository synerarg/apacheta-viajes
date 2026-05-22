import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class UsersRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("usuarios", operation, cause)
  }
}

export class UsersServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("usuarios", operation, cause)
  }
}

export class UsersNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("usuarios", criteria)
  }
}
