import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createCotizadorPreciosRepository } from "@/repositories/cotizador-precios/cotizador-precios.repository"
import {
  CotizadorPreciosService,
  createCotizadorPreciosService,
} from "@/services/cotizador-precios/cotizador-precios.service"

export class CotizadorPreciosController extends BaseIdController<
  "cotizador_servicio_precios",
  CotizadorPreciosService
> {
  constructor(service: CotizadorPreciosService) {
    super(service)
  }

  findByServicio(servicioId: string) {
    return this.service.findByServicio(servicioId)
  }

  findActiveForDate(servicioId: string, date: string) {
    return this.service.findActiveForDate(servicioId, date)
  }
}

export async function createServerCotizadorPreciosController() {
  const supabase = await createClient()
  return new CotizadorPreciosController(
    createCotizadorPreciosService(createCotizadorPreciosRepository(supabase)),
  )
}
