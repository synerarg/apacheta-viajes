import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createOperatorRequestsRepository } from "@/repositories/operator-requests/operator-requests.repository"
import {
  OperatorRequestsService,
  createOperatorRequestsService,
} from "@/services/operator-requests/operator-requests.service"

export class OperatorRequestsController extends BaseIdController<
  "solicitudes_operador",
  OperatorRequestsService
> {
  constructor(service: OperatorRequestsService) {
    super(service)
  }

  listMine(userId: string) {
    return this.service.listMine(userId)
  }

  getActiveByUserId(userId: string) {
    return this.service.getActiveByUserId(userId)
  }

  submit(userId: string, payload: Parameters<OperatorRequestsService["submit"]>[1]) {
    return this.service.submit(userId, payload)
  }

  cancel(requestId: string, userId: string) {
    return this.service.cancel(requestId, userId)
  }

  markInReview(requestId: string, adminId: string) {
    return this.service.markInReview(requestId, adminId)
  }

  approve(requestId: string, adminId: string) {
    return this.service.approve(requestId, adminId)
  }

  reject(requestId: string, adminId: string, motivo: string) {
    return this.service.reject(requestId, adminId, motivo)
  }
}

export async function createServerOperatorRequestsController() {
  const supabase = await createClient()

  return new OperatorRequestsController(
    createOperatorRequestsService(createOperatorRequestsRepository(supabase)),
  )
}
