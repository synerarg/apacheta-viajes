import { SolicitudesOperadorRepositoryException } from "@/exceptions/solicitudes-operador/solicitudes-operador.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type {
  SolicitudesOperadorRow,
  SolicitudesOperadorUpdate,
} from "@/types/solicitudes-operador/solicitudes-operador.types"
import type { DatabaseClient } from "@/types/database/database.types"

export class SolicitudesOperadorRepository extends BaseRepository<"solicitudes_operador"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "solicitudes_operador")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new SolicitudesOperadorRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async findActiveByUsuarioId(usuarioId: string): Promise<SolicitudesOperadorRow | null> {
    const { data, error } = await this.supabase
      .from("solicitudes_operador")
      .select("*")
      .eq("usuario_id", usuarioId)
      .in("estado", ["pendiente", "en_revision"])
      .maybeSingle()

    if (error) throw this.createRepositoryException("findActiveByUsuarioId", error)
    return (data as SolicitudesOperadorRow | null) ?? null
  }

  async listByUsuarioId(usuarioId: string): Promise<SolicitudesOperadorRow[]> {
    const { data, error } = await this.supabase
      .from("solicitudes_operador")
      .select("*")
      .eq("usuario_id", usuarioId)
      .order("created_at", { ascending: false })

    if (error) throw this.createRepositoryException("listByUsuarioId", error)
    return (data as SolicitudesOperadorRow[]) ?? []
  }

  async updateById(id: string, payload: SolicitudesOperadorUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }

  async callApproveRpc(solicitudId: string, adminId: string): Promise<SolicitudesOperadorRow> {
    const { data, error } = await (
      this.supabase.rpc as unknown as (
        fn: string,
        args: Record<string, unknown>,
      ) => Promise<{ data: SolicitudesOperadorRow | null; error: unknown }>
    )("approve_solicitud_operador", {
      p_solicitud_id: solicitudId,
      p_admin_id: adminId,
    })

    if (error) throw this.createRepositoryException("callApproveRpc", error)
    if (!data) throw this.createRepositoryException("callApproveRpc", new Error("RPC sin resultado"))
    return data
  }
}

export function createSolicitudesOperadorRepository(supabase: DatabaseClient) {
  return new SolicitudesOperadorRepository(supabase)
}
