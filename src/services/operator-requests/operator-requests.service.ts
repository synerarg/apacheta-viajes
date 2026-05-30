import {
  OperatorRequestsNotFoundException,
  OperatorRequestsServiceException,
  OperatorRequestsValidationException,
} from "@/exceptions/operator-requests/operator-requests.exceptions"
import { OperatorRequestsRepository } from "@/repositories/operator-requests/operator-requests.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  OperatorRequestsInsert,
  OperatorRequestsRow,
} from "@/types/operator-requests/operator-requests.types"

export type SubmitRequestInput = Omit<OperatorRequestsInsert, "usuario_id" | "estado">

export class OperatorRequestsService extends BaseService<"solicitudes_operador"> {
  constructor(private readonly requestsRepository: OperatorRequestsRepository) {
    super(requestsRepository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new OperatorRequestsServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new OperatorRequestsNotFoundException(criteria)
  }

  async getById(id: string): Promise<OperatorRequestsRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async listMine(userId: string): Promise<OperatorRequestsRow[]> {
    try {
      return await this.requestsRepository.listByUserId(userId)
    } catch (error) {
      this.handleServiceError("listMine", error)
    }
  }

  async getActiveByUserId(userId: string): Promise<OperatorRequestsRow | null> {
    try {
      return await this.requestsRepository.findActiveByUserId(userId)
    } catch (error) {
      this.handleServiceError("getActiveByUserId", error)
    }
  }

  async submit(userId: string, payload: SubmitRequestInput): Promise<OperatorRequestsRow> {
    const active = await this.getActiveByUserId(userId)
    if (active) {
      throw new OperatorRequestsValidationException(
        "Ya tenés una solicitud activa. Cancelala antes de enviar una nueva.",
      )
    }

    return this.create({
      ...payload,
      usuario_id: userId,
      estado: "pendiente",
    })
  }

  async cancel(requestId: string, userId: string): Promise<OperatorRequestsRow> {
    const solicitud = await this.getById(requestId)
    if (solicitud.usuario_id !== userId) {
      throw new OperatorRequestsValidationException("No podés cancelar una solicitud ajena.")
    }
    if (solicitud.estado !== "pendiente") {
      throw new OperatorRequestsValidationException(
        `Solo se pueden cancelar solicitudes pendientes (estado actual: ${solicitud.estado}).`,
      )
    }
    return this.updateByFilters({ id: requestId }, { estado: "cancelada" }, `id ${requestId}`)
  }

  async markInReview(requestId: string, adminId: string): Promise<OperatorRequestsRow> {
    const solicitud = await this.getById(requestId)
    if (solicitud.estado !== "pendiente") {
      throw new OperatorRequestsValidationException(
        `Solo se pueden marcar como en revisión solicitudes pendientes (estado actual: ${solicitud.estado}).`,
      )
    }
    return this.updateByFilters(
      { id: requestId },
      { estado: "en_revision", revisado_por: adminId, revisado_at: new Date().toISOString() },
      `id ${requestId}`,
    )
  }

  async approve(
    requestId: string,
    adminId: string,
    tipoOperadorId?: string,
  ): Promise<OperatorRequestsRow> {
    const solicitud = await this.getById(requestId)
    // El tipo de operador lo define el administrador al aprobar. Si llega uno
    // nuevo lo persistimos en la solicitud para que el RPC lo copie al operador.
    const tipo = tipoOperadorId ?? solicitud.tipo_operador_id
    if (!tipo) {
      throw new OperatorRequestsValidationException(
        "Asigná un tipo de operador antes de aprobar la solicitud.",
      )
    }
    if (tipo !== solicitud.tipo_operador_id) {
      await this.updateByFilters(
        { id: requestId },
        { tipo_operador_id: tipo },
        `id ${requestId}`,
      )
    }

    try {
      return await this.requestsRepository.callApproveRpc(requestId, adminId)
    } catch (error) {
      this.handleServiceError("approve", error)
    }
  }

  async reject(
    requestId: string,
    adminId: string,
    motivo: string,
  ): Promise<OperatorRequestsRow> {
    const trimmed = motivo?.trim()
    if (!trimmed) {
      throw new OperatorRequestsValidationException("El motivo de rechazo es obligatorio.")
    }

    const solicitud = await this.getById(requestId)
    if (!["pendiente", "en_revision"].includes(solicitud.estado)) {
      throw new OperatorRequestsValidationException(
        `Solo se pueden rechazar solicitudes pendientes o en revisión (estado actual: ${solicitud.estado}).`,
      )
    }

    return this.updateByFilters(
      { id: requestId },
      {
        estado: "rechazada",
        motivo_rechazo: trimmed,
        revisado_por: adminId,
        revisado_at: new Date().toISOString(),
      },
      `id ${requestId}`,
    )
  }
}

export function createOperatorRequestsService(repository: OperatorRequestsRepository) {
  return new OperatorRequestsService(repository)
}
