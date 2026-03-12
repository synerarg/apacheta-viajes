import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

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
