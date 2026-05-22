import { OperatorRequestsRepositoryException } from "@/exceptions/operator-requests/operator-requests.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type {
  OperatorRequestsRow,
  OperatorRequestsUpdate,
} from "@/types/operator-requests/operator-requests.types"
import type { DatabaseClient } from "@/types/database/database.types"

export class OperatorRequestsRepository extends BaseRepository<"solicitudes_operador"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "solicitudes_operador")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new OperatorRequestsRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async findActiveByUserId(userId: string): Promise<OperatorRequestsRow | null> {
    const { data, error } = await this.supabase
      .from("solicitudes_operador")
      .select("*")
      .eq("usuario_id", userId)
      .in("estado", ["pendiente", "en_revision"])
      .maybeSingle()

    if (error) throw this.createRepositoryException("findActiveByUserId", error)
    return (data as OperatorRequestsRow | null) ?? null
  }

  async listByUserId(userId: string): Promise<OperatorRequestsRow[]> {
    const { data, error } = await this.supabase
      .from("solicitudes_operador")
      .select("*")
      .eq("usuario_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw this.createRepositoryException("listByUserId", error)
    return (data as OperatorRequestsRow[]) ?? []
  }

  async updateById(id: string, payload: OperatorRequestsUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }

  async callApproveRpc(requestId: string, adminId: string): Promise<OperatorRequestsRow> {
    const { data, error } = await (
      this.supabase.rpc as unknown as (
        fn: string,
        args: Record<string, unknown>,
      ) => Promise<{ data: OperatorRequestsRow | null; error: unknown }>
    )("approve_solicitud_operador", {
      p_solicitud_id: requestId,
      p_admin_id: adminId,
    })

    if (error) throw this.createRepositoryException("callApproveRpc", error)
    if (!data) throw this.createRepositoryException("callApproveRpc", new Error("RPC sin resultado"))
    return data
  }
}

export function createOperatorRequestsRepository(supabase: DatabaseClient) {
  return new OperatorRequestsRepository(supabase)
}
