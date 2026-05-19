import {
  CotizacionesNotFoundException,
  CotizacionesServiceException,
  CotizacionesValidationException,
} from "@/exceptions/cotizaciones/cotizaciones.exceptions"
import { calcCotizacionTotals } from "@/lib/cotizador/calculations"
import { generateRecommendations } from "@/lib/cotizador/recommendations"
import { CotizacionesItemsRepository } from "@/repositories/cotizaciones-items/cotizaciones-items.repository"
import { CotizacionesRepository } from "@/repositories/cotizaciones/cotizaciones.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  CotizacionEstado,
  CotizacionesRow,
  CotizacionesUpdate,
} from "@/types/cotizaciones/cotizaciones.types"
import type { CotizacionesItemsRow } from "@/types/cotizaciones-items/cotizaciones-items.types"

export type CotizacionHeaderPayload = {
  cliente_nombre?: string | null
  cliente_email?: string | null
  cliente_telefono?: string | null
  fecha_inicio?: string | null
  fecha_fin?: string | null
  aplica_impuesto?: boolean
  impuesto_pct?: number
  notas_internas?: string | null
}

export interface CotizacionWithItems extends CotizacionesRow {
  items: CotizacionesItemsRow[]
}

export class CotizacionesService extends BaseService<"cotizaciones"> {
  constructor(
    private readonly cotizacionesRepository: CotizacionesRepository,
    private readonly itemsRepository: CotizacionesItemsRepository,
  ) {
    super(cotizacionesRepository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new CotizacionesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new CotizacionesNotFoundException(criteria)
  }

  async getById(id: string): Promise<CotizacionesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async listByOperador(operadorId: string): Promise<CotizacionesRow[]> {
    try {
      return await this.cotizacionesRepository.listByOperador(operadorId)
    } catch (error) {
      this.handleServiceError("listByOperador", error)
    }
  }

  async listAll(): Promise<CotizacionesRow[]> {
    try {
      return await this.cotizacionesRepository.listAll()
    } catch (error) {
      this.handleServiceError("listAll", error)
    }
  }

  async createDraft(
    operadorId: string,
    payload: CotizacionHeaderPayload,
  ): Promise<CotizacionesRow> {
    try {
      return await this.create({
        operador_id: operadorId,
        cliente_nombre: payload.cliente_nombre ?? null,
        cliente_email: payload.cliente_email ?? null,
        cliente_telefono: payload.cliente_telefono ?? null,
        fecha_inicio: payload.fecha_inicio ?? null,
        fecha_fin: payload.fecha_fin ?? null,
        aplica_impuesto: payload.aplica_impuesto ?? false,
        impuesto_pct: payload.impuesto_pct ?? 1.2,
        notas_internas: payload.notas_internas ?? null,
        estado: "borrador",
        total_venta: 0,
        total_comision: 0,
        total_neto: 0,
        total_impuesto: 0,
        total_final: 0,
      })
    } catch (error) {
      this.handleServiceError("createDraft", error)
    }
  }

  async updateHeader(
    id: string,
    payload: CotizacionHeaderPayload,
  ): Promise<CotizacionesRow> {
    const update: CotizacionesUpdate = {
      cliente_nombre: payload.cliente_nombre ?? null,
      cliente_email: payload.cliente_email ?? null,
      cliente_telefono: payload.cliente_telefono ?? null,
      fecha_inicio: payload.fecha_inicio ?? null,
      fecha_fin: payload.fecha_fin ?? null,
      aplica_impuesto: payload.aplica_impuesto ?? false,
      impuesto_pct: payload.impuesto_pct ?? 1.2,
      notas_internas: payload.notas_internas ?? null,
    }
    await this.updateByFilters({ id }, update, `id ${id}`)
    return this.recalculateTotals(id)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }

  async setEstado(id: string, estado: CotizacionEstado): Promise<CotizacionesRow> {
    return this.updateByFilters({ id }, { estado }, `id ${id}`)
  }

  async markAsSent(id: string): Promise<CotizacionesRow> {
    const current = await this.getById(id)
    if (current.estado === "archivada") {
      throw new CotizacionesValidationException("No se puede enviar una cotización archivada.")
    }
    return this.setEstado(id, "enviada")
  }

  async archive(id: string): Promise<CotizacionesRow> {
    return this.setEstado(id, "archivada")
  }

  async getByToken(token: string): Promise<CotizacionWithItems | null> {
    try {
      const row = await this.cotizacionesRepository.findByToken(token)
      if (!row) return null
      if (row.estado !== "enviada") return null
      const items = await this.itemsRepository.listByCotizacion(row.id)
      return { ...row, items }
    } catch (error) {
      this.handleServiceError("getByToken", error)
    }
  }

  async getWithItems(id: string): Promise<CotizacionWithItems> {
    try {
      const row = await this.getById(id)
      const items = await this.itemsRepository.listByCotizacion(row.id)
      return { ...row, items }
    } catch (error) {
      this.handleServiceError("getWithItems", error)
    }
  }

  async recalculateTotals(id: string): Promise<CotizacionesRow> {
    try {
      const cotizacion = await this.getById(id)
      const items = await this.itemsRepository.listByCotizacion(id)
      const totals = calcCotizacionTotals(
        items.map((it) => ({
          subtotalVenta: Number(it.subtotal_venta),
          subtotalComision: Number(it.subtotal_comision),
          subtotalNeto: Number(it.subtotal_neto),
        })),
        Boolean(cotizacion.aplica_impuesto),
        Number(cotizacion.impuesto_pct),
      )

      const fechaInicio = cotizacion.fecha_inicio
        ? new Date(`${cotizacion.fecha_inicio}T00:00:00`)
        : null
      const recomendaciones = generateRecommendations(
        items.map((it) => ({ servicio_nombre: it.servicio_nombre })),
        fechaInicio,
      )

      return await this.updateByFilters(
        { id },
        {
          total_venta: totals.totalVenta,
          total_comision: totals.totalComision,
          total_neto: totals.totalNeto,
          total_impuesto: totals.totalImpuesto,
          total_final: totals.totalFinal,
          recomendaciones,
        },
        `id ${id}`,
      )
    } catch (error) {
      this.handleServiceError("recalculateTotals", error)
    }
  }
}

export function createCotizacionesService(
  cotizacionesRepository: CotizacionesRepository,
  itemsRepository: CotizacionesItemsRepository,
) {
  return new CotizacionesService(cotizacionesRepository, itemsRepository)
}
