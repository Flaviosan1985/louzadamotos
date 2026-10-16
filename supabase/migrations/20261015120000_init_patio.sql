-- Pátio ERP — esquema multi-tenant para revendas de veículos
-- Aplicar no SQL Editor do Supabase ou via `supabase db push`.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cnpj text,
  telefone text,
  logo_url text,
  criado_em timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  nome text not null,
  papel text not null default 'admin' check (papel in ('admin', 'vendedor', 'financeiro')),
  criado_em timestamptz not null default now()
);

create index if not exists profiles_tenant_id_idx on public.profiles (tenant_id);

create table if not exists public.veiculos (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  tipo text not null check (tipo in ('carro', 'moto')),
  marca text not null,
  modelo text not null,
  ano_fabricacao integer not null,
  ano_modelo integer not null,
  placa text,
  renavam text,
  km integer not null default 0 check (km >= 0),
  cor text,
  preco_custo numeric(12, 2) not null default 0,
  preco_venda numeric(12, 2) not null default 0,
  status text not null default 'disponivel' check (status in ('disponivel', 'reservado', 'vendido')),
  observacoes text,
  fotos text[] not null default '{}',
  vendido_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists veiculos_tenant_id_idx on public.veiculos (tenant_id);
create index if not exists veiculos_tenant_status_idx on public.veiculos (tenant_id, status);
create index if not exists veiculos_tenant_marca_idx on public.veiculos (tenant_id, marca);
create index if not exists veiculos_tenant_placa_idx on public.veiculos (tenant_id, placa);

drop trigger if exists veiculos_set_updated_at on public.veiculos;
create trigger veiculos_set_updated_at
before update on public.veiculos
for each row execute function public.set_updated_at();

create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  nome text not null,
  tipo_pessoa text not null default 'fisica' check (tipo_pessoa in ('fisica', 'juridica')),
  documento text,
  telefone text,
  email text,
  endereco text,
  criado_em timestamptz not null default now()
);

create index if not exists clientes_tenant_id_idx on public.clientes (tenant_id);
create index if not exists clientes_tenant_documento_idx on public.clientes (tenant_id, documento);
create index if not exists clientes_tenant_nome_idx on public.clientes (tenant_id, nome);

create table if not exists public.financeiro (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  tipo text not null check (tipo in ('receita', 'despesa')),
  categoria text not null,
  descricao text not null,
  valor numeric(12, 2) not null check (valor >= 0),
  data_vencimento date not null,
  data_pagamento date,
  status text not null default 'pendente' check (status in ('pendente', 'pago')),
  veiculo_id uuid references public.veiculos (id) on delete set null,
  criado_em timestamptz not null default now()
);

create index if not exists financeiro_tenant_id_idx on public.financeiro (tenant_id);
create index if not exists financeiro_tenant_status_idx on public.financeiro (tenant_id, status);
create index if not exists financeiro_tenant_vencimento_idx on public.financeiro (tenant_id, data_vencimento);
create index if not exists financeiro_veiculo_id_idx on public.financeiro (veiculo_id);

-- Isolamento multi-tenant
create or replace function public.current_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select tenant_id from public.profiles where id = auth.uid()
$$;

revoke all on function public.current_tenant_id() from public;
grant execute on function public.current_tenant_id() to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_tenant uuid;
begin
  insert into public.tenants (nome, cnpj, telefone)
  values (
    coalesce(nullif(new.raw_user_meta_data->>'nome_loja', ''), 'Minha Revenda'),
    nullif(new.raw_user_meta_data->>'cnpj', ''),
    nullif(new.raw_user_meta_data->>'telefone', '')
  )
  returning id into new_tenant;

  insert into public.profiles (id, tenant_id, nome, papel)
  values (
    new.id,
    new_tenant,
    coalesce(nullif(new.raw_user_meta_data->>'nome', ''), split_part(new.email, '@', 1)),
    'admin'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.veiculos enable row level security;
alter table public.clientes enable row level security;
alter table public.financeiro enable row level security;

drop policy if exists tenants_select on public.tenants;
create policy tenants_select on public.tenants
  for select to authenticated
  using (id = public.current_tenant_id());

drop policy if exists tenants_update on public.tenants;
create policy tenants_update on public.tenants
  for update to authenticated
  using (id = public.current_tenant_id())
  with check (id = public.current_tenant_id());

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated
  using (tenant_id = public.current_tenant_id());

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and tenant_id = public.current_tenant_id());

drop policy if exists veiculos_all on public.veiculos;
create policy veiculos_all on public.veiculos
  for all to authenticated
  using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

drop policy if exists clientes_all on public.clientes;
create policy clientes_all on public.clientes
  for all to authenticated
  using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

drop policy if exists financeiro_all on public.financeiro;
create policy financeiro_all on public.financeiro
  for all to authenticated
  using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

insert into storage.buckets (id, name, public)
values ('veiculos', 'veiculos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

drop policy if exists veiculos_storage_select on storage.objects;
create policy veiculos_storage_select on storage.objects
  for select to authenticated
  using (
    bucket_id in ('veiculos', 'logos')
    and (storage.foldername(name))[1] = public.current_tenant_id()::text
  );

drop policy if exists veiculos_storage_insert on storage.objects;
create policy veiculos_storage_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('veiculos', 'logos')
    and (storage.foldername(name))[1] = public.current_tenant_id()::text
  );

drop policy if exists veiculos_storage_update on storage.objects;
create policy veiculos_storage_update on storage.objects
  for update to authenticated
  using (
    bucket_id in ('veiculos', 'logos')
    and (storage.foldername(name))[1] = public.current_tenant_id()::text
  )
  with check (
    bucket_id in ('veiculos', 'logos')
    and (storage.foldername(name))[1] = public.current_tenant_id()::text
  );

drop policy if exists veiculos_storage_delete on storage.objects;
create policy veiculos_storage_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id in ('veiculos', 'logos')
    and (storage.foldername(name))[1] = public.current_tenant_id()::text
  );
