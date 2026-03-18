create extension if not exists "uuid-ossp";

create table if not exists public.ordenes (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid not null references public.usuarios(id),
  codigo_referencia character varying not null unique,
  estado character varying not null default 'pendiente'
    check (estado in ('pendiente', 'pago_pendiente', 'pago_reportado', 'pagada', 'confirmada', 'cancelada', 'completada')),
  estado_pago character varying not null default 'pending'
    check (estado_pago in ('pending', 'requires_action', 'reported', 'approved', 'rejected', 'cancelled', 'expired')),
  metodo_pago character varying not null
    check (metodo_pago in ('mercadopago_checkout_pro', 'bank_transfer', 'cash_local')),
  total numeric not null check (total >= 0),
  moneda character varying not null default 'ARS',
  contacto jsonb,
  pasajero_principal jsonb,
  notas text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists ordenes_usuario_id_idx on public.ordenes (usuario_id);
create index if not exists ordenes_estado_idx on public.ordenes (estado);
create index if not exists ordenes_estado_pago_idx on public.ordenes (estado_pago);

create table if not exists public.ordenes_items (
  id uuid primary key default uuid_generate_v4(),
  orden_id uuid not null references public.ordenes(id) on delete cascade,
  reserva_id uuid not null references public.reservas(id) on delete cascade,
  tipo character varying not null
    check (tipo in ('paquete', 'experiencia')),
  nombre character varying not null,
  descripcion_corta character varying,
  imagen_url text,
  cantidad integer not null default 1 check (cantidad > 0),
  precio_unitario numeric not null check (precio_unitario >= 0),
  precio_total numeric not null check (precio_total >= 0),
  moneda character varying not null default 'ARS',
  metadata jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint ordenes_items_reserva_id_key unique (reserva_id)
);

create index if not exists ordenes_items_orden_id_idx on public.ordenes_items (orden_id);
create index if not exists ordenes_items_tipo_idx on public.ordenes_items (tipo);

create table if not exists public.pagos (
  id uuid primary key default uuid_generate_v4(),
  orden_id uuid not null references public.ordenes(id) on delete cascade,
  metodo character varying not null
    check (metodo in ('mercadopago_checkout_pro', 'bank_transfer', 'cash_local')),
  proveedor character varying not null
    check (proveedor in ('mercadopago', 'bank_transfer', 'cash_local')),
  estado character varying not null default 'pending'
    check (estado in ('pending', 'requires_action', 'reported', 'approved', 'rejected', 'cancelled', 'expired')),
  monto numeric not null check (monto >= 0),
  moneda character varying not null default 'ARS',
  external_reference character varying not null unique,
  provider_reference character varying,
  redirect_url text,
  expires_at timestamp with time zone,
  receipt_url text,
  receipt_storage_path text,
  receipt_reference character varying,
  metadata jsonb,
  approved_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists pagos_orden_id_idx on public.pagos (orden_id);
create index if not exists pagos_estado_idx on public.pagos (estado);
create index if not exists pagos_metodo_idx on public.pagos (metodo);

create table if not exists public.pagos_eventos (
  id uuid primary key default uuid_generate_v4(),
  pago_id uuid not null references public.pagos(id) on delete cascade,
  tipo character varying not null,
  estado character varying,
  mensaje text,
  payload jsonb,
  created_at timestamp with time zone default now()
);

create index if not exists pagos_eventos_pago_id_idx on public.pagos_eventos (pago_id);
create index if not exists pagos_eventos_tipo_idx on public.pagos_eventos (tipo);
