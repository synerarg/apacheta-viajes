import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class TransferImagesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("traslados_imagenes", operation, cause)
  }
}

export class TransferImagesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("traslados_imagenes", operation, cause)
  }
}

export class TransferImagesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("traslados_imagenes", criteria)
  }
}
