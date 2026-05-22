// Controller liviano para cotizaciones_items.
// La mayor parte del trabajo vive en QuotesController/QuoteItemsService,
// pero exponemos esta clase para mantener el patrón "un controller por dominio".

import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createOperatorsRepository } from "@/repositories/operators/operators.repository"
import { createQuoterPricesRepository } from "@/repositories/quoter-prices/quoter-prices.repository"
import { createQuoterServicesRepository } from "@/repositories/quoter-services/quoter-services.repository"
import { createQuoteItemsRepository } from "@/repositories/quote-items/quote-items.repository"
import { createQuotesRepository } from "@/repositories/quotes/quotes.repository"
import {
  QuoteItemsService,
  createQuoteItemsService,
} from "@/services/quote-items/quote-items.service"
import { createQuotesService } from "@/services/quotes/quotes.service"

export class QuoteItemsController extends BaseIdController<
  "cotizaciones_items",
  QuoteItemsService
> {
  constructor(service: QuoteItemsService) {
    super(service)
  }

  listByCotizacion(quoteId: string) {
    return this.service.listByCotizacion(quoteId)
  }
}

export async function createServerQuoteItemsController() {
  const supabase = await createClient()
  const quotesRepo = createQuotesRepository(supabase)
  const itemsRepo = createQuoteItemsRepository(supabase)
  const serviciosRepo = createQuoterServicesRepository(supabase)
  const preciosRepo = createQuoterPricesRepository(supabase)
  const operatorsRepo = createOperatorsRepository(supabase)
  const quotesSvc = createQuotesService(quotesRepo, itemsRepo)
  const itemsSvc = createQuoteItemsService(
    itemsRepo,
    serviciosRepo,
    preciosRepo,
    quotesSvc,
    operatorsRepo,
  )
  return new QuoteItemsController(itemsSvc)
}
