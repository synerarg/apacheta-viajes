const EXACT_MESSAGE_MAP: Record<string, string> = {
  "Authenticated user email is required":
    "No pudimos recuperar el correo de la cuenta autenticada.",
  "At least one filter is required":
    "Faltan datos para completar la operacion.",
  "Bank transfer confirmation failed":
    "No se pudo confirmar la transferencia bancaria.",
  "Bank transfer initialization failed":
    "No se pudo iniciar la transferencia bancaria.",
  "Cart is empty": "Tu carrito esta vacio.",
  "Checkout failed": "No se pudo iniciar la reserva.",
  "Checkout Pro failed": "No se pudo iniciar el pago con Mercado Pago.",
  "Checkout requires an authenticated user":
    "Necesitas iniciar sesion para continuar.",
  "Experience checkout items require experienciaId":
    "La experiencia seleccionada no es valida.",
  "Invalid checkout payload": "Los datos del checkout no son validos.",
  "No record returned after insert": "No se pudo completar la operacion.",
  "Order not found": "No encontramos la orden solicitada.",
  "Package checkout items require paqueteFechaId":
    "El paquete seleccionado no tiene una salida valida.",
  "Payment does not belong to the authenticated user":
    "No tenes permiso para acceder a este comprobante.",
  "Selected experience does not have a valid price":
    "La experiencia seleccionada no tiene un precio valido.",
  "Selected experience is inactive":
    "La experiencia seleccionada ya no esta disponible.",
  "Selected package date is inactive":
    "La salida seleccionada ya no esta disponible.",
  "Selected passenger count exceeds the available capacity":
    "La cantidad de pasajeros supera la disponibilidad actual.",
  "Supabase did not return a signed receipt URL":
    "No se pudo generar el acceso al comprobante.",
  "Supabase did not return a signed upload token":
    "No se pudo preparar la carga del comprobante.",
  "Supabase did not return the uploaded receipt object":
    "No se pudo validar el comprobante cargado.",
  "Unauthorized": "No autorizado.",
  "Unable to load order": "No se pudo cargar la orden.",
  "Unsupported checkout payment method":
    "El medio de pago seleccionado no esta disponible.",
}

const CONTAINS_MESSAGE_MAP: Array<[string, string]> = [
  [
    "For security purposes, you can only request this once every",
    "Espera unos segundos antes de solicitar otro codigo.",
  ],
  [
    "Invalid login credentials",
    "El codigo o los datos ingresados no son validos.",
  ],
  [
    "Missing environment variable:",
    "Falta una variable de entorno requerida para completar la operacion.",
  ],
  [
    "Network request failed",
    "No se pudo conectar. Revisa tu conexion e intentalo nuevamente.",
  ],
  [
    "Repository error in ",
    "Ocurrio un error interno al procesar la operacion.",
  ],
  [
    "Service error in ",
    "Ocurrio un error interno al procesar la operacion.",
  ],
  [
    "Token has expired or is invalid",
    "El codigo ingreso vencio o no es valido.",
  ],
  [
    "TypeError: Failed to fetch",
    "No se pudo conectar. Revisa tu conexion e intentalo nuevamente.",
  ],
  [
    "not found (",
    "No encontramos la informacion solicitada.",
  ],
]

function normalizeWhitespace(value: string) {
  return value.trim().replace(/\s+/g, " ")
}

export function getUserFacingErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!(error instanceof Error)) {
    return fallback
  }

  const normalizedMessage = normalizeWhitespace(error.message)

  if (!normalizedMessage) {
    return fallback
  }

  const exactMatch = EXACT_MESSAGE_MAP[normalizedMessage]

  if (exactMatch) {
    return exactMatch
  }

  const containsMatch = CONTAINS_MESSAGE_MAP.find(([pattern]) =>
    normalizedMessage.includes(pattern),
  )

  if (containsMatch) {
    return containsMatch[1]
  }

  return normalizedMessage
}
