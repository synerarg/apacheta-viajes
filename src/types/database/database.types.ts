import type { SupabaseClient } from "@supabase/supabase-js"

import type {
  OperatorsInsert,
  OperatorsRow,
  OperatorsUpdate,
} from "@/types/operators/operators.types"
import type {
  OperatorTypesInsert,
  OperatorTypesRow,
  OperatorTypesUpdate,
} from "@/types/operator-types/operator-types.types"
import type {
  ExperienceCategoriesInsert,
  ExperienceCategoriesRow,
  ExperienceCategoriesUpdate,
} from "@/types/experience-categories/experience-categories.types"
import type {
  CheckoutProfilesInsert,
  CheckoutProfilesRow,
  CheckoutProfilesUpdate,
} from "@/types/checkout-profiles/checkout-profiles.types"
import type {
  DestinationsInsert,
  DestinationsRow,
  DestinationsUpdate,
} from "@/types/destinations/destinations.types"
import type {
  OutboundDestinationsInsert,
  OutboundDestinationsRow,
  OutboundDestinationsUpdate,
} from "@/types/outbound-destinations/outbound-destinations.types"
import type {
  OutboundImagesInsert,
  OutboundImagesRow,
  OutboundImagesUpdate,
} from "@/types/outbound-images/outbound-images.types"
import type {
  HomeStatisticsInsert,
  HomeStatisticsRow,
  HomeStatisticsUpdate,
} from "@/types/home-statistics/home-statistics.types"
import type {
  ExperiencesInsert,
  ExperiencesRow,
  ExperiencesUpdate,
} from "@/types/experiences/experiences.types"
import type {
  ExperienceImagesInsert,
  ExperienceImagesRow,
  ExperienceImagesUpdate,
} from "@/types/experience-images/experience-images.types"
import type {
  HotelsInsert,
  HotelsRow,
  HotelsUpdate,
} from "@/types/hotels/hotels.types"
import type {
  HotelImagesInsert,
  HotelImagesRow,
  HotelImagesUpdate,
} from "@/types/hotel-images/hotel-images.types"
import type {
  HyperGuestBookingIntentsInsert,
  HyperGuestBookingIntentsRow,
  HyperGuestBookingIntentsUpdate,
  HyperGuestEventsInsert,
  HyperGuestEventsRow,
  HyperGuestEventsUpdate,
  HyperGuestHotelMappingsInsert,
  HyperGuestHotelMappingsRow,
  HyperGuestHotelMappingsUpdate,
} from "@/types/hyperguest/hyperguest.types"
import type {
  OrdersInsert,
  OrdersRow,
  OrdersUpdate,
} from "@/types/orders/orders.types"
import type {
  OrderItemsInsert,
  OrderItemsRow,
  OrderItemsUpdate,
} from "@/types/order-items/order-items.types"
import type {
  PackageCategoriesInsert,
  PackageCategoriesRow,
  PackageCategoriesUpdate,
} from "@/types/package-categories/package-categories.types"
import type {
  PackageDatesInsert,
  PackageDatesRow,
  PackageDatesUpdate,
} from "@/types/package-dates/package-dates.types"
import type {
  PackageImagesInsert,
  PackageImagesRow,
  PackageImagesUpdate,
} from "@/types/package-images/package-images.types"
import type {
  PackageItineraryInsert,
  PackageItineraryRow,
  PackageItineraryUpdate,
} from "@/types/package-itinerary/package-itinerary.types"
import type {
  PackagesInsert,
  PackagesRow,
  PackagesUpdate,
} from "@/types/packages/packages.types"
import type {
  PaymentsInsert,
  PaymentsRow,
  PaymentsUpdate,
} from "@/types/payments/payments.types"
import type {
  PaymentEventsInsert,
  PaymentEventsRow,
  PaymentEventsUpdate,
} from "@/types/payment-events/payment-events.types"
import type {
  ReservationsInsert,
  ReservationsRow,
  ReservationsUpdate,
} from "@/types/reservations/reservations.types"
import type {
  ContactRequestsInsert,
  ContactRequestsRow,
  ContactRequestsUpdate,
} from "@/types/contact-requests/contact-requests.types"
import type {
  OperatorRequestsInsert,
  OperatorRequestsRow,
  OperatorRequestsUpdate,
} from "@/types/operator-requests/operator-requests.types"
import type {
  QuoterCategoriesInsert,
  QuoterCategoriesRow,
  QuoterCategoriesUpdate,
} from "@/types/quoter-categories/quoter-categories.types"
import type {
  QuoterServicesInsert,
  QuoterServicesRow,
  QuoterServicesUpdate,
} from "@/types/quoter-services/quoter-services.types"
import type {
  QuoterPricesInsert,
  QuoterPricesRow,
  QuoterPricesUpdate,
} from "@/types/quoter-prices/quoter-prices.types"
import type {
  QuotesInsert,
  QuotesRow,
  QuotesUpdate,
} from "@/types/quotes/quotes.types"
import type {
  QuoteItemsInsert,
  QuoteItemsRow,
  QuoteItemsUpdate,
} from "@/types/quote-items/quote-items.types"
import type {
  TransfersInsert,
  TransfersRow,
  TransfersUpdate,
} from "@/types/transfers/transfers.types"
import type {
  TransferImagesInsert,
  TransferImagesRow,
  TransferImagesUpdate,
} from "@/types/transfer-images/transfer-images.types"
import type {
  TransferRatesInsert,
  TransferRatesRow,
  TransferRatesUpdate,
} from "@/types/transfer-rates/transfer-rates.types"
import type {
  UsersInsert,
  UsersRow,
  UsersUpdate,
} from "@/types/users/users.types"

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      operadores: {
        Row: OperatorsRow
        Insert: OperatorsInsert
        Update: OperatorsUpdate
        Relationships: [
          {
            foreignKeyName: "operadores_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operadores_tipo_operador_id_fkey"
            columns: ["tipo_operador_id"]
            isOneToOne: false
            referencedRelation: "tipos_operador"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_operador: {
        Row: OperatorTypesRow
        Insert: OperatorTypesInsert
        Update: OperatorTypesUpdate
        Relationships: []
      }
      categorias_experiencia: {
        Row: ExperienceCategoriesRow
        Insert: ExperienceCategoriesInsert
        Update: ExperienceCategoriesUpdate
        Relationships: []
      }
      checkout_profiles: {
        Row: CheckoutProfilesRow
        Insert: CheckoutProfilesInsert
        Update: CheckoutProfilesUpdate
        Relationships: [
          {
            foreignKeyName: "checkout_profiles_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      destinos: {
        Row: DestinationsRow
        Insert: DestinationsInsert
        Update: DestinationsUpdate
        Relationships: []
      }
      emisivo_destinos: {
        Row: OutboundDestinationsRow
        Insert: OutboundDestinationsInsert
        Update: OutboundDestinationsUpdate
        Relationships: []
      }
      emisivo_imagenes: {
        Row: OutboundImagesRow
        Insert: OutboundImagesInsert
        Update: OutboundImagesUpdate
        Relationships: [
          {
            foreignKeyName: "emisivo_imagenes_emisivo_destino_id_fkey"
            columns: ["emisivo_destino_id"]
            isOneToOne: false
            referencedRelation: "emisivo_destinos"
            referencedColumns: ["id"]
          },
        ]
      }
      estadisticas_home: {
        Row: HomeStatisticsRow
        Insert: HomeStatisticsInsert
        Update: HomeStatisticsUpdate
        Relationships: []
      }
      experiencias: {
        Row: ExperiencesRow
        Insert: ExperiencesInsert
        Update: ExperiencesUpdate
        Relationships: [
          {
            foreignKeyName: "experiencias_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_experiencia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experiencias_destino_id_fkey"
            columns: ["destino_id"]
            isOneToOne: false
            referencedRelation: "destinos"
            referencedColumns: ["id"]
          },
        ]
      }
      experiencias_imagenes: {
        Row: ExperienceImagesRow
        Insert: ExperienceImagesInsert
        Update: ExperienceImagesUpdate
        Relationships: [
          {
            foreignKeyName: "experiencias_imagenes_experiencia_id_fkey"
            columns: ["experiencia_id"]
            isOneToOne: false
            referencedRelation: "experiencias"
            referencedColumns: ["id"]
          },
        ]
      }
      hoteles: {
        Row: HotelsRow
        Insert: HotelsInsert
        Update: HotelsUpdate
        Relationships: [
          {
            foreignKeyName: "hoteles_destino_id_fkey"
            columns: ["destino_id"]
            isOneToOne: false
            referencedRelation: "destinos"
            referencedColumns: ["id"]
          },
        ]
      }
      hoteles_imagenes: {
        Row: HotelImagesRow
        Insert: HotelImagesInsert
        Update: HotelImagesUpdate
        Relationships: [
          {
            foreignKeyName: "hoteles_imagenes_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hoteles"
            referencedColumns: ["id"]
          },
        ]
      }
      hyperguest_booking_intents: {
        Row: HyperGuestBookingIntentsRow
        Insert: HyperGuestBookingIntentsInsert
        Update: HyperGuestBookingIntentsUpdate
        Relationships: [
          {
            foreignKeyName: "hyperguest_booking_intents_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hoteles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hyperguest_booking_intents_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      hyperguest_events: {
        Row: HyperGuestEventsRow
        Insert: HyperGuestEventsInsert
        Update: HyperGuestEventsUpdate
        Relationships: [
          {
            foreignKeyName: "hyperguest_events_booking_intent_id_fkey"
            columns: ["booking_intent_id"]
            isOneToOne: false
            referencedRelation: "hyperguest_booking_intents"
            referencedColumns: ["id"]
          },
        ]
      }
      hyperguest_hotel_mappings: {
        Row: HyperGuestHotelMappingsRow
        Insert: HyperGuestHotelMappingsInsert
        Update: HyperGuestHotelMappingsUpdate
        Relationships: [
          {
            foreignKeyName: "hyperguest_hotel_mappings_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: true
            referencedRelation: "hoteles"
            referencedColumns: ["id"]
          },
        ]
      }
      ordenes: {
        Row: OrdersRow
        Insert: OrdersInsert
        Update: OrdersUpdate
        Relationships: [
          {
            foreignKeyName: "ordenes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      ordenes_items: {
        Row: OrderItemsRow
        Insert: OrderItemsInsert
        Update: OrderItemsUpdate
        Relationships: [
          {
            foreignKeyName: "ordenes_items_orden_id_fkey"
            columns: ["orden_id"]
            isOneToOne: false
            referencedRelation: "ordenes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordenes_items_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
        ]
      }
      paquetes: {
        Row: PackagesRow
        Insert: PackagesInsert
        Update: PackagesUpdate
        Relationships: [
          {
            foreignKeyName: "paquetes_destino_id_fkey"
            columns: ["destino_id"]
            isOneToOne: false
            referencedRelation: "destinos"
            referencedColumns: ["id"]
          },
        ]
      }
      paquetes_categorias: {
        Row: PackageCategoriesRow
        Insert: PackageCategoriesInsert
        Update: PackageCategoriesUpdate
        Relationships: [
          {
            foreignKeyName: "paquetes_categorias_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_experiencia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paquetes_categorias_paquete_id_fkey"
            columns: ["paquete_id"]
            isOneToOne: false
            referencedRelation: "paquetes"
            referencedColumns: ["id"]
          },
        ]
      }
      paquetes_fechas: {
        Row: PackageDatesRow
        Insert: PackageDatesInsert
        Update: PackageDatesUpdate
        Relationships: [
          {
            foreignKeyName: "paquetes_fechas_paquete_id_fkey"
            columns: ["paquete_id"]
            isOneToOne: false
            referencedRelation: "paquetes"
            referencedColumns: ["id"]
          },
        ]
      }
      paquetes_imagenes: {
        Row: PackageImagesRow
        Insert: PackageImagesInsert
        Update: PackageImagesUpdate
        Relationships: [
          {
            foreignKeyName: "paquetes_imagenes_paquete_id_fkey"
            columns: ["paquete_id"]
            isOneToOne: false
            referencedRelation: "paquetes"
            referencedColumns: ["id"]
          },
        ]
      }
      paquetes_itinerario: {
        Row: PackageItineraryRow
        Insert: PackageItineraryInsert
        Update: PackageItineraryUpdate
        Relationships: [
          {
            foreignKeyName: "paquetes_itinerario_paquete_id_fkey"
            columns: ["paquete_id"]
            isOneToOne: false
            referencedRelation: "paquetes"
            referencedColumns: ["id"]
          },
        ]
      }
      pagos: {
        Row: PaymentsRow
        Insert: PaymentsInsert
        Update: PaymentsUpdate
        Relationships: [
          {
            foreignKeyName: "pagos_orden_id_fkey"
            columns: ["orden_id"]
            isOneToOne: false
            referencedRelation: "ordenes"
            referencedColumns: ["id"]
          },
        ]
      }
      pagos_eventos: {
        Row: PaymentEventsRow
        Insert: PaymentEventsInsert
        Update: PaymentEventsUpdate
        Relationships: [
          {
            foreignKeyName: "pagos_eventos_pago_id_fkey"
            columns: ["pago_id"]
            isOneToOne: false
            referencedRelation: "pagos"
            referencedColumns: ["id"]
          },
        ]
      }
      reservas: {
        Row: ReservationsRow
        Insert: ReservationsInsert
        Update: ReservationsUpdate
        Relationships: [
          {
            foreignKeyName: "reservas_experiencia_id_fkey"
            columns: ["experiencia_id"]
            isOneToOne: false
            referencedRelation: "experiencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_paquete_fecha_id_fkey"
            columns: ["paquete_fecha_id"]
            isOneToOne: false
            referencedRelation: "paquetes_fechas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitudes_contacto: {
        Row: ContactRequestsRow
        Insert: ContactRequestsInsert
        Update: ContactRequestsUpdate
        Relationships: []
      }
      solicitudes_operador: {
        Row: OperatorRequestsRow
        Insert: OperatorRequestsInsert
        Update: OperatorRequestsUpdate
        Relationships: [
          {
            foreignKeyName: "solicitudes_operador_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_operador_revisado_por_fkey"
            columns: ["revisado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_operador_tipo_operador_id_fkey"
            columns: ["tipo_operador_id"]
            isOneToOne: false
            referencedRelation: "tipos_operador"
            referencedColumns: ["id"]
          },
        ]
      }
      cotizador_categorias: {
        Row: QuoterCategoriesRow
        Insert: QuoterCategoriesInsert
        Update: QuoterCategoriesUpdate
        Relationships: []
      }
      cotizador_servicios: {
        Row: QuoterServicesRow
        Insert: QuoterServicesInsert
        Update: QuoterServicesUpdate
        Relationships: [
          {
            foreignKeyName: "cotizador_servicios_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "cotizador_categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      cotizador_servicio_precios: {
        Row: QuoterPricesRow
        Insert: QuoterPricesInsert
        Update: QuoterPricesUpdate
        Relationships: [
          {
            foreignKeyName: "cotizador_servicio_precios_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "cotizador_servicios"
            referencedColumns: ["id"]
          },
        ]
      }
      cotizaciones: {
        Row: QuotesRow
        Insert: QuotesInsert
        Update: QuotesUpdate
        Relationships: [
          {
            foreignKeyName: "cotizaciones_operador_id_fkey"
            columns: ["operador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      cotizaciones_items: {
        Row: QuoteItemsRow
        Insert: QuoteItemsInsert
        Update: QuoteItemsUpdate
        Relationships: [
          {
            foreignKeyName: "cotizaciones_items_cotizacion_id_fkey"
            columns: ["cotizacion_id"]
            isOneToOne: false
            referencedRelation: "cotizaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cotizaciones_items_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "cotizador_servicios"
            referencedColumns: ["id"]
          },
        ]
      }
      traslados: {
        Row: TransfersRow
        Insert: TransfersInsert
        Update: TransfersUpdate
        Relationships: [
          {
            foreignKeyName: "traslados_destino_id_fkey"
            columns: ["destino_id"]
            isOneToOne: false
            referencedRelation: "destinos"
            referencedColumns: ["id"]
          },
        ]
      }
      traslados_imagenes: {
        Row: TransferImagesRow
        Insert: TransferImagesInsert
        Update: TransferImagesUpdate
        Relationships: [
          {
            foreignKeyName: "traslados_imagenes_traslado_id_fkey"
            columns: ["traslado_id"]
            isOneToOne: false
            referencedRelation: "traslados"
            referencedColumns: ["id"]
          },
        ]
      }
      traslados_tarifas: {
        Row: TransferRatesRow
        Insert: TransferRatesInsert
        Update: TransferRatesUpdate
        Relationships: [
          {
            foreignKeyName: "traslados_tarifas_traslado_id_fkey"
            columns: ["traslado_id"]
            isOneToOne: false
            referencedRelation: "traslados"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: UsersRow
        Insert: UsersInsert
        Update: UsersUpdate
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type PublicSchema = Database["public"]
export type PublicTables = PublicSchema["Tables"]
export type PublicTableName = keyof PublicTables
export type TableRow<TTableName extends PublicTableName> =
  PublicTables[TTableName]["Row"]
export type TableInsert<TTableName extends PublicTableName> =
  PublicTables[TTableName]["Insert"]
export type TableUpdate<TTableName extends PublicTableName> =
  PublicTables[TTableName]["Update"]
export type TableFilters<TTableName extends PublicTableName> = Partial<
  TableRow<TTableName>
>
export type DatabaseClient = SupabaseClient<Database>
