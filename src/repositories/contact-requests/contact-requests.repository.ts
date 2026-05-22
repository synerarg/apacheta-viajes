import { ContactRequestsRepositoryException } from "@/exceptions/contact-requests/contact-requests.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { ContactRequestsUpdate } from "@/types/contact-requests/contact-requests.types"

export class ContactRequestsRepository extends BaseRepository<"solicitudes_contacto"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "solicitudes_contacto")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new ContactRequestsRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: ContactRequestsUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createContactRequestsRepository(
  supabase: DatabaseClient,
) {
  return new ContactRequestsRepository(supabase)
}
