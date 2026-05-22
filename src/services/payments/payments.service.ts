import { PaymentsNotFoundException, PaymentsServiceException } from "@/exceptions/payments/payments.exceptions"
import { PaymentsRepository } from "@/repositories/payments/payments.repository"
import { BaseService } from "@/services/base/base.service"
import type { PaymentsRow, PaymentsUpdate } from "@/types/payments/payments.types"

export class PaymentsService extends BaseService<"pagos"> {
  constructor(repository: PaymentsRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new PaymentsServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new PaymentsNotFoundException(criteria)
  }

  async getById(id: string): Promise<PaymentsRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async getByExternalReference(externalReference: string): Promise<PaymentsRow> {
    return this.getOrThrow(
      { external_reference: externalReference },
      `external_reference ${externalReference}`,
    )
  }

  async listByOrderId(orderId: string) {
    return this.list({ orden_id: orderId })
  }

  async updateById(id: string, payload: PaymentsUpdate) {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }
}

export function createPaymentsService(repository: PaymentsRepository) {
  return new PaymentsService(repository)
}
