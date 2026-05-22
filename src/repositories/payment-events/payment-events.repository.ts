import { PaymentEventsRepositoryException } from "@/exceptions/payment-events/payment-events.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { PaymentEventsUpdate } from "@/types/payment-events/payment-events.types"

export class PaymentEventsRepository extends BaseRepository<"pagos_eventos"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "pagos_eventos")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new PaymentEventsRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async listByPaymentId(paymentId: string) {
    return this.findMany({ pago_id: paymentId })
  }

  async updateById(id: string, payload: PaymentEventsUpdate) {
    return this.update({ id }, payload)
  }
}

export function createPaymentEventsRepository(supabase: DatabaseClient) {
  return new PaymentEventsRepository(supabase)
}
