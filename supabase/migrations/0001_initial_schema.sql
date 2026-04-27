-- Lauftrainer · Initial Schema
-- Tabellen: profiles · daily_logs · workout_logs · shopping_state
-- RLS: jeder User sieht nur seine eigenen Zeilen
-- Auto-Create: profile + shopping_state werden bei Signup angelegt

-- =====================================================================
-- PROFILES (1:1 mit auth.users) · ersetzt das alte Settings-Object
-- =====================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'Mats',
  start_date date not null default current_date,
  week_offset integer not null default 0,
  hf_max integer not null default 198,
  rhr_baseline integer not null default 57,
  weight numeric(5, 2),
  height integer,
  goal_pace text default '5:40',
  weekly_volume_target integer default 200,
  theme text not null default 'light' check (theme in ('light', 'dark')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
-- DAILY_LOGS · ein Eintrag pro (user, date)
-- =====================================================================
create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  sleep numeric(3, 1),
  rhr integer,
  energy smallint check (energy between 1 and 10),
  stress smallint check (stress between 1 and 10),
  mood smallint check (mood between 1 and 10),
  weight numeric(5, 2),
  strength text,
  blackroll text,
  nutrition text,
  notes text,
  hund integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

create index if not exists daily_logs_user_date_idx
  on public.daily_logs (user_id, date desc);

-- =====================================================================
-- WORKOUT_LOGS · ein Eintrag pro (user, week, day)
-- =====================================================================
create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week smallint not null check (week between 1 and 22),
  day text not null check (day in ('mo', 'di', 'mi', 'do', 'fr', 'sa', 'so')),
  type text check (type in ('easy', 'long', 'tempo', 'race', 'test')),
  completed boolean not null default false,
  date date,
  distance numeric(5, 2),
  duration integer,
  avg_hr integer,
  max_hr integer,
  rpe smallint check (rpe between 1 and 10),
  weather text,
  youtube text,
  blackroll text,
  strava_id text,
  notes text,
  splits jsonb,
  zones jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week, day)
);

create index if not exists workout_logs_user_week_idx
  on public.workout_logs (user_id, week);

-- =====================================================================
-- SHOPPING_STATE (1:1 mit user)
-- =====================================================================
create table if not exists public.shopping_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  selected jsonb not null default '{}'::jsonb,
  custom jsonb not null default '[]'::jsonb,
  checked jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- =====================================================================
-- TRIGGER: updated_at automatisch setzen
-- =====================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at_profiles on public.profiles;
create trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_daily_logs on public.daily_logs;
create trigger set_updated_at_daily_logs
  before update on public.daily_logs
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_workout_logs on public.workout_logs;
create trigger set_updated_at_workout_logs
  before update on public.workout_logs
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_shopping_state on public.shopping_state;
create trigger set_updated_at_shopping_state
  before update on public.shopping_state
  for each row execute function public.set_updated_at();

-- =====================================================================
-- TRIGGER: bei neuem User automatisch Profile + Shopping-State anlegen
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  insert into public.shopping_state (user_id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- RLS: jeder User sieht nur seine eigenen Zeilen
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.daily_logs enable row level security;
alter table public.workout_logs enable row level security;
alter table public.shopping_state enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "own daily_logs" on public.daily_logs;
create policy "own daily_logs"
  on public.daily_logs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own workout_logs" on public.workout_logs;
create policy "own workout_logs"
  on public.workout_logs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own shopping_state" on public.shopping_state;
create policy "own shopping_state"
  on public.shopping_state
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
