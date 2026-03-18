import type { SupabaseClient } from "@supabase/supabase-js"

import type {
  AgenciasInsert,
  AgenciasRow,
  AgenciasUpdate,
} from "@/types/agencias/agencias.types"
import type {
  CategoriasExperienciaInsert,
  CategoriasExperienciaRow,
  CategoriasExperienciaUpdate,
} from "@/types/categorias-experiencia/categorias-experiencia.types"
import type {
  DestinosInsert,
  DestinosRow,
  DestinosUpdate,
} from "@/types/destinos/destinos.types"
import type {
  EmisivoDestinosInsert,
  EmisivoDestinosRow,
  EmisivoDestinosUpdate,
} from "@/types/emisivo-destinos/emisivo-destinos.types"
import type {
  EmisivoImagenesInsert,
  EmisivoImagenesRow,
  EmisivoImagenesUpdate,
} from "@/types/emisivo-imagenes/emisivo-imagenes.types"
import type {
  EstadisticasHomeInsert,
  EstadisticasHomeRow,
  EstadisticasHomeUpdate,
} from "@/types/estadisticas-home/estadisticas-home.types"
import type {
  ExperienciasInsert,
  ExperienciasRow,
  ExperienciasUpdate,
} from "@/types/experiencias/experiencias.types"
import type {
  ExperienciasImagenesInsert,
  ExperienciasImagenesRow,
  ExperienciasImagenesUpdate,
} from "@/types/experiencias-imagenes/experiencias-imagenes.types"
import type {
  HotelesInsert,
  HotelesRow,
  HotelesUpdate,
} from "@/types/hoteles/hoteles.types"
import type {
  HotelesImagenesInsert,
  HotelesImagenesRow,
  HotelesImagenesUpdate,
} from "@/types/hoteles-imagenes/hoteles-imagenes.types"
import type {
  OrdenesInsert,
  OrdenesRow,
  OrdenesUpdate,
} from "@/types/ordenes/ordenes.types"
import type {
  OrdenesItemsInsert,
  OrdenesItemsRow,
  OrdenesItemsUpdate,
} from "@/types/ordenes-items/ordenes-items.types"
import type {
  PaquetesCategoriasInsert,
  PaquetesCategoriasRow,
  PaquetesCategoriasUpdate,
} from "@/types/paquetes-categorias/paquetes-categorias.types"
import type {
  PaquetesFechasInsert,
  PaquetesFechasRow,
  PaquetesFechasUpdate,
} from "@/types/paquetes-fechas/paquetes-fechas.types"
import type {
  PaquetesImagenesInsert,
  PaquetesImagenesRow,
  PaquetesImagenesUpdate,
} from "@/types/paquetes-imagenes/paquetes-imagenes.types"
import type {
  PaquetesItinerarioInsert,
  PaquetesItinerarioRow,
  PaquetesItinerarioUpdate,
} from "@/types/paquetes-itinerario/paquetes-itinerario.types"
import type {
  PaquetesInsert,
  PaquetesRow,
  PaquetesUpdate,
} from "@/types/paquetes/paquetes.types"
import type {
  PagosInsert,
  PagosRow,
  PagosUpdate,
} from "@/types/pagos/pagos.types"
import type {
  PagosEventosInsert,
  PagosEventosRow,
  PagosEventosUpdate,
} from "@/types/pagos-eventos/pagos-eventos.types"
import type {
  ReservasInsert,
  ReservasRow,
  ReservasUpdate,
} from "@/types/reservas/reservas.types"
import type {
  SolicitudesContactoInsert,
  SolicitudesContactoRow,
  SolicitudesContactoUpdate,
} from "@/types/solicitudes-contacto/solicitudes-contacto.types"
import type {
  UsuariosInsert,
  UsuariosRow,
  UsuariosUpdate,
} from "@/types/usuarios/usuarios.types"

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
      agencias: {
        Row: AgenciasRow
        Insert: AgenciasInsert
        Update: AgenciasUpdate
        Relationships: [
          {
            foreignKeyName: "agencias_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias_experiencia: {
        Row: CategoriasExperienciaRow
        Insert: CategoriasExperienciaInsert
        Update: CategoriasExperienciaUpdate
        Relationships: []
      }
      destinos: {
        Row: DestinosRow
        Insert: DestinosInsert
        Update: DestinosUpdate
        Relationships: []
      }
      emisivo_destinos: {
        Row: EmisivoDestinosRow
        Insert: EmisivoDestinosInsert
        Update: EmisivoDestinosUpdate
        Relationships: []
      }
      emisivo_imagenes: {
        Row: EmisivoImagenesRow
        Insert: EmisivoImagenesInsert
        Update: EmisivoImagenesUpdate
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
        Row: EstadisticasHomeRow
        Insert: EstadisticasHomeInsert
        Update: EstadisticasHomeUpdate
        Relationships: []
      }
      experiencias: {
        Row: ExperienciasRow
        Insert: ExperienciasInsert
        Update: ExperienciasUpdate
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
        Row: ExperienciasImagenesRow
        Insert: ExperienciasImagenesInsert
        Update: ExperienciasImagenesUpdate
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
        Row: HotelesRow
        Insert: HotelesInsert
        Update: HotelesUpdate
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
        Row: HotelesImagenesRow
        Insert: HotelesImagenesInsert
        Update: HotelesImagenesUpdate
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
      ordenes: {
        Row: OrdenesRow
        Insert: OrdenesInsert
        Update: OrdenesUpdate
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
        Row: OrdenesItemsRow
        Insert: OrdenesItemsInsert
        Update: OrdenesItemsUpdate
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
        Row: PaquetesRow
        Insert: PaquetesInsert
        Update: PaquetesUpdate
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
        Row: PaquetesCategoriasRow
        Insert: PaquetesCategoriasInsert
        Update: PaquetesCategoriasUpdate
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
        Row: PaquetesFechasRow
        Insert: PaquetesFechasInsert
        Update: PaquetesFechasUpdate
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
        Row: PaquetesImagenesRow
        Insert: PaquetesImagenesInsert
        Update: PaquetesImagenesUpdate
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
        Row: PaquetesItinerarioRow
        Insert: PaquetesItinerarioInsert
        Update: PaquetesItinerarioUpdate
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
        Row: PagosRow
        Insert: PagosInsert
        Update: PagosUpdate
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
        Row: PagosEventosRow
        Insert: PagosEventosInsert
        Update: PagosEventosUpdate
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
        Row: ReservasRow
        Insert: ReservasInsert
        Update: ReservasUpdate
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
        Row: SolicitudesContactoRow
        Insert: SolicitudesContactoInsert
        Update: SolicitudesContactoUpdate
        Relationships: []
      }
      usuarios: {
        Row: UsuariosRow
        Insert: UsuariosInsert
        Update: UsuariosUpdate
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
