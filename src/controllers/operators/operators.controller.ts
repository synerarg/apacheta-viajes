import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createOperatorsRepository } from "@/repositories/operators/operators.repository"
import { OperatorsService, createOperatorsService } from "@/services/operators/operators.service"
import type { OperatorWithTier } from "@/types/operators/operators.types"

export class OperatorsController extends BaseIdController<"operadores"> {
  private readonly operatorsService: OperatorsService

  constructor(service: OperatorsService) {
    super(service)
    this.operatorsService = service
  }

  async findByUserIdWithTier(
    userId: string,
  ): Promise<OperatorWithTier | null> {
    return this.operatorsService.findByUserIdWithTier(userId)
  }
}

export async function createServerOperatorsController() {
  const supabase = await createClient()

  return new OperatorsController(
    createOperatorsService(createOperatorsRepository(supabase)),
  )
}
