import { BaseException } from "@/exceptions/base/base.exception"
import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"
import { ValidationException } from "@/exceptions/base/validation.exception"

export class PaymentsRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("payments", operation, cause)
  }
}

export class PaymentsServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("payments", operation, cause)
  }
}

export class ReservationPaymentNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("payments", criteria)
  }
}

export class OrderPaymentNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("payments", criteria)
  }
}

export class PaymentRecordNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("payments", criteria)
  }
}

export class MercadoPagoConfigurationException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("mercadopago", operation, cause)
  }
}

export class BankTransferConfigurationException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("bank_transfer", operation, cause)
  }
}

export class PaymentReceiptAccessDeniedException extends BaseException {
  constructor(cause?: unknown) {
    super("No tenes permiso para acceder a este comprobante.", { cause })
  }
}

export class PaymentReceiptUnavailableException extends BaseException {
  constructor() {
    super("El comprobante todavia no esta disponible.")
  }
}

export class PaymentReceiptValidationException extends ValidationException {
  constructor(message: string) {
    super("payments", message)
  }
}
