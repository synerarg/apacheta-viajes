import {
  QuoteItemsNotFoundException,
  QuoteItemsServiceException,
  QuoteItemsValidationException,
} from "@/exceptions/quote-items/quote-items.exceptions"
import { calcItemSubtotals } from "@/lib/quoter/calculations"
import {
  addDaysIso,
  daysBetweenInclusive,
  isValidIsoDate,
} from "@/lib/quoter/dates"
import { detectSeason } from "@/lib/quoter/season"
import { OperatorsRepository } from "@/repositories/operators/operators.repository"
import { QuoterPricesRepository } from "@/repositories/quoter-prices/quoter-prices.repository"
import { QuoterServicesRepository } from "@/repositories/quoter-services/quoter-services.repository"
import { QuoteItemsRepository } from "@/repositories/quote-items/quote-items.repository"
import { BaseService } from "@/services/base/base.service"
import type { QuotesService } from "@/services/quotes/quotes.service"
import type {
  QuoteItemsRow,
  QuoteItemsUpdate,
} from "@/types/quote-items/quote-items.types"
import type { QuotesRow } from "@/types/quotes/quotes.types"

export interface AddItemPayload {
  servicio_id: string
  dia_offset: number
  fecha?: string | null
  adultos: number
  menores: number
  precio_adulto_unit?: number
  precio_menor_unit?: number
  temporada?: string
}

export interface AddSpecialPayload {
  nombre: string
  descripcion?: string | null
  precio_unit: number
  adultos: number
  menores: number
  dia_offset: number
  fecha?: string | null
}

export interface UpdateItemPayload {
  adultos?: number
  menores?: number
  precio_adulto_unit?: number
  precio_menor_unit?: number
  dia_offset?: number
  fecha?: string | null
  servicio_nombre?: string
  servicio_descripcion?: string | null
}

export class QuoteItemsService extends BaseService<"cotizaciones_items"> {
  constructor(
    private readonly itemsRepository: QuoteItemsRepository,
    private readonly servicesRepository: QuoterServicesRepository,
    private readonly pricesRepository: QuoterPricesRepository,
    private readonly quotesService: QuotesService,
    private readonly operatorsRepository: OperatorsRepository,
  ) {
    super(itemsRepository)
  }

  private async resolveTierCommissionPct(operadorId: string): Promise<number> {
    const operator = await this.operatorsRepository.findByUserIdWithTier(
      operadorId,
    )
    return Number(operator?.tipo_operador?.comision_pct ?? 0)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new QuoteItemsServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new QuoteItemsNotFoundException(criteria)
  }

  async listByCotizacion(quoteId: string): Promise<QuoteItemsRow[]> {
    try {
      return await this.itemsRepository.listByCotizacion(quoteId)
    } catch (error) {
      this.handleServiceError("listByCotizacion", error)
    }
  }

  async getById(id: string): Promise<QuoteItemsRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  private async assertDiaOffsetInRange(
    quoteId: string,
    diaOffset: number,
    fechaIn?: string | null,
  ): Promise<{ cotizacion: QuotesRow; fechaResolved: string | null }> {
    const cotizacion = await this.quotesService.getById(quoteId)
    const totalDias = daysBetweenInclusive(
      cotizacion.fecha_inicio,
      cotizacion.fecha_fin,
    )

    if (totalDias === 0) {
      throw new QuoteItemsValidationException(
        "Definí fecha de inicio y fin del viaje antes de cargar servicios.",
      )
    }

    if (diaOffset < 0 || diaOffset >= totalDias) {
      throw new QuoteItemsValidationException(
        `El día ${diaOffset + 1} está fuera del rango del viaje (${totalDias} días).`,
      )
    }

    const computedFecha = cotizacion.fecha_inicio
      ? addDaysIso(cotizacion.fecha_inicio, diaOffset)
      : null

    if (fechaIn && !isValidIsoDate(fechaIn)) {
      throw new QuoteItemsValidationException(
        "Fecha inválida (formato YYYY-MM-DD).",
      )
    }

    const fechaResolved = fechaIn ?? computedFecha

    return { cotizacion, fechaResolved }
  }

  /**
   * Agrega un item normal (referencia a un servicio del catálogo).
   * - Resuelve servicio + temporada via detectSeason(fecha) si no se pasa explícita.
   * - Busca el precio para esa temporada y calcula subtotales.
   * - Snapshot del nombre/descripcion/precios al momento de agregar.
   */
  async addItem(
    quoteId: string,
    payload: AddItemPayload,
  ): Promise<QuoteItemsRow> {
    try {
      const { cotizacion, fechaResolved } = await this.assertDiaOffsetInRange(
        quoteId,
        payload.dia_offset,
        payload.fecha,
      )

      const servicio = (await this.servicesRepository.findById(
        payload.servicio_id,
      )) as unknown as
        | { id: string; nombre: string; descripcion: string | null }
        | null
      if (!servicio) {
        throw new QuoteItemsValidationException(
          `Servicio ${payload.servicio_id} no encontrado.`,
        )
      }

      const precios = await this.pricesRepository.findByService(payload.servicio_id)

      // Resolver temporada
      let temporada = payload.temporada
      if (!temporada) {
        const fechaForSeason = fechaResolved
          ? new Date(`${fechaResolved}T00:00:00`)
          : new Date()
        temporada = detectSeason(
          fechaForSeason,
          precios.map((p) => p.temporada),
        )
      }
      const precio = precios.find((p) => p.temporada === temporada) ?? null

      const precioAdulto =
        payload.precio_adulto_unit ?? Number(precio?.precio_adulto ?? 0)
      const precioMenor =
        payload.precio_menor_unit ?? Number(precio?.precio_menor ?? precio?.precio_adulto ?? 0)
      const comisionPct = await this.resolveTierCommissionPct(cotizacion.operador_id)

      const totals = calcItemSubtotals({
        adultos: payload.adultos,
        menores: payload.menores,
        precioAdultoUnit: precioAdulto,
        precioMenorUnit: precioMenor,
        comisionPct,
      })

      const inserted = await this.create({
        cotizacion_id: quoteId,
        servicio_id: servicio.id,
        dia_offset: payload.dia_offset,
        fecha: fechaResolved,
        servicio_nombre: servicio.nombre,
        servicio_descripcion: servicio.descripcion ?? null,
        adultos: payload.adultos,
        menores: payload.menores,
        precio_adulto_unit: precioAdulto,
        precio_menor_unit: precioMenor,
        comision_pct: comisionPct,
        subtotal_venta: totals.subtotalVenta,
        subtotal_comision: totals.subtotalComision,
        subtotal_neto: totals.subtotalNeto,
        is_special: false,
      })

      await this.quotesService.recalculateTotals(quoteId)
      return inserted
    } catch (error) {
      this.handleServiceError("addItem", error)
    }
  }

  /**
   * Agrega un item especial (equipaje, guía bilingüe, etc.) — sin servicio del catálogo.
   * comision_pct=0, is_special=true.
   */
  async addSpecialItem(
    quoteId: string,
    payload: AddSpecialPayload,
  ): Promise<QuoteItemsRow> {
    try {
      const { fechaResolved } = await this.assertDiaOffsetInRange(
        quoteId,
        payload.dia_offset,
        payload.fecha,
      )

      const precioAdulto = Math.max(0, Number(payload.precio_unit) || 0)
      const totals = calcItemSubtotals({
        adultos: payload.adultos ?? 1,
        menores: payload.menores ?? 0,
        precioAdultoUnit: precioAdulto,
        precioMenorUnit: 0,
        comisionPct: 0,
      })

      const inserted = await this.create({
        cotizacion_id: quoteId,
        servicio_id: null,
        dia_offset: payload.dia_offset,
        fecha: fechaResolved,
        servicio_nombre: payload.nombre,
        servicio_descripcion: payload.descripcion ?? null,
        adultos: payload.adultos ?? 1,
        menores: payload.menores ?? 0,
        precio_adulto_unit: precioAdulto,
        precio_menor_unit: 0,
        comision_pct: 0,
        subtotal_venta: totals.subtotalVenta,
        subtotal_comision: totals.subtotalComision,
        subtotal_neto: totals.subtotalNeto,
        is_special: true,
      })

      await this.quotesService.recalculateTotals(quoteId)
      return inserted
    } catch (error) {
      this.handleServiceError("addSpecialItem", error)
    }
  }

  async updateItem(itemId: string, payload: UpdateItemPayload): Promise<QuoteItemsRow> {
    try {
      const current = await this.getById(itemId)

      if (payload.dia_offset !== undefined) {
        await this.assertDiaOffsetInRange(
          current.cotizacion_id,
          payload.dia_offset,
          payload.fecha ?? current.fecha,
        )
      }

      const adultos = payload.adultos ?? current.adultos
      const menores = payload.menores ?? current.menores
      const precioAdulto = payload.precio_adulto_unit ?? Number(current.precio_adulto_unit)
      const precioMenor = payload.precio_menor_unit ?? Number(current.precio_menor_unit ?? 0)
      // Items especiales siempre 0%; servicios normales siguen el tier del operador.
      let comisionPct = 0
      if (!current.is_special) {
        const cotizacion = await this.quotesService.getById(current.cotizacion_id)
        comisionPct = await this.resolveTierCommissionPct(cotizacion.operador_id)
      }

      const totals = calcItemSubtotals({
        adultos,
        menores,
        precioAdultoUnit: precioAdulto,
        precioMenorUnit: precioMenor,
        comisionPct,
      })

      const update: QuoteItemsUpdate = {
        adultos,
        menores,
        precio_adulto_unit: precioAdulto,
        precio_menor_unit: precioMenor,
        comision_pct: comisionPct,
        subtotal_venta: totals.subtotalVenta,
        subtotal_comision: totals.subtotalComision,
        subtotal_neto: totals.subtotalNeto,
      }
      if (payload.dia_offset !== undefined) update.dia_offset = payload.dia_offset
      if (payload.fecha !== undefined) {
        if (payload.fecha !== null && !isValidIsoDate(payload.fecha)) {
          throw new QuoteItemsValidationException(
            "Fecha del item inválida (formato YYYY-MM-DD).",
          )
        }
        update.fecha = payload.fecha
      }
      if (payload.servicio_nombre !== undefined) update.servicio_nombre = payload.servicio_nombre
      if (payload.servicio_descripcion !== undefined) {
        update.servicio_descripcion = payload.servicio_descripcion
      }

      const updated = await this.updateByFilters({ id: itemId }, update, `id ${itemId}`)

      await this.quotesService.recalculateTotals(current.cotizacion_id)
      return updated
    } catch (error) {
      this.handleServiceError("updateItem", error)
    }
  }

  async removeItem(itemId: string): Promise<void> {
    try {
      const current = await this.getById(itemId)
      await this.deleteByFilters({ id: itemId })
      await this.quotesService.recalculateTotals(current.cotizacion_id)
    } catch (error) {
      this.handleServiceError("removeItem", error)
    }
  }
}

export function createQuoteItemsService(
  itemsRepository: QuoteItemsRepository,
  servicesRepository: QuoterServicesRepository,
  pricesRepository: QuoterPricesRepository,
  quotesService: QuotesService,
  operatorsRepository: OperatorsRepository,
) {
  return new QuoteItemsService(
    itemsRepository,
    servicesRepository,
    pricesRepository,
    quotesService,
    operatorsRepository,
  )
}
