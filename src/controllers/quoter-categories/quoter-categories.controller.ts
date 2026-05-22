import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createCotizadorCategoriasRepository } from "@/repositories/cotizador-categorias/cotizador-categorias.repository"
import {
  CotizadorCategoriasService,
  createCotizadorCategoriasService,
} from "@/services/cotizador-categorias/cotizador-categorias.service"

export class CotizadorCategoriasController extends BaseIdController<
  "cotizador_categorias",
  CotizadorCategoriasService
> {
  constructor(service: CotizadorCategoriasService) {
    super(service)
  }
}

export async function createServerCotizadorCategoriasController() {
  const supabase = await createClient()
  return new CotizadorCategoriasController(
    createCotizadorCategoriasService(createCotizadorCategoriasRepository(supabase)),
  )
}
