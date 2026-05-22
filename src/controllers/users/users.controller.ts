import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createUsersRepository } from "@/repositories/users/users.repository"
import { createUsersService, UsersService } from "@/services/users/users.service"

export class UsersController extends BaseIdController<"usuarios"> {
  constructor(service: UsersService) {
    super(service)
  }
}

export async function createServerUsersController() {
  const supabase = await createClient()

  return new UsersController(
    createUsersService(createUsersRepository(supabase)),
  )
}
