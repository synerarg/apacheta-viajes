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
import {
  QuotesService,
  createQuotesService,
  type QuoteHeaderPayload,
} from "@/services/quotes/quotes.service"
export class QuotesController extends BaseIdController<"cotizaciones", QuotesService> {
  constructor(
    service: QuotesService,
    readonly itemsService: QuoteItemsService,
  ) {
    super(service)
  }

  listMine(operatorId: string) {
    return this.service.listByOperador(operatorId)
  }

  listAll() {
    return this.service.listAll()
  }

  createDraft(operatorId: string, payload: QuoteHeaderPayload) {
    return this.service.createDraft(operatorId, payload)
  }

  updateHeader(id: string, payload: QuoteHeaderPayload) {
    return this.service.updateHeader(id, payload)
  }

  markAsSent(id: string) {
    return this.service.markAsSent(id)
  }

  archive(id: string) {
    return this.service.archive(id)
  }

  reopenAsDraft(id: string) {
    return this.service.reopenAsDraft(id)
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

  addItem(quoteId: string, payload: Parameters<QuoteItemsService["addItem"]>[1]) {
    return this.itemsService.addItem(quoteId, payload)
  }

  addSpecialItem(
    quoteId: string,
    payload: Parameters<QuoteItemsService["addSpecialItem"]>[1],
  ) {
    return this.itemsService.addSpecialItem(quoteId, payload)
  }

  updateItem(itemId: string, payload: Parameters<QuoteItemsService["updateItem"]>[1]) {
    return this.itemsService.updateItem(itemId, payload)
  }

  removeItem(itemId: string) {
    return this.itemsService.removeItem(itemId)
  }
}

export async function createServerQuotesController() {
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

  return new QuotesController(quotesSvc, itemsSvc)
}
