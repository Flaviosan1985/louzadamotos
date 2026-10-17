-- Papéis de fato: admin opera tudo da loja; vendedor o comercial; financeiro o caixa.

alter table public.clientes
  add column if not exists anonimizado_em timestamptz;

create or replace function public.current_papel()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select papel from public.profiles where id = auth.uid()
$$;

revoke all on function public.current_papel() from public;
grant execute on function public.current_papel() to authenticated;

create or replace function public.guard_papel_change()
returns trigger
language plpgsql
as $$
begin
  if new.tenant_id is distinct from old.tenant_id then
    raise exception 'Não é permitido trocar de loja.';
  end if;
  if new.papel is distinct from old.papel
     and coalesce(public.current_papel(), '') <> 'admin'
     and auth.uid() is not null then
    raise exception 'Só o admin altera o papel.';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_papel on public.profiles;
create trigger profiles_guard_papel
before update on public.profiles
for each row execute function public.guard_papel_change();

drop policy if exists tenants_update on public.tenants;
create policy tenants_update on public.tenants
  for update to authenticated
  using (id = public.current_tenant_id() and public.current_papel() = 'admin')
  with check (id = public.current_tenant_id() and public.current_papel() = 'admin');

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update to authenticated
  using (id = auth.uid() and tenant_id = public.current_tenant_id())
  with check (id = auth.uid() and tenant_id = public.current_tenant_id());

drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update on public.profiles
  for update to authenticated
  using (tenant_id = public.current_tenant_id() and public.current_papel() = 'admin')
  with check (tenant_id = public.current_tenant_id() and public.current_papel() = 'admin');

drop policy if exists profiles_admin_insert on public.profiles;
create policy profiles_admin_insert on public.profiles
  for insert to authenticated
  with check (tenant_id = public.current_tenant_id() and public.current_papel() = 'admin');

drop policy if exists veiculos_all on public.veiculos;
create policy veiculos_select on public.veiculos
  for select to authenticated
  using (tenant_id = public.current_tenant_id());
create policy veiculos_write on public.veiculos
  for insert to authenticated
  with check (
    tenant_id = public.current_tenant_id()
    and public.current_papel() in ('admin', 'vendedor')
  );
create policy veiculos_update on public.veiculos
  for update to authenticated
  using (
    tenant_id = public.current_tenant_id()
    and public.current_papel() in ('admin', 'vendedor')
  )
  with check (
    tenant_id = public.current_tenant_id()
    and public.current_papel() in ('admin', 'vendedor')
  );
create policy veiculos_delete on public.veiculos
  for delete to authenticated
  using (
    tenant_id = public.current_tenant_id()
    and public.current_papel() in ('admin', 'vendedor')
  );

drop policy if exists clientes_all on public.clientes;
create policy clientes_select on public.clientes
  for select to authenticated
  using (tenant_id = public.current_tenant_id());
create policy clientes_insert on public.clientes
  for insert to authenticated
  with check (
    tenant_id = public.current_tenant_id()
    and public.current_papel() in ('admin', 'vendedor')
  );
create policy clientes_update on public.clientes
  for update to authenticated
  using (
    tenant_id = public.current_tenant_id()
    and public.current_papel() in ('admin', 'vendedor')
  )
  with check (
    tenant_id = public.current_tenant_id()
    and public.current_papel() in ('admin', 'vendedor')
  );
-- Sem policy de DELETE: cliente não é excluído (documentos fiscais).

drop policy if exists financeiro_all on public.financeiro;
create policy financeiro_select on public.financeiro
  for select to authenticated
  using (
    tenant_id = public.current_tenant_id()
    and public.current_papel() in ('admin', 'financeiro')
  );
create policy financeiro_insert on public.financeiro
  for insert to authenticated
  with check (
    tenant_id = public.current_tenant_id()
    and public.current_papel() in ('admin', 'financeiro')
  );
create policy financeiro_update on public.financeiro
  for update to authenticated
  using (
    tenant_id = public.current_tenant_id()
    and public.current_papel() in ('admin', 'financeiro')
  )
  with check (
    tenant_id = public.current_tenant_id()
    and public.current_papel() in ('admin', 'financeiro')
  );
create policy financeiro_delete on public.financeiro
  for delete to authenticated
  using (
    tenant_id = public.current_tenant_id()
    and public.current_papel() in ('admin', 'financeiro')
  );
