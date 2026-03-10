import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class UsuariosRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("usuarios", operation, cause)
  }
}

export class UsuariosServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("usuarios", operation, cause)
  }
}

export class UsuariosNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("usuarios", criteria)
  }
}
