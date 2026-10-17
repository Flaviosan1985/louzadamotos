"use client";

import { useCallback, useMemo, useState } from "react";
import { PanelLink } from "@/components/layout/panel/PanelLink";
import { toast } from "sonner";
import { removeVeiculo } from "@/lib/data/app-data";
import { filterVeiculos, uniqueMarcas } from "@/lib/veiculos/filter-veiculos";
import type { StatusVeiculo } from "@/lib/types/database";
import { useAppSnapshot } from "@/hooks/use-app-snapshot";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { QueryState } from "@/components/shared/QueryState";
import { EmptyState } from "@/components/shared/EmptyState";
import { VeiculosFilters } from "@/components/veiculos/VeiculosFilters";
import { VeiculosTable } from "@/components/veiculos/VeiculosTable";
import type { VeiculoFiltros } from "@/components/veiculos/types";

const emptyFilters: VeiculoFiltros = {
  busca: "",
  status: "todos",
  marca: "",
  tipo: "todos",
};

export function VeiculosPage({
  title,
  lockedStatus,
}: {
  title: string;
  lockedStatus?: StatusVeiculo;
}) {
  const { data, error, loading, refetch } = useAppSnapshot();
  const [filters, setFilters] = useState<VeiculoFiltros>({
    ...emptyFilters,
    status: lockedStatus ?? "todos",
  });
  const debouncedBusca = useDebounce(filters.busca, 300);
  const activeFilters = useMemo(
    () => ({ ...filters, busca: debouncedBusca }),
    [filters, debouncedBusca],
  );

  const marcas = useMemo(() => uniqueMarcas(data?.veiculos ?? []), [data]);
  const filtered = useMemo(
    () => filterVeiculos(data?.veiculos ?? [], activeFilters, lockedStatus),
    [data, activeFilters, lockedStatus],
  );

  const handleFilters = useCallback(
    (next: VeiculoFiltros) => {
      setFilters(lockedStatus ? { ...next, status: lockedStatus } : next);
    },
    [lockedStatus],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!data) return;
      try {
        await removeVeiculo(id, data.mode === "demo");
        toast.success("Veículo excluído.");
        await refetch();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Falha ao excluir.");
      }
    },
    [data, refetch],
  );

  return (
    <QueryState
      loading={loading && !data}
      error={error}
      empty={Boolean(data) && filtered.length === 0}
      onRetry={refetch}
    >
      <QueryState.Loading />
      <QueryState.Error />
      <QueryState.Ready>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="text-muted-foreground text-sm">
              {filtered.length} veículo(s) nesta lista
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" nativeButton={false} render={<PanelLink href="/" />}>
              Ver vitrine
            </Button>
            <Button nativeButton={false} render={<PanelLink href="/veiculos/adicionar" />}>
              Adicionar veículo
            </Button>
          </div>
        </div>
        {data ? (
          <VeiculosFilters value={filters} marcas={marcas} onChange={handleFilters} />
        ) : null}
        <QueryState.Empty>
          <EmptyState
            title="Nenhum veículo neste filtro"
            description="Ajuste a busca, o status ou cadastre um veículo no pátio."
            action={
              <Button nativeButton={false} render={<PanelLink href="/veiculos/adicionar" />}>
                Adicionar veículo
              </Button>
            }
          />
        </QueryState.Empty>
        <QueryState.Success>
          <VeiculosTable veiculos={filtered} onDelete={handleDelete} />
        </QueryState.Success>
      </div>
      </QueryState.Ready>
    </QueryState>
  );
}
