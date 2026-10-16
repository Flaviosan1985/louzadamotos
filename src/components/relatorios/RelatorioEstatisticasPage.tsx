"use client";

import { useCallback } from "react";
import { ReportPage } from "@/components/shared/ReportPage";
import { formatCurrency } from "@/lib/format";
import type { AppSnapshot } from "@/hooks/use-app-snapshot";

export function RelatorioEstatisticasPage() {
  const buildRows = useCallback((snapshot: AppSnapshot) => {
    const estoque = snapshot.veiculos.filter((item) => item.status !== "vendido").length;
    const vendidos = snapshot.veiculos.filter((item) => item.status === "vendido").length;
    const receber = snapshot.financeiro
      .filter((item) => item.tipo === "receita" && item.status === "pendente")
      .reduce((sum, item) => sum + item.valor, 0);
    return [
      { id: "1", tenant_id: snapshot.tenant.id, criado_em: "", indicador: "Estoque", valor: String(estoque) },
      { id: "2", tenant_id: snapshot.tenant.id, criado_em: "", indicador: "Vendidos", valor: String(vendidos) },
      { id: "3", tenant_id: snapshot.tenant.id, criado_em: "", indicador: "Clientes", valor: String(snapshot.clientes.length) },
      { id: "4", tenant_id: snapshot.tenant.id, criado_em: "", indicador: "A receber", valor: formatCurrency(receber) },
    ];
  }, []);

  return (
    <ReportPage
      title="Estatísticas"
      description="Resumo operacional da revenda no momento."
      buildRows={buildRows}
      columns={[
        { header: "Indicador", render: (row) => row.indicador },
        { header: "Valor", render: (row) => row.valor },
      ]}
    />
  );
}
