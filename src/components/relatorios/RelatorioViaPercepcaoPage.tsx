"use client";

import { useCallback } from "react";
import { ReportPage } from "@/components/shared/ReportPage";
import type { AppSnapshot } from "@/hooks/use-app-snapshot";

export function RelatorioViaPercepcaoPage() {
  const buildRows = useCallback((snapshot: AppSnapshot) => {
    const counts = new Map<string, number>();
    snapshot.extras.leads.forEach((lead) => {
      const origem = lead.origem || "Não informado";
      counts.set(origem, (counts.get(origem) ?? 0) + 1);
    });
    return Array.from(counts.entries()).map(([origem, total], index) => ({
      id: String(index),
      tenant_id: snapshot.tenant.id,
      criado_em: "",
      origem,
      total: String(total),
    }));
  }, []);

  return (
    <ReportPage
      title="Via de percepção"
      description="De onde os leads do mês chegaram."
      buildRows={buildRows}
      columns={[
        { header: "Origem", render: (row) => row.origem },
        { header: "Leads", render: (row) => row.total },
      ]}
    />
  );
}
