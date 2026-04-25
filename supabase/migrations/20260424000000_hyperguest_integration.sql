create table if not exists public.hyperguest_hotel_mappings (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references public.hoteles(id) on delete set null,
  hyperguest_property_id text not null,
  hyperguest_hotel_id text,
  hyperguest_payload jsonb,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hyperguest_hotel_mappings_property_id_key unique (hyperguest_property_id),
  constraint hyperguest_hotel_mappings_hotel_id_key unique (hotel_id)
);

create table if not exists public.hyperguest_booking_intents (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.usuarios(id) on delete set null,
  hotel_id uuid references public.hoteles(id) on delete set null,
  hyperguest_property_id text not null,
  status text not null default 'search_started',
  provider_booking_id text,
  provider_reference text,
  check_in date,
  check_out date,
  rooms integer,
  adults integer,
  children integer,
  infants integer,
  currency text,
  total_amount numeric(12, 2),
  search_payload jsonb,
  search_response jsonb,
  prebook_payload jsonb,
  prebook_response jsonb,
  book_payload jsonb,
  book_response jsonb,
  cancel_payload jsonb,
  cancel_response jsonb,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hyperguest_booking_intents_status_check check (
    status in (
      'search_started',
      'searched',
      'prebook_started',
      'prebooked',
      'book_started',
      'booked',
      'cancel_started',
      'cancelled',
      'failed'
    )
  )
);

create table if not exists public.hyperguest_events (
  id uuid primary key default gen_random_uuid(),
  booking_intent_id uuid references public.hyperguest_booking_intents(id) on delete cascade,
  type text not null,
  status text not null,
  message text,
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists hyperguest_hotel_mappings_hotel_id_idx
  on public.hyperguest_hotel_mappings(hotel_id);

create index if not exists hyperguest_booking_intents_usuario_id_idx
  on public.hyperguest_booking_intents(usuario_id);

create index if not exists hyperguest_booking_intents_hotel_id_idx
  on public.hyperguest_booking_intents(hotel_id);

create index if not exists hyperguest_booking_intents_provider_booking_id_idx
  on public.hyperguest_booking_intents(provider_booking_id);

create index if not exists hyperguest_events_booking_intent_id_idx
  on public.hyperguest_events(booking_intent_id);

alter table public.hyperguest_hotel_mappings enable row level security;
alter table public.hyperguest_booking_intents enable row level security;
alter table public.hyperguest_events enable row level security;

create policy "Public can read hotel HyperGuest mappings"
  on public.hyperguest_hotel_mappings
  for select
  using (true);

create policy "Users can read their own HyperGuest bookings"
  on public.hyperguest_booking_intents
  for select
  using (auth.uid() = usuario_id);

create policy "Users can read their own HyperGuest booking events"
  on public.hyperguest_events
  for select
  using (
    exists (
      select 1
      from public.hyperguest_booking_intents intent
      where intent.id = hyperguest_events.booking_intent_id
        and intent.usuario_id = auth.uid()
    )
  );
