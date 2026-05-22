import { PaymentsRepositoryException } from "@/exceptions/payments/payments.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { PaymentsRow, PaymentsUpdate } from "@/types/payments/payments.types"

export class PaymentsRepository extends BaseRepository<"pagos"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "pagos")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new PaymentsRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async findByExternalReference(externalReference: string) {
    return this.findOne({ external_reference: externalReference })
  }

  async listByOrderId(orderId: string) {
    return this.findMany({ orden_id: orderId })
  }

  async listExpiredOpenBankTransfers(referenceDate: string) {
    const { data, error } = (await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("metodo", "bank_transfer")
      .in("estado", ["requires_action", "reported"])
      .lt("expires_at", referenceDate)) as unknown as {
      data: PaymentsRow[] | null
      error: unknown
    }

    if (error) {
      throw this.createRepositoryException(
        "listExpiredOpenBankTransfers",
        error,
      )
    }

    return data ?? []
  }

  async updateById(id: string, payload: PaymentsUpdate) {
    return this.update({ id }, payload)
  }
}

export function createPaymentsRepository(supabase: DatabaseClient) {
  return new PaymentsRepository(supabase)
}
