import { OperatorTypesRepositoryException } from "@/exceptions/operator-types/operator-types.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type {
  OperatorTypesRow,
  OperatorTypesUpdate,
} from "@/types/operator-types/operator-types.types"
import type { DatabaseClient } from "@/types/database/database.types"

export class OperatorTypesRepository extends BaseRepository<"tipos_operador"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "tipos_operador")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new OperatorTypesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: OperatorTypesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }

  async listOrdered(): Promise<OperatorTypesRow[]> {
    const { data, error } = await this.supabase
      .from("tipos_operador")
      .select("*")
      .order("orden", { ascending: true })
      .order("nombre", { ascending: true })

    if (error) throw this.createRepositoryException("listOrdered", error)
    return (data as OperatorTypesRow[]) ?? []
  }

  async listActiveOrdered(): Promise<OperatorTypesRow[]> {
    const { data, error } = await this.supabase
      .from("tipos_operador")
      .select("*")
      .eq("activo", true)
      .order("orden", { ascending: true })
      .order("nombre", { ascending: true })

    if (error) throw this.createRepositoryException("listActiveOrdered", error)
    return (data as OperatorTypesRow[]) ?? []
  }
}

export function createOperatorTypesRepository(supabase: DatabaseClient) {
  return new OperatorTypesRepository(supabase)
}
