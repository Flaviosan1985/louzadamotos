"use client";

import { useCallback } from "react";
import { ReportPage } from "@/components/shared/ReportPage";
import { formatCurrency, formatDate } from "@/lib/format";
import type { AppSnapshot } from "@/hooks/use-app-snapshot";

export function RelatorioFinancasPage() {
  const buildRows = useCallback(
    (snapshot: AppSnapshot) =>
      snapshot.financeiro.map((item) => ({
        id: item.id,
        tenant_id: item.tenant_id,
        criado_em: item.criado_em,
        tipo: item.tipo,
        categoria: item.categoria,
        descricao: item.descricao,
        valor: formatCurrency(item.valor),
        vencimento: formatDate(item.data_vencimento),
        status: item.status,
      })),
    [],
  );

  return (
    <ReportPage
      title="Finanças"
      description="Todos os lançamentos de contas a pagar e receber."
      buildRows={buildRows}
      columns={[
        { header: "Tipo", render: (row) => row.tipo },
        { header: "Categoria", render: (row) => row.categoria },
        { header: "Descrição", render: (row) => row.descricao },
        { header: "Valor", render: (row) => row.valor },
        { header: "Vencimento", render: (row) => row.vencimento },
        { header: "Status", render: (row) => row.status },
      ]}
    />
  );
}
