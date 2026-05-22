import {
  QuotesNotFoundException,
  QuotesServiceException,
  QuotesValidationException,
} from "@/exceptions/quotes/quotes.exceptions"
import { calcQuoteTotals } from "@/lib/quoter/calculations"
import {
  addDaysIso,
  daysBetweenInclusive,
  isValidIsoDate,
} from "@/lib/quoter/dates"
import { QuoteItemsRepository } from "@/repositories/quote-items/quote-items.repository"
import { QuotesRepository } from "@/repositories/quotes/quotes.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  QuoteStatus,
  QuotesRow,
  QuotesUpdate,
} from "@/types/quotes/quotes.types"
import type { QuoteItemsRow } from "@/types/quote-items/quote-items.types"

export type QuoteHeaderPayload = {
  cliente_nombre?: string | null
  cliente_email?: string | null
  cliente_telefono?: string | null
  fecha_inicio?: string | null
  fecha_fin?: string | null
  aplica_impuesto?: boolean
  impuesto_pct?: number
  notas_internas?: string | null
}

export interface QuoteWithItems extends QuotesRow {
  items: QuoteItemsRow[]
}

export class QuotesService extends BaseService<"cotizaciones"> {
  constructor(
    private readonly quotesRepository: QuotesRepository,
    private readonly itemsRepository: QuoteItemsRepository,
  ) {
    super(quotesRepository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new QuotesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new QuotesNotFoundException(criteria)
  }

  async getById(id: string): Promise<QuotesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async listByOperador(operatorId: string): Promise<QuotesRow[]> {
    try {
      return await this.quotesRepository.listByOperador(operatorId)
    } catch (error) {
      this.handleServiceError("listByOperador", error)
    }
  }

  async listAll(): Promise<QuotesRow[]> {
    try {
      return await this.quotesRepository.listAll()
    } catch (error) {
      this.handleServiceError("listAll", error)
    }
  }

  async createDraft(
    operatorId: string,
    payload: QuoteHeaderPayload,
  ): Promise<QuotesRow> {
    try {
      return await this.create({
        operador_id: operatorId,
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
    payload: QuoteHeaderPayload,
  ): Promise<QuotesRow> {
    const current = await this.getById(id)

    if (current.estado !== "borrador") {
      throw new QuotesValidationException(
        "Solo se pueden editar cotizaciones en estado borrador.",
      )
    }

    const update: QuotesUpdate = {}
    const keys = Object.keys(payload) as (keyof QuoteHeaderPayload)[]

    for (const key of keys) {
      const value = payload[key]
      if (value === undefined) continue
      ;(update as Record<string, unknown>)[key] = value
    }

    if (
      update.fecha_inicio !== undefined &&
      update.fecha_inicio !== null &&
      !isValidIsoDate(update.fecha_inicio as string)
    ) {
      throw new QuotesValidationException(
        "fecha_inicio inválida (formato YYYY-MM-DD).",
      )
    }
    if (
      update.fecha_fin !== undefined &&
      update.fecha_fin !== null &&
      !isValidIsoDate(update.fecha_fin as string)
    ) {
      throw new QuotesValidationException(
        "fecha_fin inválida (formato YYYY-MM-DD).",
      )
    }

    const nextInicio =
      update.fecha_inicio !== undefined
        ? (update.fecha_inicio as string | null)
        : current.fecha_inicio
    const nextFin =
      update.fecha_fin !== undefined
        ? (update.fecha_fin as string | null)
        : current.fecha_fin

    if (nextInicio && nextFin && nextFin < nextInicio) {
      throw new QuotesValidationException(
        "La fecha de fin no puede ser anterior a la de inicio.",
      )
    }

    const rangeChanged =
      update.fecha_inicio !== undefined || update.fecha_fin !== undefined

    if (Object.keys(update).length > 0) {
      await this.updateByFilters({ id }, update, `id ${id}`)
    }

    if (rangeChanged) {
      await this.reconcileItemsWithDateRange(id, nextInicio, nextFin)
    }

    return this.recalculateTotals(id)
  }

  private async reconcileItemsWithDateRange(
    quoteId: string,
    fechaInicio: string | null,
    fechaFin: string | null,
  ): Promise<void> {
    const items = await this.itemsRepository.listByCotizacion(quoteId)
    if (items.length === 0) return

    const totalDias = daysBetweenInclusive(fechaInicio, fechaFin)

    for (const item of items) {
      if (totalDias === 0 || item.dia_offset >= totalDias) {
        await this.itemsRepository.deleteById(item.id)
        continue
      }
      const nuevaFecha = fechaInicio ? addDaysIso(fechaInicio, item.dia_offset) : null
      if (nuevaFecha !== item.fecha) {
        await this.itemsRepository.updateById(item.id, { fecha: nuevaFecha })
      }
    }
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }

  async setEstado(id: string, estado: QuoteStatus): Promise<QuotesRow> {
    return this.updateByFilters({ id }, { estado }, `id ${id}`)
  }

  async markAsSent(id: string): Promise<QuotesRow> {
    const current = await this.getById(id)
    if (current.estado === "archivada") {
      throw new QuotesValidationException("No se puede enviar una cotización archivada.")
    }
    const items = await this.itemsRepository.listByCotizacion(id)
    if (items.length === 0) {
      throw new QuotesValidationException(
        "No se puede enviar una cotización sin servicios.",
      )
    }
    if (!current.fecha_inicio || !current.fecha_fin) {
      throw new QuotesValidationException(
        "Cargá las fechas del viaje antes de enviar la cotización.",
      )
    }
    if (!current.cliente_nombre || current.cliente_nombre.trim().length === 0) {
      throw new QuotesValidationException(
        "Cargá el nombre del cliente antes de enviar la cotización.",
      )
    }
    return this.setEstado(id, "enviada")
  }

  async archive(id: string): Promise<QuotesRow> {
    return this.setEstado(id, "archivada")
  }

  async reopenAsDraft(id: string): Promise<QuotesRow> {
    return this.setEstado(id, "borrador")
  }

  async getByToken(token: string): Promise<QuoteWithItems | null> {
    try {
      const row = await this.quotesRepository.findByToken(token)
      if (!row) return null
      if (row.estado !== "enviada") return null
      const items = await this.itemsRepository.listByCotizacion(row.id)
      return { ...row, items }
    } catch (error) {
      this.handleServiceError("getByToken", error)
    }
  }

  async getWithItems(id: string): Promise<QuoteWithItems> {
    try {
      const row = await this.getById(id)
      const items = await this.itemsRepository.listByCotizacion(row.id)
      return { ...row, items }
    } catch (error) {
      this.handleServiceError("getWithItems", error)
    }
  }

  async recalculateTotals(id: string): Promise<QuotesRow> {
    try {
      const cotizacion = await this.getById(id)
      const items = await this.itemsRepository.listByCotizacion(id)
      const totals = calcQuoteTotals(
        items.map((it) => ({
          subtotalVenta: Number(it.subtotal_venta),
          subtotalComision: Number(it.subtotal_comision),
          subtotalNeto: Number(it.subtotal_neto),
        })),
        Boolean(cotizacion.aplica_impuesto),
        Number(cotizacion.impuesto_pct),
      )

      return await this.updateByFilters(
        { id },
        {
          total_venta: totals.totalVenta,
          total_comision: totals.totalComision,
          total_neto: totals.totalNeto,
          total_impuesto: totals.totalImpuesto,
          total_final: totals.totalFinal,
        },
        `id ${id}`,
      )
    } catch (error) {
      this.handleServiceError("recalculateTotals", error)
    }
  }
}

export function createQuotesService(
  quotesRepository: QuotesRepository,
  itemsRepository: QuoteItemsRepository,
) {
  return new QuotesService(quotesRepository, itemsRepository)
}
