// Controller liviano para cotizaciones_items.
// La mayor parte del trabajo vive en CotizacionesController/CotizacionesItemsService,
// pero exponemos esta clase para mantener el patrón "un controller por dominio".

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
import { createCotizacionesService } from "@/services/cotizaciones/cotizaciones.service"

export class CotizacionesItemsController extends BaseIdController<
  "cotizaciones_items",
  CotizacionesItemsService
> {
  constructor(service: CotizacionesItemsService) {
    super(service)
  }

  listByCotizacion(cotizacionId: string) {
    return this.service.listByCotizacion(cotizacionId)
  }
}

export async function createServerCotizacionesItemsController() {
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
  return new CotizacionesItemsController(itemsSvc)
}
