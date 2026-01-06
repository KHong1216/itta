-- ITTA crew chat (itta_* prefix)
-- Run in Supabase Dashboard -> SQL Editor

begin;

create extension if not exists pgcrypto;

create table if not exists public.itta_crew_messages (
  id uuid primary key default gen_random_uuid(),
  crew_id uuid not null references public.itta_crews (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists itta_crew_messages_crew_created_at_idx
  on public.itta_crew_messages (crew_id, created_at);

alter table public.itta_crew_messages enable row level security;

drop policy if exists "itta_crew_messages_select_members" on public.itta_crew_messages;
create policy "itta_crew_messages_select_members"
  on public.itta_crew_messages
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.itta_crew_memberships m
      where m.crew_id = itta_crew_messages.crew_id
        and m.user_id = auth.uid()
    )
  );

drop policy if exists "itta_crew_messages_insert_members" on public.itta_crew_messages;
create policy "itta_crew_messages_insert_members"
  on public.itta_crew_messages
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.itta_crew_memberships m
      where m.crew_id = itta_crew_messages.crew_id
        and m.user_id = auth.uid()
    )
  );

-- Realtime: include this table in the publication
alter publication supabase_realtime add table public.itta_crew_messages;

commit;


