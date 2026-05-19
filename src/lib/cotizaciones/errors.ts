import { NextResponse } from "next/server"
import { z } from "zod"

import {
  CotizacionesNotFoundException,
  CotizacionesServiceException,
  CotizacionesValidationException,
} from "@/exceptions/cotizaciones/cotizaciones.exceptions"
import {
  CotizacionesItemsNotFoundException,
  CotizacionesItemsServiceException,
  CotizacionesItemsValidationException,
} from "@/exceptions/cotizaciones-items/cotizaciones-items.exceptions"
import {
  CotizadorCategoriasNotFoundException,
  CotizadorCategoriasServiceException,
  CotizadorCategoriasValidationException,
} from "@/exceptions/cotizador-categorias/cotizador-categorias.exceptions"
import {
  CotizadorPreciosNotFoundException,
  CotizadorPreciosServiceException,
  CotizadorPreciosValidationException,
} from "@/exceptions/cotizador-precios/cotizador-precios.exceptions"
import {
  CotizadorServiciosNotFoundException,
  CotizadorServiciosServiceException,
  CotizadorServiciosValidationException,
} from "@/exceptions/cotizador-servicios/cotizador-servicios.exceptions"

export function handleCotizadorError(error: unknown): NextResponse {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: "Datos inválidos", details: error.issues },
      { status: 400 },
    )
  }
  if (
    error instanceof CotizacionesValidationException ||
    error instanceof CotizacionesItemsValidationException ||
    error instanceof CotizadorCategoriasValidationException ||
    error instanceof CotizadorServiciosValidationException ||
    error instanceof CotizadorPreciosValidationException
  ) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  if (
    error instanceof CotizacionesNotFoundException ||
    error instanceof CotizacionesItemsNotFoundException ||
    error instanceof CotizadorCategoriasNotFoundException ||
    error instanceof CotizadorServiciosNotFoundException ||
    error instanceof CotizadorPreciosNotFoundException
  ) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }
  if (
    error instanceof CotizacionesServiceException ||
    error instanceof CotizacionesItemsServiceException ||
    error instanceof CotizadorCategoriasServiceException ||
    error instanceof CotizadorServiciosServiceException ||
    error instanceof CotizadorPreciosServiceException
  ) {
    console.error("cotizador service error", error)
    return NextResponse.json({ error: "No se pudo procesar la solicitud" }, { status: 500 })
  }
  console.error("cotizador unknown error", error)
  return NextResponse.json({ error: "Error desconocido" }, { status: 500 })
}
