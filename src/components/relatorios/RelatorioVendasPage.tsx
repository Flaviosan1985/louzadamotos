"use client";

import { useCallback } from "react";
import { ReportPage } from "@/components/shared/ReportPage";
import { formatCurrency, formatDate, formatPlaca } from "@/lib/format";
import type { AppSnapshot } from "@/hooks/use-app-snapshot";

export function RelatorioVendasPage() {
  const buildRows = useCallback(
    (snapshot: AppSnapshot) =>
      snapshot.veiculos
        .filter((item) => item.status === "vendido")
        .map((item) => ({
          id: item.id,
          tenant_id: item.tenant_id,
          criado_em: item.criado_em,
          veiculo: `${item.marca} ${item.modelo}`,
          placa: formatPlaca(item.placa),
          valor: formatCurrency(item.preco_venda),
          data: formatDate(item.vendido_em),
        })),
    [],
  );

  return (
    <ReportPage
      title="Vendas"
      description="Veículos com status vendido e data de saída."
      buildRows={buildRows}
      columns={[
        { header: "Veículo", render: (row) => row.veiculo },
        { header: "Placa", render: (row) => row.placa },
        { header: "Valor", render: (row) => row.valor },
        { header: "Data", render: (row) => row.data },
      ]}
    />
  );
}
