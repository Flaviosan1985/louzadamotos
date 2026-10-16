"use client";

import { useCallback } from "react";
import { ReportPage } from "@/components/shared/ReportPage";
import { AvisoLegal } from "@/components/shared/AvisoLegal";
import { formatCurrency, formatPlaca } from "@/lib/format";
import { AVISO_CONTABIL } from "@/lib/negocio/avisos";
import { margemVeiculo, percentualComissao } from "@/lib/negocio/margem";
import type { AppSnapshot } from "@/hooks/use-app-snapshot";

const pct = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 });

export function RelatorioVeiculosPage() {
  const buildRows = useCallback((snapshot: AppSnapshot) => {
    const comissaoPct = percentualComissao(snapshot.extras.comissoes);
    return snapshot.veiculos.map((item) => {
      const m = margemVeiculo(item, snapshot.financeiro, comissaoPct);
      return {
        id: item.id,
        tenant_id: item.tenant_id,
        criado_em: item.criado_em,
        veiculo: `${item.marca} ${item.modelo}`,
        placa: formatPlaca(item.placa),
        status: item.status,
        custo: formatCurrency(m.custo),
        despesas: formatCurrency(m.despesas),
        venda: formatCurrency(item.preco_venda),
        margem: `${formatCurrency(m.margem)}${m.margemPct !== null ? ` (${pct.format(m.margemPct)})` : ""}`,
      };
    });
  }, []);

  return (
    <ReportPage
      title="Relatório de veículos"
      description="Estoque completo com margem: venda menos custo, despesas do veículo e comissão."
      buildRows={buildRows}
      columns={[
        { header: "Veículo", render: (row) => row.veiculo },
        { header: "Placa", render: (row) => row.placa },
        { header: "Status", render: (row) => row.status },
        { header: "Custo", render: (row) => row.custo },
        { header: "Despesas", render: (row) => row.despesas },
        { header: "Venda", render: (row) => row.venda },
        { header: "Margem", render: (row) => row.margem },
      ]}
      footer={<AvisoLegal texto={AVISO_CONTABIL} />}
    />
  );
}
