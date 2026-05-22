// Enums compartidos — espejo de los tipos de base de datos de PostgreSQL

export type UserType = "cliente" | "operador" | "admin"

export type OrderStatus =
  | "pendiente"
  | "pago_pendiente"
  | "pago_reportado"
  | "pagada"
  | "confirmada"
  | "cancelada"
  | "completada"

export type PaymentStatus =
  | "pending"
  | "requires_action"
  | "reported"
  | "approved"
  | "rejected"
  | "cancelled"
  | "expired"

export type PaymentMethod =
  | "mercadopago_checkout_pro"
  | "bank_transfer"
  | "cash_local"

export type PaymentProvider = "mercadopago" | "bank_transfer" | "cash_local"

export type ReservationType = "paquete" | "experiencia"

export type ReservationStatus =
  | "pendiente"
  | "confirmada"
  | "pagada"
  | "completada"
  | "cancelada"

export type RequestStatus = "nuevo" | "en_proceso" | "respondido" | "cerrado"

export type OperatorRequestStatus =
  | "pendiente"
  | "en_revision"
  | "aprobada"
  | "rechazada"
  | "cancelada"

export type MealPlan =
  | "desayuno"
  | "media_pension"
  | "pension_completa"
  | "all_inclusive"

export type Moneda =
  | "ARS"
  | "USD"
  | "EUR"
  | "BRL"
  | "MXN"
  | "CLP"
  | "COP"
  | "PEN"
  | "UYU"
