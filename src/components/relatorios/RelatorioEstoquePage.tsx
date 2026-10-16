"use client";

import { useCallback } from "react";
import { ReportPage } from "@/components/shared/ReportPage";
import { formatCurrency, formatKm, formatPlaca } from "@/lib/format";
import type { AppSnapshot } from "@/hooks/use-app-snapshot";

export function RelatorioEstoquePage() {
  const buildRows = useCallback(
    (snapshot: AppSnapshot) =>
      snapshot.veiculos
        .filter((item) => item.status !== "vendido")
        .map((item) => ({
          id: item.id,
          tenant_id: item.tenant_id,
          criado_em: item.criado_em,
          veiculo: `${item.marca} ${item.modelo}`,
          placa: formatPlaca(item.placa),
          km: formatKm(item.km),
          venda: formatCurrency(item.preco_venda),
          status: item.status,
        })),
    [],
  );

  return (
    <ReportPage
      title="Listagem de estoque"
      description="Somente veículos disponíveis e reservados."
      buildRows={buildRows}
      columns={[
        { header: "Veículo", render: (row) => row.veiculo },
        { header: "Placa", render: (row) => row.placa },
        { header: "KM", render: (row) => row.km },
        { header: "Venda", render: (row) => row.venda },
        { header: "Status", render: (row) => row.status },
      ]}
    />
  );
}
