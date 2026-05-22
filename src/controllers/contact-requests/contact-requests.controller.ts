import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createContactRequestsRepository } from "@/repositories/contact-requests/contact-requests.repository"
import {
  createContactRequestsService,
  ContactRequestsService,
} from "@/services/contact-requests/contact-requests.service"

export class ContactRequestsController extends BaseIdController<"solicitudes_contacto"> {
  constructor(service: ContactRequestsService) {
    super(service)
  }
}

export async function createServerContactRequestsController() {
  const supabase = await createClient()

  return new ContactRequestsController(
    createContactRequestsService(
      createContactRequestsRepository(supabase),
    ),
  )
}
