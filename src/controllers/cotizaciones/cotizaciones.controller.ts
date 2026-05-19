import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createCotizadorPreciosRepository } from "@/repositories/cotizador-precios/cotizador-precios.repository"
import { createCotizadorServiciosRepository } from "@/repositories/cotizador-servicios/cotizador-servicios.repository"
import { createCotizacionesItemsRepository } from "@/repositories/cotizaciones-items/cotizaciones-items.repository"
import { createCotizacionesRepository } from "@/repositories/cotizaciones/cotizaciones.repository"
import {
  CotizacionesItemsService,
  createCotizacionesItemsService,
} from "@/services/cotizaciones-items/cotizaciones-items.service"
import {
  CotizacionesService,
  createCotizacionesService,
  type CotizacionHeaderPayload,
} from "@/services/cotizaciones/cotizaciones.service"
export class CotizacionesController extends BaseIdController<"cotizaciones", CotizacionesService> {
  constructor(
    service: CotizacionesService,
    readonly itemsService: CotizacionesItemsService,
  ) {
    super(service)
  }

  listMine(operadorId: string) {
    return this.service.listByOperador(operadorId)
  }

  listAll() {
    return this.service.listAll()
  }

  createDraft(operadorId: string, payload: CotizacionHeaderPayload) {
    return this.service.createDraft(operadorId, payload)
  }

  updateHeader(id: string, payload: CotizacionHeaderPayload) {
    return this.service.updateHeader(id, payload)
  }

  markAsSent(id: string) {
    return this.service.markAsSent(id)
  }

  archive(id: string) {
    return this.service.archive(id)
  }

  getByToken(token: string) {
    return this.service.getByToken(token)
  }

  getWithItems(id: string) {
    return this.service.getWithItems(id)
  }

  recalculateTotals(id: string) {
    return this.service.recalculateTotals(id)
  }

  addItem(cotizacionId: string, payload: Parameters<CotizacionesItemsService["addItem"]>[1]) {
    return this.itemsService.addItem(cotizacionId, payload)
  }

  addSpecialItem(
    cotizacionId: string,
    payload: Parameters<CotizacionesItemsService["addSpecialItem"]>[1],
  ) {
    return this.itemsService.addSpecialItem(cotizacionId, payload)
  }

  updateItem(itemId: string, payload: Parameters<CotizacionesItemsService["updateItem"]>[1]) {
    return this.itemsService.updateItem(itemId, payload)
  }

  removeItem(itemId: string) {
    return this.itemsService.removeItem(itemId)
  }
}

export async function createServerCotizacionesController() {
  const supabase = await createClient()

  const cotizacionesRepo = createCotizacionesRepository(supabase)
  const itemsRepo = createCotizacionesItemsRepository(supabase)
  const serviciosRepo = createCotizadorServiciosRepository(supabase)
  const preciosRepo = createCotizadorPreciosRepository(supabase)

  const cotizacionesSvc = createCotizacionesService(cotizacionesRepo, itemsRepo)
  const itemsSvc = createCotizacionesItemsService(
    itemsRepo,
    serviciosRepo,
    preciosRepo,
    cotizacionesSvc,
  )

  return new CotizacionesController(cotizacionesSvc, itemsSvc)
}
