"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function ImpressosPage() {
  return (
    <CatalogPage
      title="Impressos"
      description="Contrato de venda, recibo e termo de responsabilidade."
      newLabel="Novo impresso"
      searchPlaceholder="Buscar modelo"
      extraKey="impressos"
      columns={[
        { header: "Nome", render: (row) => row.nome },
        { header: "Modelo", render: (row) => row.modelo },
        { header: "Atualizado", render: (row) => row.atualizado },
      ]}
      fields={[
        { key: "nome", label: "Nome", required: true },
        { key: "modelo", label: "Código do modelo", required: true },
        { key: "atualizado", label: "Atualizado em", type: "date" },
      ]}
    />
  );
}
