"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useAppSnapshot, type AppSnapshot } from "@/hooks/use-app-snapshot";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { QueryState } from "@/components/shared/QueryState";
import { EmptyState } from "@/components/shared/EmptyState";
import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { EntityTable } from "@/components/shared/EntityTable";
import { filterRows } from "@/lib/modulos/filter-rows";
import type { CatalogColumn, ModuleRow } from "@/lib/types/modulos";

export function ReportPage({
  title,
  description,
  columns,
  buildRows,
  searchPlaceholder = "Buscar",
  footer,
}: {
  title: string;
  description: string;
  columns: CatalogColumn[];
  buildRows: (snapshot: AppSnapshot) => ModuleRow[];
  searchPlaceholder?: string;
  footer?: ReactNode;
}) {
  const { data, error, loading, refetch } = useAppSnapshot();
  const [busca, setBusca] = useState("");
  const debouncedBusca = useDebounce(busca, 300);
  const rows = useMemo(() => (data ? buildRows(data) : []), [data, buildRows]);
  const filtered = useMemo(() => filterRows(rows, debouncedBusca), [rows, debouncedBusca]);

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
          <ModuleHeader title={title} count={`${filtered.length} linha(s)`} />
          <p className="text-muted-foreground -mt-3 text-sm">{description}</p>
          <Input
            placeholder={searchPlaceholder}
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />
          <QueryState.Empty>
            <EmptyState title="Nada para exibir" description="Não há dados neste relatório com o filtro atual." />
          </QueryState.Empty>
          <QueryState.Success>
            <EntityTable columns={columns} rows={filtered} />
          </QueryState.Success>
          {footer}
        </div>
      </QueryState.Ready>
    </QueryState>
  );
}
