alter table public.ordenes enable row level security;
alter table public.ordenes_items enable row level security;
alter table public.pagos enable row level security;
alter table public.pagos_eventos enable row level security;

create policy "Users can view their own orders"
on public.ordenes
for select
to authenticated
using (usuario_id = (select auth.uid()));

create policy "Users can view their own order items"
on public.ordenes_items
for select
to authenticated
using (
  exists (
    select 1
    from public.ordenes
    where public.ordenes.id = public.ordenes_items.orden_id
      and public.ordenes.usuario_id = (select auth.uid())
  )
);

create policy "Users can view their own payments"
on public.pagos
for select
to authenticated
using (
  exists (
    select 1
    from public.ordenes
    where public.ordenes.id = public.pagos.orden_id
      and public.ordenes.usuario_id = (select auth.uid())
  )
);

create policy "Users can view their own payment events"
on public.pagos_eventos
for select
to authenticated
using (
  exists (
    select 1
    from public.pagos
    join public.ordenes
      on public.ordenes.id = public.pagos.orden_id
    where public.pagos.id = public.pagos_eventos.pago_id
      and public.ordenes.usuario_id = (select auth.uid())
  )
);

create index if not exists ordenes_usuario_id_rls_idx
  on public.ordenes (usuario_id);

create index if not exists ordenes_items_orden_id_rls_idx
  on public.ordenes_items (orden_id);

create index if not exists pagos_orden_id_rls_idx
  on public.pagos (orden_id);

create index if not exists pagos_eventos_pago_id_rls_idx
  on public.pagos_eventos (pago_id);
