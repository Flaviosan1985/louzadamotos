"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { removeModuleRow, restoreExcluido, saveModuleRow } from "@/lib/data/app-data";
import { escritaDoCatalogo } from "@/lib/negocio/permissoes";
import { filterRows } from "@/lib/modulos/filter-rows";
import { useAppSnapshot } from "@/hooks/use-app-snapshot";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QueryState } from "@/components/shared/QueryState";
import { EmptyState } from "@/components/shared/EmptyState";
import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { EntityTable } from "@/components/shared/EntityTable";
import { EntityForm } from "@/components/shared/EntityForm";
import type { Veiculo } from "@/lib/types/database";
import type { CatalogColumn, CatalogField, ExtraKey, ModuleRow } from "@/lib/types/modulos";

function vehicleLabel(veiculo: Veiculo) {
  return `${veiculo.marca} ${veiculo.modelo}${veiculo.placa ? ` · ${veiculo.placa}` : ""}`;
}

function fieldsWithStock(fields: CatalogField[], veiculos: Veiculo[]) {
  return fields.map((field) => {
    if (field.key !== "veiculo") return field;
    return {
      ...field,
      type: "select" as const,
      options: veiculos
        .filter((veiculo) => veiculo.status !== "vendido")
        .map((veiculo) => {
          const label = vehicleLabel(veiculo);
          return { value: label, label };
        }),
    };
  });
}

export function CatalogPage({
  title,
  description,
  newLabel,
  searchPlaceholder,
  extraKey,
  columns,
  fields,
  countLabel = "registro(s)",
  restore,
}: {
  title: string;
  description: string;
  newLabel?: string;
  searchPlaceholder: string;
  extraKey: ExtraKey;
  columns: CatalogColumn[];
  fields: CatalogField[];
  countLabel?: string;
  restore?: boolean;
}) {
  const { data, error, loading, refetch } = useAppSnapshot();
  const [busca, setBusca] = useState("");
  const [editing, setEditing] = useState<ModuleRow | null | "new">(null);
  const debouncedBusca = useDebounce(busca, 300);

  const podeEscrever = data ? escritaDoCatalogo(extraKey, data.profile.papel) : false;
  const items = data?.extras[extraKey] ?? [];
  const filtered = useMemo(() => filterRows(items, debouncedBusca), [items, debouncedBusca]);
  const formFields = useMemo(
    () => fieldsWithStock(fields, data?.veiculos ?? []),
    [fields, data?.veiculos],
  );

  const handleSave = useCallback(
    async (payload: Record<string, string>) => {
      if (!data || editing === null) return;
      try {
        const selected = data.veiculos.find((veiculo) => vehicleLabel(veiculo) === payload.veiculo);
        const nextPayload = { ...payload };
        if (selected && fields.some((field) => field.key === "placa") && !nextPayload.placa?.trim()) {
          nextPayload.placa = selected.placa ?? "";
        }
        await saveModuleRow(
          extraKey,
          editing === "new"
            ? { ...nextPayload, tenant_id: data.tenant.id, id: crypto.randomUUID(), criado_em: new Date().toISOString() }
            : { ...editing, ...nextPayload },
        );
        toast.success(editing === "new" ? "Registro cadastrado." : "Registro atualizado.");
        setEditing(null);
        await refetch();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Falha ao salvar.");
        throw err;
      }
    },
    [data, editing, extraKey, fields, refetch],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await removeModuleRow(extraKey, id);
        toast.success("Registro excluído.");
        await refetch();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Falha ao excluir.");
      }
    },
    [extraKey, refetch],
  );

  const handleRestore = useCallback(
    async (id: string) => {
      try {
        await restoreExcluido(id);
        toast.success("Veículo devolvido ao estoque.");
        await refetch();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Falha ao restaurar.");
      }
    },
    [refetch],
  );

  return (
    <QueryState
      loading={loading && !data}
      error={error}
      empty={Boolean(data) && filtered.length === 0 && editing === null}
      onRetry={refetch}
    >
      <QueryState.Loading />
      <QueryState.Error />
      <QueryState.Ready>
        <div className="space-y-5">
          <ModuleHeader
            title={title}
            count={`${filtered.length} ${countLabel}`}
            action={
              newLabel && podeEscrever ? (
                <Button onClick={() => setEditing("new")}>{newLabel}</Button>
              ) : undefined
            }
          />
          <p className="text-muted-foreground -mt-3 text-sm">{description}</p>
          <Input
            placeholder={searchPlaceholder}
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />
          {editing ? (
            <EntityForm
              fields={formFields}
              initial={editing === "new" ? null : editing}
              submitLabel={editing === "new" ? "Salvar" : "Atualizar"}
              onCancel={() => setEditing(null)}
              onSave={handleSave}
            />
          ) : null}
          <QueryState.Empty>
            <EmptyState
              title="Nenhum registro neste filtro"
              description="Cadastre o primeiro item ou limpe a busca."
              action={
                newLabel && podeEscrever ? (
                  <Button onClick={() => setEditing("new")}>{newLabel}</Button>
                ) : undefined
              }
            />
          </QueryState.Empty>
          <QueryState.Success>
            <EntityTable
              columns={columns}
              rows={filtered}
              onEdit={newLabel && podeEscrever ? setEditing : undefined}
              onDelete={restore || !podeEscrever ? undefined : handleDelete}
              extraAction={
                restore
                  ? (row) => (
                      <Button variant="ghost" size="sm" onClick={() => handleRestore(row.id)}>
                        Restaurar
                      </Button>
                    )
                  : undefined
              }
            />
          </QueryState.Success>
        </div>
      </QueryState.Ready>
    </QueryState>
  );
}
