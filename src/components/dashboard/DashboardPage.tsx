"use client";

import { useMemo } from "react";
import { useAppSnapshot } from "@/hooks/use-app-snapshot";
import { formatPlaca } from "@/lib/format";
import { calcularIndicadores } from "@/lib/negocio/indicadores";
import { percentualComissao } from "@/lib/negocio/margem";
import { gerarTarefas, tarefasTransferencia } from "@/lib/negocio/tarefas";
import { transferenciasPendentes } from "@/lib/negocio/transferencia";
import { AVISO_CONTABIL } from "@/lib/negocio/avisos";
import { QueryState } from "@/components/shared/QueryState";
import { AvisoLegal } from "@/components/shared/AvisoLegal";
import { ShortcutBar } from "@/components/layout/ShortcutBar";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { DashboardHeading } from "@/components/dashboard/DashboardHeading";
import { DashboardHighlight } from "@/components/dashboard/DashboardHighlight";
import { DashboardIndicadores } from "@/components/dashboard/DashboardIndicadores";
import { DashboardMovements } from "@/components/dashboard/DashboardMovements";
import { DashboardProfile } from "@/components/dashboard/DashboardProfile";
import { DashboardTarefas } from "@/components/dashboard/DashboardTarefas";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardPage() {
  const { data, error, loading, refetch } = useAppSnapshot();
  const estoque = data?.veiculos.filter((item) => item.status !== "vendido").length ?? 0;

  const negocio = useMemo(() => {
    if (!data) return null;
    const agora = new Date();
    const pendentes = transferenciasPendentes(data.veiculos, data.extras.transferencias, agora);
    const nomes = Object.fromEntries(
      data.veiculos.map((v) => [v.id, `${v.marca} ${v.modelo} · ${formatPlaca(v.placa)}`]),
    );
    const tarefas = [
      ...tarefasTransferencia(pendentes, nomes),
      ...gerarTarefas({ kanban: data.extras.kanban, agenda: data.extras.agenda, agora }),
    ].sort(
      (a, b) =>
        (a.prioridade === b.prioridade ? 0 : a.prioridade === "alta" ? -1 : 1) ||
        a.quando.getTime() - b.quando.getTime(),
    );
    return {
      tarefas,
      indicadores: calcularIndicadores({
        veiculos: data.veiculos,
        financeiro: data.financeiro,
        kanban: data.extras.kanban,
        transferencias: data.extras.transferencias,
        comissaoPct: percentualComissao(data.extras.comissoes),
        agora,
      }),
    };
  }, [data]);

  return (
    <QueryState loading={loading && !data} error={error} empty={false} onRetry={refetch}>
      <QueryState.Loading>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </QueryState.Loading>
      <QueryState.Error />
      <QueryState.Ready>
        {data && negocio ? (
          <div className="space-y-4">
            <DashboardHeading title={data.tenant.nome} />
            <DashboardIndicadores indicadores={negocio.indicadores} />
            <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-4">
                <DashboardTarefas tarefas={negocio.tarefas} />
                <SalesChart veiculos={data.veiculos} financeiro={data.financeiro} />
                <DashboardMovements financeiro={data.financeiro} />
              </div>
              <div className="space-y-4">
                <DashboardProfile profile={data.profile} tenant={data.tenant} />
                <DashboardActions telefone={data.tenant.telefone} />
                <DashboardHighlight estoque={estoque} />
              </div>
            </div>
            <AvisoLegal texto={AVISO_CONTABIL} />
            <ShortcutBar />
          </div>
        ) : null}
      </QueryState.Ready>
    </QueryState>
  );
}
