create policy "admins_can_select_ordenes"
on public.ordenes
for select
to authenticated
using (
  exists (
    select 1
    from public.usuarios
    where usuarios.id = auth.uid()
      and usuarios.tipo = 'admin'
  )
);

create policy "admins_can_select_ordenes_items"
on public.ordenes_items
for select
to authenticated
using (
  exists (
    select 1
    from public.usuarios
    where usuarios.id = auth.uid()
      and usuarios.tipo = 'admin'
  )
);

create policy "admins_can_select_pagos"
on public.pagos
for select
to authenticated
using (
  exists (
    select 1
    from public.usuarios
    where usuarios.id = auth.uid()
      and usuarios.tipo = 'admin'
  )
);

create policy "admins_can_select_pagos_eventos"
on public.pagos_eventos
for select
to authenticated
using (
  exists (
    select 1
    from public.usuarios
    where usuarios.id = auth.uid()
      and usuarios.tipo = 'admin'
  )
);
