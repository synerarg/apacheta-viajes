import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createHomeStatisticsRepository } from "@/repositories/home-statistics/home-statistics.repository"
import {
  createHomeStatisticsService,
  HomeStatisticsService,
} from "@/services/home-statistics/home-statistics.service"

export class HomeStatisticsController extends BaseIdController<"estadisticas_home"> {
  constructor(service: HomeStatisticsService) {
    super(service)
  }
}

export async function createServerHomeStatisticsController() {
  const supabase = await createClient()

  return new HomeStatisticsController(
    createHomeStatisticsService(
      createHomeStatisticsRepository(supabase),
    ),
  )
}
