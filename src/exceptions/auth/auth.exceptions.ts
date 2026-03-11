import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class AuthRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("auth", operation, cause)
  }
}

export class AuthServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("auth", operation, cause)
  }
}

export class AuthNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("auth", criteria)
  }
}
