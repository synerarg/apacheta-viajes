import { UsersRepositoryException } from "@/exceptions/users/users.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { UsersUpdate } from "@/types/users/users.types"

export class UsersRepository extends BaseRepository<"usuarios"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "usuarios")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new UsersRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: UsersUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createUsersRepository(supabase: DatabaseClient) {
  return new UsersRepository(supabase)
}
