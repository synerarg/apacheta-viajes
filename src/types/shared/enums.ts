// Enums compartidos — espejo de los tipos de base de datos de PostgreSQL

export type UsuarioTipo = "cliente" | "agencia" | "admin"

export type OrdenEstado =
  | "pendiente"
  | "pago_pendiente"
  | "pago_reportado"
  | "pagada"
  | "confirmada"
  | "cancelada"
  | "completada"

export type PagoEstado =
  | "pending"
  | "requires_action"
  | "reported"
  | "approved"
  | "rejected"
  | "cancelled"
  | "expired"

export type MetodoPago =
  | "mercadopago_checkout_pro"
  | "bank_transfer"
  | "cash_local"

export type PagoProveedor = "mercadopago" | "bank_transfer" | "cash_local"

export type ReservaTipo = "paquete" | "experiencia"

export type ReservaEstado =
  | "pendiente"
  | "confirmada"
  | "pagada"
  | "completada"
  | "cancelada"

export type SolicitudEstado = "nuevo" | "en_proceso" | "respondido" | "cerrado"

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
