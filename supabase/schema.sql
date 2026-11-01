-- DataDemocracia · schema inicial do Supabase
-- Execute no SQL Editor do projeto Supabase depois de revisar os campos demonstrativos.

create extension if not exists pgcrypto;

create table if not exists public.politicians (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  role text not null,
  party text,
  state text,
  city text,
  period text,
  portrait_url text,
  source_url text,
  source_name text,
  source_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.promises (
  id uuid primary key default gen_random_uuid(),
  politician_id uuid not null references public.politicians(id) on delete cascade,
  external_id text,
  title text not null,
  theme text,
  status text not null default 'Sem evidência suficiente',
  progress numeric check (progress between 0 and 100),
  deadline text,
  competence text,
  trajectory text,
  source_url text,
  source_page text,
  source_hash text,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (politician_id, external_id)
);

create table if not exists public.promise_evidence (
  id uuid primary key default gen_random_uuid(),
  promise_id uuid not null references public.promises(id) on delete cascade,
  source_name text not null,
  source_url text,
  document_title text,
  document_page text,
  evidence_type text not null,
  description text not null,
  strength text not null default 'Parcial',
  observed_at timestamptz,
  extracted_at timestamptz,
  reviewed_at timestamptz,
  protocol text,
  created_at timestamptz not null default now()
);

create table if not exists public.monitoring_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null check (entity_type in ('politician', 'promise', 'theme', 'city', 'agency')),
  entity_id uuid,
  label text not null,
  frequency text not null default 'weekly',
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists promises_politician_id_idx on public.promises (politician_id);
create index if not exists evidence_promise_id_idx on public.promise_evidence (promise_id);
create index if not exists monitoring_user_id_idx on public.monitoring_items (user_id);

alter table public.politicians enable row level security;
alter table public.promises enable row level security;
alter table public.promise_evidence enable row level security;
alter table public.monitoring_items enable row level security;

drop policy if exists "public can read politicians" on public.politicians;
create policy "public can read politicians" on public.politicians for select using (true);

drop policy if exists "public can read promises" on public.promises;
create policy "public can read promises" on public.promises for select using (true);

drop policy if exists "public can read evidence" on public.promise_evidence;
create policy "public can read evidence" on public.promise_evidence for select using (true);

drop policy if exists "users can read own monitoring" on public.monitoring_items;
create policy "users can read own monitoring" on public.monitoring_items for select using (auth.uid() = user_id);

drop policy if exists "users can insert own monitoring" on public.monitoring_items;
create policy "users can insert own monitoring" on public.monitoring_items for insert with check (auth.uid() = user_id);

drop policy if exists "users can update own monitoring" on public.monitoring_items;
create policy "users can update own monitoring" on public.monitoring_items for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users can delete own monitoring" on public.monitoring_items;
create policy "users can delete own monitoring" on public.monitoring_items for delete using (auth.uid() = user_id);
