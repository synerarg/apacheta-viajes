import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class ExperiencesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("experiencias", operation, cause)
  }
}

export class ExperiencesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("experiencias", operation, cause)
  }
}

export class ExperiencesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("experiencias", criteria)
  }
}
