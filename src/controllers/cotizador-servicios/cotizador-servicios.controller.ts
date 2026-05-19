import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createCotizadorServiciosRepository } from "@/repositories/cotizador-servicios/cotizador-servicios.repository"
import {
  CotizadorServiciosService,
  createCotizadorServiciosService,
} from "@/services/cotizador-servicios/cotizador-servicios.service"

export class CotizadorServiciosController extends BaseIdController<
  "cotizador_servicios",
  CotizadorServiciosService
> {
  constructor(service: CotizadorServiciosService) {
    super(service)
  }

  findActiveByCategoria(categoriaId: string) {
    return this.service.findActiveByCategoria(categoriaId)
  }
}

export async function createServerCotizadorServiciosController() {
  const supabase = await createClient()
  return new CotizadorServiciosController(
    createCotizadorServiciosService(createCotizadorServiciosRepository(supabase)),
  )
}
