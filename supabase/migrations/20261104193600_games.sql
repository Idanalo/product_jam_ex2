-- Table to store completed Tic-tac-toe games (big-three variant)
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  moves jsonb not null,
  result text not null check (result in ('X', 'O', 'draw')),
  created_at timestamptz not null default now()
);

-- Index for listing games belonging to a user, newest first
create index if not exists games_owner_id_created_at_idx
  on public.games (owner_id, created_at desc);

-- Row Level Security: ON with no policies (server accesses data via secret key)
alter table public.games enable row level security;
