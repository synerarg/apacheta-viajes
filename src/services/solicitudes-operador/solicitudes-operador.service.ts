import {
  SolicitudesOperadorNotFoundException,
  SolicitudesOperadorServiceException,
  SolicitudesOperadorValidationException,
} from "@/exceptions/solicitudes-operador/solicitudes-operador.exceptions"
import { SolicitudesOperadorRepository } from "@/repositories/solicitudes-operador/solicitudes-operador.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  SolicitudesOperadorInsert,
  SolicitudesOperadorRow,
} from "@/types/solicitudes-operador/solicitudes-operador.types"

export type SubmitSolicitudInput = Omit<SolicitudesOperadorInsert, "usuario_id" | "estado">

export class SolicitudesOperadorService extends BaseService<"solicitudes_operador"> {
  constructor(private readonly solicitudesRepository: SolicitudesOperadorRepository) {
    super(solicitudesRepository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new SolicitudesOperadorServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new SolicitudesOperadorNotFoundException(criteria)
  }

  async getById(id: string): Promise<SolicitudesOperadorRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async listMine(usuarioId: string): Promise<SolicitudesOperadorRow[]> {
    try {
      return await this.solicitudesRepository.listByUsuarioId(usuarioId)
    } catch (error) {
      this.handleServiceError("listMine", error)
    }
  }

  async getActiveByUsuarioId(usuarioId: string): Promise<SolicitudesOperadorRow | null> {
    try {
      return await this.solicitudesRepository.findActiveByUsuarioId(usuarioId)
    } catch (error) {
      this.handleServiceError("getActiveByUsuarioId", error)
    }
  }

  async submit(usuarioId: string, payload: SubmitSolicitudInput): Promise<SolicitudesOperadorRow> {
    const active = await this.getActiveByUsuarioId(usuarioId)
    if (active) {
      throw new SolicitudesOperadorValidationException(
        "Ya tenés una solicitud activa. Cancelala antes de enviar una nueva.",
      )
    }

    return this.create({
      ...payload,
      usuario_id: usuarioId,
      estado: "pendiente",
    })
  }

  async cancel(solicitudId: string, usuarioId: string): Promise<SolicitudesOperadorRow> {
    const solicitud = await this.getById(solicitudId)
    if (solicitud.usuario_id !== usuarioId) {
      throw new SolicitudesOperadorValidationException("No podés cancelar una solicitud ajena.")
    }
    if (solicitud.estado !== "pendiente") {
      throw new SolicitudesOperadorValidationException(
        `Solo se pueden cancelar solicitudes pendientes (estado actual: ${solicitud.estado}).`,
      )
    }
    return this.updateByFilters({ id: solicitudId }, { estado: "cancelada" }, `id ${solicitudId}`)
  }

  async markInReview(solicitudId: string, adminId: string): Promise<SolicitudesOperadorRow> {
    const solicitud = await this.getById(solicitudId)
    if (solicitud.estado !== "pendiente") {
      throw new SolicitudesOperadorValidationException(
        `Solo se pueden marcar como en revisión solicitudes pendientes (estado actual: ${solicitud.estado}).`,
      )
    }
    return this.updateByFilters(
      { id: solicitudId },
      { estado: "en_revision", revisado_por: adminId, revisado_at: new Date().toISOString() },
      `id ${solicitudId}`,
    )
  }

  async approve(solicitudId: string, adminId: string): Promise<SolicitudesOperadorRow> {
    try {
      return await this.solicitudesRepository.callApproveRpc(solicitudId, adminId)
    } catch (error) {
      this.handleServiceError("approve", error)
    }
  }

  async reject(
    solicitudId: string,
    adminId: string,
    motivo: string,
  ): Promise<SolicitudesOperadorRow> {
    const trimmed = motivo?.trim()
    if (!trimmed) {
      throw new SolicitudesOperadorValidationException("El motivo de rechazo es obligatorio.")
    }

    const solicitud = await this.getById(solicitudId)
    if (!["pendiente", "en_revision"].includes(solicitud.estado)) {
      throw new SolicitudesOperadorValidationException(
        `Solo se pueden rechazar solicitudes pendientes o en revisión (estado actual: ${solicitud.estado}).`,
      )
    }

    return this.updateByFilters(
      { id: solicitudId },
      {
        estado: "rechazada",
        motivo_rechazo: trimmed,
        revisado_por: adminId,
        revisado_at: new Date().toISOString(),
      },
      `id ${solicitudId}`,
    )
  }
}

export function createSolicitudesOperadorService(repository: SolicitudesOperadorRepository) {
  return new SolicitudesOperadorService(repository)
}
