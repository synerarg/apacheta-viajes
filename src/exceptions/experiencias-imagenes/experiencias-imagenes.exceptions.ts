import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class ExperienciasImagenesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("experiencias_imagenes", operation, cause)
  }
}

export class ExperienciasImagenesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("experiencias_imagenes", operation, cause)
  }
}

export class ExperienciasImagenesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("experiencias_imagenes", criteria)
  }
}
