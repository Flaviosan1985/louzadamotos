-- Leitura anônima dos veículos publicados na vitrine (disponível / vendido).
drop policy if exists veiculos_vitrine_anon on public.veiculos;
create policy veiculos_vitrine_anon on public.veiculos
  for select to anon
  using (status in ('disponivel', 'vendido'));
