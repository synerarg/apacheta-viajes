import { OperatorsRepositoryException } from "@/exceptions/operators/operators.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type {
  OperatorWithTier,
  OperatorsUpdate,
} from "@/types/operators/operators.types"
import type { DatabaseClient } from "@/types/database/database.types"

export class OperatorsRepository extends BaseRepository<"operadores"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "operadores")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new OperatorsRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async findByUserId(userId: string) {
    return this.findOne({ usuario_id: userId })
  }

  async findByUserIdWithTier(
    userId: string,
  ): Promise<OperatorWithTier | null> {
    const { data, error } = await this.supabase
      .from("operadores")
      .select("*, tipo_operador:tipos_operador(id, nombre, comision_pct)")
      .eq("usuario_id", userId)
      .maybeSingle()

    if (error) {
      throw this.createRepositoryException("findByUserIdWithTier", error)
    }

    return (data as OperatorWithTier | null) ?? null
  }

  async updateById(id: string, payload: OperatorsUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createOperatorsRepository(supabase: DatabaseClient) {
  return new OperatorsRepository(supabase)
}
