"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { saveCliente } from "@/lib/data/app-data";
import { filterClientes } from "@/lib/cadastros/filter-clientes";
import { pode } from "@/lib/negocio/permissoes";
import type { Cliente } from "@/lib/types/database";
import { useAppSnapshot } from "@/hooks/use-app-snapshot";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QueryState } from "@/components/shared/QueryState";
import { EmptyState } from "@/components/shared/EmptyState";
import { ClienteForm } from "@/components/cadastros/ClienteForm";
import { ClientesTable } from "@/components/cadastros/ClientesTable";

export function ClientesPage() {
  const { data, error, loading, refetch } = useAppSnapshot();
  const [busca, setBusca] = useState("");
  const [editing, setEditing] = useState<Cliente | null | "new">(null);
  const debouncedBusca = useDebounce(busca, 300);

  const podeEscrever = data ? pode(data.profile.papel, "comercial.escrever") : false;

  const filtered = useMemo(
    () => filterClientes(data?.clientes ?? [], debouncedBusca),
    [data, debouncedBusca],
  );

  const handleSave = useCallback(
    async (payload: {
      nome: string;
      tipo_pessoa: Cliente["tipo_pessoa"];
      documento: string | null;
      telefone: string | null;
      email: string | null;
      endereco: string | null;
    }) => {
      if (!data || editing === null) return;
      try {
        await saveCliente(
          editing === "new" ? { ...payload, tenant_id: data.tenant.id } : { id: editing.id, ...payload },
          data.mode === "demo",
        );
        toast.success(editing === "new" ? "Cliente cadastrado." : "Cliente atualizado.");
        setEditing(null);
        await refetch();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Falha ao salvar o cliente.");
        throw err;
      }
    },
    [data, editing, refetch],
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Clientes</h1>
            <p className="text-muted-foreground text-sm">{filtered.length} cadastro(s)</p>
          </div>
          {podeEscrever ? <Button onClick={() => setEditing("new")}>Novo cliente</Button> : null}
        </div>
        <Input
          placeholder="Buscar nome ou documento"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
        />
        {editing ? (
          <ClienteForm
            initial={editing === "new" ? null : editing}
            onCancel={() => setEditing(null)}
            onSave={handleSave}
          />
        ) : null}
        <QueryState.Empty>
          <EmptyState
            title="Nenhum cliente encontrado"
            description="Cadastre o primeiro cliente da revenda ou limpe a busca."
            action={
              podeEscrever ? <Button onClick={() => setEditing("new")}>Novo cliente</Button> : undefined
            }
          />
        </QueryState.Empty>
        <QueryState.Success>
          <ClientesTable
            clientes={filtered}
            onEdit={podeEscrever ? setEditing : undefined}
          />
        </QueryState.Success>
      </div>
      </QueryState.Ready>
    </QueryState>
  );
}
