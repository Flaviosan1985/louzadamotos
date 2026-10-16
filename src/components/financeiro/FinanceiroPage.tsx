"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { saveFinanceiro } from "@/lib/data/app-data";
import { filterLancamentos } from "@/lib/financeiro/filter-lancamentos";
import { todayISO } from "@/lib/format";
import type { LancamentoFinanceiro, StatusFinanceiro } from "@/lib/types/database";
import { useAppSnapshot } from "@/hooks/use-app-snapshot";
import { Input } from "@/components/ui/input";
import { QueryState } from "@/components/shared/QueryState";
import { EmptyState } from "@/components/shared/EmptyState";
import { FinanceiroTable } from "@/components/financeiro/FinanceiroTable";

export function FinanceiroPage({ title }: { title: string }) {
  const { data, error, loading, refetch } = useAppSnapshot();
  const [status, setStatus] = useState<StatusFinanceiro | "todos">("todos");
  const [de, setDe] = useState("");
  const [ate, setAte] = useState("");

  const filtered = useMemo(
    () => filterLancamentos(data?.financeiro ?? [], status, de, ate),
    [data, status, de, ate],
  );

  const handleToggle = useCallback(
    async (item: LancamentoFinanceiro) => {
      if (!data) return;
      try {
        const pago = item.status !== "pago";
        await saveFinanceiro(
          {
            id: item.id,
            status: pago ? "pago" : "pendente",
            data_pagamento: pago ? todayISO() : null,
          },
          data.mode === "demo",
        );
        toast.success(pago ? "Lançamento baixado." : "Lançamento reaberto.");
        await refetch();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Falha ao atualizar.");
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
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-muted-foreground text-sm">Contas a pagar e receber da revenda</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <select
            className="border-input h-9 rounded-md border bg-transparent px-2.5 text-sm"
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFinanceiro | "todos")}
          >
            <option value="todos">Todos os status</option>
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
          </select>
          <Input type="date" value={de} onChange={(event) => setDe(event.target.value)} />
          <Input type="date" value={ate} onChange={(event) => setAte(event.target.value)} />
        </div>
        <QueryState.Empty>
          <EmptyState
            title="Nenhum lançamento neste período"
            description="Altere o status ou o intervalo de vencimento."
          />
        </QueryState.Empty>
        <QueryState.Success>
          <FinanceiroTable lancamentos={filtered} onToggle={handleToggle} />
        </QueryState.Success>
      </div>
      </QueryState.Ready>
    </QueryState>
  );
}
