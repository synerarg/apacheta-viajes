import { BaseController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createPaquetesCategoriasRepository } from "@/repositories/paquetes-categorias/paquetes-categorias.repository"
import {
  createPaquetesCategoriasService,
  PaquetesCategoriasService,
} from "@/services/paquetes-categorias/paquetes-categorias.service"

export class PaquetesCategoriasController extends BaseController<
  "paquetes_categorias",
  PaquetesCategoriasService
> {
  constructor(service: PaquetesCategoriasService) {
    super(service)
  }

  async getByCompositeKey(paqueteId: string, categoriaId: string) {
    return this.service.getByCompositeKey(paqueteId, categoriaId)
  }

  async updateByCompositeKey(
    paqueteId: string,
    categoriaId: string,
    payload: Parameters<PaquetesCategoriasService["updateByCompositeKey"]>[2],
  ) {
    return this.service.updateByCompositeKey(paqueteId, categoriaId, payload)
  }

  async deleteByCompositeKey(paqueteId: string, categoriaId: string) {
    return this.service.deleteByCompositeKey(paqueteId, categoriaId)
  }
}

export async function createServerPaquetesCategoriasController() {
  const supabase = await createClient()

  return new PaquetesCategoriasController(
    createPaquetesCategoriasService(
      createPaquetesCategoriasRepository(supabase),
    ),
  )
}
