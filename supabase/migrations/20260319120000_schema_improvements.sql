-- ============================================================
-- Migration: Schema improvements
--
-- Changes:
--   1. Enums para todos los campos con valores fijos
--   2. varchar → text en todas las tablas
--   3. Trigger function set_updated_at() + triggers en todas las tablas
--   4. Trigger manage_cupo_disponible() para gestión automática de cupos
--   5. Función slugify() como utilidad de base de datos
--   6. Índices para los patrones de consulta más comunes
-- ============================================================


-- ============================================================
-- 1. ENUMS
-- ============================================================

create type public.usuario_tipo as enum (
  'cliente',
  'agencia',
  'admin'
);

create type public.orden_estado as enum (
  'pendiente',
  'pago_pendiente',
  'pago_reportado',
  'pagada',
  'confirmada',
  'cancelada',
  'completada'
);

create type public.pago_estado as enum (
  'pending',
  'requires_action',
  'reported',
  'approved',
  'rejected',
  'cancelled',
  'expired'
);

create type public.metodo_pago as enum (
  'mercadopago_checkout_pro',
  'bank_transfer',
  'cash_local'
);

create type public.pago_proveedor as enum (
  'mercadopago',
  'bank_transfer',
  'cash_local'
);

create type public.reserva_tipo as enum (
  'paquete',
  'experiencia'
);

create type public.reserva_estado as enum (
  'pendiente',
  'confirmada',
  'pagada',
  'completada',
  'cancelada'
);

create type public.solicitud_estado as enum (
  'nuevo',
  'en_proceso',
  'respondido',
  'cerrado'
);

create type public.moneda as enum (
  'ARS',
  'USD',
  'EUR',
  'BRL',
  'MXN',
  'CLP',
  'COP',
  'PEN',
  'UYU'
);


-- ============================================================
-- 2. varchar → text + columnas a enums
--
-- NOTA: Para columnas con DEFAULT que se convierten a enum,
-- PostgreSQL requiere tres pasos separados:
--   1. DROP DEFAULT
--   2. ALTER TYPE con USING
--   3. SET DEFAULT con cast explícito al enum
-- ============================================================

-- Dropear triggers preexistentes que puedan bloquear el cambio de tipos
-- (nuestros nuevos triggers los reemplazan)
drop trigger if exists trg_descontar_cupo          on public.reservas;
drop trigger if exists trg_devolver_cupo           on public.reservas;
drop trigger if exists trg_manage_cupo             on public.reservas;
drop trigger if exists set_updated_at              on public.usuarios;
drop trigger if exists set_updated_at              on public.agencias;
drop trigger if exists set_updated_at              on public.emisivo_destinos;
drop trigger if exists set_updated_at              on public.paquetes;
drop trigger if exists set_updated_at              on public.paquetes_fechas;
drop trigger if exists set_updated_at              on public.experiencias;
drop trigger if exists set_updated_at              on public.hoteles;
drop trigger if exists set_updated_at              on public.ordenes;
drop trigger if exists set_updated_at              on public.ordenes_items;
drop trigger if exists set_updated_at              on public.pagos;
drop trigger if exists set_updated_at              on public.reservas;
drop trigger if exists set_updated_at              on public.solicitudes_contacto;
drop function if exists public.descontar_cupo();

-- ── usuarios ─────────────────────────────────────────────────
alter table public.usuarios
  alter column nombre     type text,
  alter column apellido   type text,
  alter column email      type text,
  alter column avatar_url type text;

alter table public.usuarios
  alter column tipo drop default;

alter table public.usuarios
  alter column tipo type public.usuario_tipo
    using tipo::text::public.usuario_tipo;

alter table public.usuarios
  alter column tipo set default 'cliente'::public.usuario_tipo;

-- ── agencias ─────────────────────────────────────────────────
alter table public.agencias
  alter column nombre          type text,
  alter column email           type text,
  alter column ciudad          type text,
  alter column provincia       type text,
  alter column contacto_nombre type text;

-- ── destinos ─────────────────────────────────────────────────
alter table public.destinos
  alter column nombre            type text,
  alter column slug              type text,
  alter column descripcion_corta type text,
  alter column provincia         type text;

-- ── categorias_experiencia ────────────────────────────────────
alter table public.categorias_experiencia
  alter column nombre type text,
  alter column slug   type text;

-- ── emisivo_destinos ──────────────────────────────────────────
alter table public.emisivo_destinos
  alter column nombre            type text,
  alter column slug              type text,
  alter column descripcion_corta type text,
  alter column pais              type text;

-- ── paquetes ─────────────────────────────────────────────────
alter table public.paquetes
  alter column nombre            type text,
  alter column slug              type text,
  alter column descripcion_corta type text;

alter table public.paquetes
  alter column moneda drop default;

alter table public.paquetes
  alter column moneda type public.moneda
    using coalesce(moneda, 'ARS')::public.moneda;

alter table public.paquetes
  alter column moneda set default 'ARS'::public.moneda,
  alter column moneda set not null;

-- ── paquetes_fechas ───────────────────────────────────────────
alter table public.paquetes_fechas
  alter column moneda drop default;

alter table public.paquetes_fechas
  alter column moneda type public.moneda
    using coalesce(moneda, 'ARS')::public.moneda;

alter table public.paquetes_fechas
  alter column moneda set default 'ARS'::public.moneda,
  alter column moneda set not null;

-- ── paquetes_itinerario ───────────────────────────────────────
alter table public.paquetes_itinerario
  alter column titulo      type text,
  alter column descripcion type text;

-- ── paquetes_imagenes ─────────────────────────────────────────
alter table public.paquetes_imagenes
  alter column alt_text type text;

-- ── experiencias ──────────────────────────────────────────────
alter table public.experiencias
  alter column nombre            type text,
  alter column slug              type text,
  alter column descripcion_corta type text,
  alter column ubicacion         type text;

alter table public.experiencias
  alter column moneda drop default;

alter table public.experiencias
  alter column moneda type public.moneda
    using coalesce(moneda, 'ARS')::public.moneda;

alter table public.experiencias
  alter column moneda set default 'ARS'::public.moneda;

-- ── experiencias_imagenes ─────────────────────────────────────
alter table public.experiencias_imagenes
  alter column alt_text type text;

-- ── hoteles ───────────────────────────────────────────────────
alter table public.hoteles
  alter column nombre            type text,
  alter column slug              type text,
  alter column descripcion_corta type text,
  alter column ciudad            type text,
  alter column provincia         type text;

-- ── hoteles_imagenes ──────────────────────────────────────────
alter table public.hoteles_imagenes
  alter column alt_text type text;

-- ── emisivo_imagenes ──────────────────────────────────────────
alter table public.emisivo_imagenes
  alter column alt_text type text;

-- ── ordenes ───────────────────────────────────────────────────
alter table public.ordenes
  alter column codigo_referencia type text,
  alter column notas             type text;

alter table public.ordenes
  alter column estado      drop default,
  alter column estado_pago drop default,
  alter column moneda      drop default;

alter table public.ordenes
  alter column estado      type public.orden_estado
    using estado::text::public.orden_estado,
  alter column estado_pago type public.pago_estado
    using estado_pago::text::public.pago_estado,
  alter column metodo_pago type public.metodo_pago
    using metodo_pago::text::public.metodo_pago,
  alter column moneda      type public.moneda
    using coalesce(moneda, 'ARS')::public.moneda;

alter table public.ordenes
  alter column estado      set default 'pendiente'::public.orden_estado,
  alter column estado_pago set default 'pending'::public.pago_estado,
  alter column moneda      set default 'ARS'::public.moneda,
  alter column moneda      set not null;

-- ── ordenes_items ─────────────────────────────────────────────
alter table public.ordenes_items
  alter column nombre            type text,
  alter column descripcion_corta type text;

alter table public.ordenes_items
  alter column moneda drop default;

alter table public.ordenes_items
  alter column tipo   type public.reserva_tipo
    using tipo::text::public.reserva_tipo,
  alter column moneda type public.moneda
    using coalesce(moneda, 'ARS')::public.moneda;

alter table public.ordenes_items
  alter column moneda set default 'ARS'::public.moneda,
  alter column moneda set not null;

-- ── pagos ─────────────────────────────────────────────────────
alter table public.pagos
  alter column external_reference type text,
  alter column provider_reference type text,
  alter column receipt_reference  type text;

alter table public.pagos
  alter column estado drop default,
  alter column moneda drop default;

alter table public.pagos
  alter column metodo    type public.metodo_pago
    using metodo::text::public.metodo_pago,
  alter column proveedor type public.pago_proveedor
    using proveedor::text::public.pago_proveedor,
  alter column estado    type public.pago_estado
    using estado::text::public.pago_estado,
  alter column moneda    type public.moneda
    using coalesce(moneda, 'ARS')::public.moneda;

alter table public.pagos
  alter column estado set default 'pending'::public.pago_estado,
  alter column moneda set default 'ARS'::public.moneda,
  alter column moneda set not null;

-- ── pagos_eventos ─────────────────────────────────────────────
alter table public.pagos_eventos
  alter column tipo    type text,
  alter column estado  type text,
  alter column mensaje type text;

-- ── reservas ──────────────────────────────────────────────────
-- Dropear triggers existentes que dependan de columnas que vamos a alterar
drop trigger if exists trg_descontar_cupo on public.reservas;
drop function if exists public.descontar_cupo();

alter table public.reservas
  alter column notas type text;

alter table public.reservas
  alter column estado drop default,
  alter column moneda drop default;

alter table public.reservas
  alter column tipo   type public.reserva_tipo
    using tipo::text::public.reserva_tipo,
  alter column estado type public.reserva_estado
    using estado::text::public.reserva_estado,
  alter column moneda type public.moneda
    using coalesce(moneda, 'ARS')::public.moneda;

alter table public.reservas
  alter column estado set default 'pendiente'::public.reserva_estado,
  alter column moneda set default 'ARS'::public.moneda;

-- ── solicitudes_contacto ──────────────────────────────────────
alter table public.solicitudes_contacto
  alter column nombre_completo      type text,
  alter column correo_electronico   type text,
  alter column tipo_viaje           type text,
  alter column presupuesto_estimado type text,
  alter column fechas_estimadas     type text,
  alter column mensaje              type text;

alter table public.solicitudes_contacto
  alter column estado drop default;

alter table public.solicitudes_contacto
  alter column estado type public.solicitud_estado
    using estado::text::public.solicitud_estado;

alter table public.solicitudes_contacto
  alter column estado set default 'nuevo'::public.solicitud_estado;


-- ============================================================
-- 3. FUNCIÓN: set_updated_at
--    Actualiza updated_at al timestamp actual en cada UPDATE.
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ============================================================
-- 4. TRIGGERS: updated_at en todas las tablas que lo tienen
-- ============================================================

create trigger set_updated_at
  before update on public.usuarios
  for each row execute function public.set_updated_at();

create trigger set_updated_at
  before update on public.agencias
  for each row execute function public.set_updated_at();

create trigger set_updated_at
  before update on public.emisivo_destinos
  for each row execute function public.set_updated_at();

create trigger set_updated_at
  before update on public.paquetes
  for each row execute function public.set_updated_at();

create trigger set_updated_at
  before update on public.paquetes_fechas
  for each row execute function public.set_updated_at();

create trigger set_updated_at
  before update on public.experiencias
  for each row execute function public.set_updated_at();

create trigger set_updated_at
  before update on public.hoteles
  for each row execute function public.set_updated_at();

create trigger set_updated_at
  before update on public.ordenes
  for each row execute function public.set_updated_at();

create trigger set_updated_at
  before update on public.ordenes_items
  for each row execute function public.set_updated_at();

create trigger set_updated_at
  before update on public.pagos
  for each row execute function public.set_updated_at();

create trigger set_updated_at
  before update on public.reservas
  for each row execute function public.set_updated_at();

create trigger set_updated_at
  before update on public.solicitudes_contacto
  for each row execute function public.set_updated_at();


-- ============================================================
-- 5. FUNCIÓN + TRIGGER: manage_cupo_disponible
--
--    Mantiene cupo_disponible en paquetes_fechas de forma
--    automática cuando se crean, cancelan o eliminan reservas.
--
--    Reglas:
--      INSERT reserva activa  → decrementa cupo
--      UPDATE a 'cancelada'   → restaura cupo
--      UPDATE desde cancelada → decrementa cupo
--      DELETE reserva activa  → restaura cupo
-- ============================================================

create or replace function public.manage_cupo_disponible()
returns trigger
language plpgsql
as $$
begin

  -- INSERT: nueva reserva de paquete no cancelada
  if tg_op = 'INSERT' then
    if new.tipo = 'paquete'
       and new.paquete_fecha_id is not null
       and new.estado is distinct from 'cancelada'::public.reserva_estado
    then
      update public.paquetes_fechas
        set cupo_disponible = cupo_disponible - new.cantidad_pasajeros
      where id = new.paquete_fecha_id
        and cupo_disponible >= new.cantidad_pasajeros;

      if not found then
        raise exception
          'Sin cupo disponible para paquete_fecha_id=%', new.paquete_fecha_id
          using errcode = 'P0001';
      end if;
    end if;
    return new;
  end if;

  -- UPDATE: cambios de estado
  if tg_op = 'UPDATE' then

    -- Se canceló: restaurar cupo
    if old.estado is distinct from 'cancelada'::public.reserva_estado
       and new.estado = 'cancelada'::public.reserva_estado
       and old.paquete_fecha_id is not null
    then
      update public.paquetes_fechas
        set cupo_disponible = cupo_disponible + old.cantidad_pasajeros
      where id = old.paquete_fecha_id;
    end if;

    -- Se reactivó desde cancelada: decrementar cupo
    if old.estado = 'cancelada'::public.reserva_estado
       and new.estado is distinct from 'cancelada'::public.reserva_estado
       and new.paquete_fecha_id is not null
    then
      update public.paquetes_fechas
        set cupo_disponible = cupo_disponible - new.cantidad_pasajeros
      where id = new.paquete_fecha_id
        and cupo_disponible >= new.cantidad_pasajeros;

      if not found then
        raise exception
          'Sin cupo disponible para restaurar reserva en paquete_fecha_id=%', new.paquete_fecha_id
          using errcode = 'P0001';
      end if;
    end if;

    return new;
  end if;

  -- DELETE: si no estaba cancelada, restaurar cupo
  if tg_op = 'DELETE' then
    if old.tipo = 'paquete'
       and old.paquete_fecha_id is not null
       and old.estado is distinct from 'cancelada'::public.reserva_estado
    then
      update public.paquetes_fechas
        set cupo_disponible = cupo_disponible + old.cantidad_pasajeros
      where id = old.paquete_fecha_id;
    end if;
    return old;
  end if;

  return null;
end;
$$;

create trigger manage_cupo_disponible
  after insert or update or delete on public.reservas
  for each row execute function public.manage_cupo_disponible();


-- ============================================================
-- 6. FUNCIÓN: slugify
--
--    Convierte texto en slug URL-friendly.
--    Remueve acentos, caracteres especiales y normaliza
--    espacios como guiones.
--
--    Uso: select public.slugify('Salta y Quebrada'); → 'salta-y-quebrada'
-- ============================================================

create or replace function public.slugify(value text)
returns text
language sql
strict immutable
as $$
  select lower(
    -- Colapsar guiones múltiples y quitar guiones al inicio/fin
    regexp_replace(
      regexp_replace(
        -- Reemplazar espacios por guiones
        regexp_replace(
          -- Quitar caracteres que no sean letras, números, espacios o guiones
          regexp_replace(
            -- Transliterar acentos y caracteres especiales
            translate(
              value,
              'áàâãäåçèéêëìíîïñòóôõöùúûüýÿÁÀÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ',
              'aaaaaaceeeeiiiinooooouuuuyyAAAAAACEEEEIIIINOOOOOUUUUY'
            ),
            '[^a-zA-Z0-9\s\-]', '', 'g'
          ),
          '\s+', '-', 'g'
        ),
        '\-{2,}', '-', 'g'
      ),
      '^\-+|\-+$', '', 'g'
    )
  );
$$;


-- ============================================================
-- 7. ÍNDICES
--    Solo se crean si no existen previamente.
--    Los campos con UNIQUE ya tienen índice implícito.
-- ============================================================

-- paquetes
create index if not exists idx_paquetes_activo
  on public.paquetes (activo);

create index if not exists idx_paquetes_destacado
  on public.paquetes (destacado)
  where destacado = true;

create index if not exists idx_paquetes_destino_id
  on public.paquetes (destino_id);

create index if not exists idx_paquetes_orden
  on public.paquetes (orden);

create index if not exists idx_paquetes_created_at
  on public.paquetes (created_at desc);

-- paquetes_fechas
create index if not exists idx_paquetes_fechas_paquete_id
  on public.paquetes_fechas (paquete_id);

create index if not exists idx_paquetes_fechas_fecha_inicio
  on public.paquetes_fechas (fecha_inicio);

create index if not exists idx_paquetes_fechas_activo_cupo
  on public.paquetes_fechas (activo, cupo_disponible)
  where activo = true and cupo_disponible > 0;

-- paquetes_itinerario
create index if not exists idx_paquetes_itinerario_paquete_id
  on public.paquetes_itinerario (paquete_id, dia_numero);

-- paquetes_imagenes
create index if not exists idx_paquetes_imagenes_paquete_id
  on public.paquetes_imagenes (paquete_id, orden);

-- experiencias
create index if not exists idx_experiencias_activo
  on public.experiencias (activo);

create index if not exists idx_experiencias_destacado
  on public.experiencias (destacado)
  where destacado = true;

create index if not exists idx_experiencias_destino_id
  on public.experiencias (destino_id);

create index if not exists idx_experiencias_categoria_id
  on public.experiencias (categoria_id);

create index if not exists idx_experiencias_orden
  on public.experiencias (orden);

create index if not exists idx_experiencias_created_at
  on public.experiencias (created_at desc);

-- experiencias_imagenes
create index if not exists idx_experiencias_imagenes_experiencia_id
  on public.experiencias_imagenes (experiencia_id, orden);

-- hoteles
create index if not exists idx_hoteles_activo
  on public.hoteles (activo);

create index if not exists idx_hoteles_destino_id
  on public.hoteles (destino_id);

create index if not exists idx_hoteles_orden
  on public.hoteles (orden);

-- hoteles_imagenes
create index if not exists idx_hoteles_imagenes_hotel_id
  on public.hoteles_imagenes (hotel_id, orden);

-- emisivo_destinos
create index if not exists idx_emisivo_destinos_activo
  on public.emisivo_destinos (activo);

create index if not exists idx_emisivo_destinos_orden
  on public.emisivo_destinos (orden);

-- destinos
create index if not exists idx_destinos_activo
  on public.destinos (activo);

-- categorias_experiencia
create index if not exists idx_categorias_experiencia_activo
  on public.categorias_experiencia (activo);

create index if not exists idx_categorias_experiencia_orden
  on public.categorias_experiencia (orden);

-- usuarios
create index if not exists idx_usuarios_tipo
  on public.usuarios (tipo);

-- ordenes (los índices de usuario_id ya existen por RLS; agrego los que faltan)
create index if not exists idx_ordenes_estado
  on public.ordenes (estado);

create index if not exists idx_ordenes_created_at
  on public.ordenes (created_at desc);

-- reservas
create index if not exists idx_reservas_paquete_fecha_id
  on public.reservas (paquete_fecha_id);

create index if not exists idx_reservas_experiencia_id
  on public.reservas (experiencia_id);

create index if not exists idx_reservas_estado
  on public.reservas (estado);

create index if not exists idx_reservas_usuario_estado
  on public.reservas (usuario_id, estado);

-- pagos
create index if not exists idx_pagos_estado
  on public.pagos (estado);

create index if not exists idx_pagos_expires_at
  on public.pagos (expires_at)
  where estado = 'pending';

-- solicitudes_contacto
create index if not exists idx_solicitudes_estado
  on public.solicitudes_contacto (estado);

create index if not exists idx_solicitudes_created_at
  on public.solicitudes_contacto (created_at desc);
