import {
  PaymentEventsNotFoundException,
  PaymentEventsServiceException,
} from "@/exceptions/payment-events/payment-events.exceptions"
import { PaymentEventsRepository } from "@/repositories/payment-events/payment-events.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  PaymentEventsRow,
  PaymentEventsUpdate,
} from "@/types/payment-events/payment-events.types"

export class PaymentEventsService extends BaseService<"pagos_eventos"> {
  constructor(repository: PaymentEventsRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new PaymentEventsServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new PaymentEventsNotFoundException(criteria)
  }

  async getById(id: string): Promise<PaymentEventsRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async listByPaymentId(paymentId: string) {
    return this.list({ pago_id: paymentId })
  }

  async updateById(id: string, payload: PaymentEventsUpdate) {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }
}

export function createPaymentEventsService(repository: PaymentEventsRepository) {
  return new PaymentEventsService(repository)
}
