  create table if not exists public.checkout_profiles (
    usuario_id uuid primary key references public.usuarios(id) on delete cascade,
    contact_first_name text,
    contact_last_name text,
    contact_email text,
    contact_phone text,
    passenger_full_name text,
    passenger_document_number text,
    passenger_birth_date text,
    passenger_nationality text,
    passenger_special_requirements text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  );

  create index if not exists checkout_profiles_usuario_id_idx
    on public.checkout_profiles (usuario_id);

  alter table public.checkout_profiles enable row level security;

  drop policy if exists "checkout_profiles_select_own" on public.checkout_profiles;
  create policy "checkout_profiles_select_own"
    on public.checkout_profiles
    for select
    to authenticated
    using (auth.uid() = usuario_id);
