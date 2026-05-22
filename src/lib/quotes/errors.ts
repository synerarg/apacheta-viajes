import { NextResponse } from "next/server"
import { z } from "zod"

import {
  QuotesNotFoundException,
  QuotesServiceException,
  QuotesValidationException,
} from "@/exceptions/quotes/quotes.exceptions"
import {
  QuoteItemsNotFoundException,
  QuoteItemsServiceException,
  QuoteItemsValidationException,
} from "@/exceptions/quote-items/quote-items.exceptions"
import {
  QuoterCategoriesNotFoundException,
  QuoterCategoriesServiceException,
  QuoterCategoriesValidationException,
} from "@/exceptions/quoter-categories/quoter-categories.exceptions"
import {
  QuoterPricesNotFoundException,
  QuoterPricesServiceException,
  QuoterPricesValidationException,
} from "@/exceptions/quoter-prices/quoter-prices.exceptions"
import {
  QuoterServicesNotFoundException,
  QuoterServicesServiceException,
  QuoterServicesValidationException,
} from "@/exceptions/quoter-services/quoter-services.exceptions"

export function handleQuoterError(error: unknown): NextResponse {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: "Datos inválidos", details: error.issues },
      { status: 400 },
    )
  }
  if (
    error instanceof QuotesValidationException ||
    error instanceof QuoteItemsValidationException ||
    error instanceof QuoterCategoriesValidationException ||
    error instanceof QuoterServicesValidationException ||
    error instanceof QuoterPricesValidationException
  ) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  if (
    error instanceof QuotesNotFoundException ||
    error instanceof QuoteItemsNotFoundException ||
    error instanceof QuoterCategoriesNotFoundException ||
    error instanceof QuoterServicesNotFoundException ||
    error instanceof QuoterPricesNotFoundException
  ) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }
  if (
    error instanceof QuotesServiceException ||
    error instanceof QuoteItemsServiceException ||
    error instanceof QuoterCategoriesServiceException ||
    error instanceof QuoterServicesServiceException ||
    error instanceof QuoterPricesServiceException
  ) {
    console.error("cotizador service error", error)
    return NextResponse.json({ error: "No se pudo procesar la solicitud" }, { status: 500 })
  }
  console.error("cotizador unknown error", error)
  return NextResponse.json({ error: "Error desconocido" }, { status: 500 })
}
