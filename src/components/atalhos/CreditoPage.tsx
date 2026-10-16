"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function CreditoPage() {
  return (
    <CatalogPage
      title="Fichas de crédito"
      description="Análises de financiamento em andamento e aprovadas."
      newLabel="Nova ficha"
      searchPlaceholder="Buscar cliente ou banco"
      extraKey="credito"
      columns={[
        { header: "Cliente", render: (row) => row.cliente },
        { header: "Banco", render: (row) => row.banco },
        { header: "Valor", render: (row) => row.valor },
        { header: "Status", render: (row) => row.status },
      ]}
      fields={[
        { key: "cliente", label: "Cliente", required: true },
        { key: "banco", label: "Banco", required: true },
        { key: "valor", label: "Valor" },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "em analise", label: "Em análise" },
            { value: "aprovada", label: "Aprovada" },
            { value: "recusada", label: "Recusada" },
          ],
        },
      ]}
    />
  );
}
