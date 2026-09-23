-- Migration: saved_screens table for SC3 saved filter screens (Foundation+ feature)
-- Apply via: supabase db push  OR  paste into Supabase SQL editor

create table if not exists saved_screens (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 80),
  filter_json jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

-- Row-Level Security: users can only read/write their own rows
alter table saved_screens enable row level security;

create policy "saved_screens_owner_all"
  on saved_screens
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index for fast per-user lookups
create index if not exists saved_screens_user_id_idx
  on saved_screens (user_id);
