import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createCategoriasExperienciaRepository } from "@/repositories/categorias-experiencia/categorias-experiencia.repository"
import {
  CategoriasExperienciaService,
  createCategoriasExperienciaService,
} from "@/services/categorias-experiencia/categorias-experiencia.service"

export class CategoriasExperienciaController extends BaseIdController<"categorias_experiencia"> {
  constructor(service: CategoriasExperienciaService) {
    super(service)
  }
}

export async function createServerCategoriasExperienciaController() {
  const supabase = await createClient()

  return new CategoriasExperienciaController(
    createCategoriasExperienciaService(
      createCategoriasExperienciaRepository(supabase),
    ),
  )
}
