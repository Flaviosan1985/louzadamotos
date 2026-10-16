"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function ComissoesPage() {
  return (
    <CatalogPage
      title="Gestão de comissões"
      description="Percentual e valor por venda de cada vendedor."
      newLabel="Nova comissão"
      searchPlaceholder="Buscar vendedor ou venda"
      extraKey="comissoes"
      columns={[
        { header: "Vendedor", render: (row) => row.vendedor },
        { header: "%", render: (row) => row.percentual },
        { header: "Venda", render: (row) => row.venda },
        { header: "Valor", render: (row) => row.valor },
      ]}
      fields={[
        { key: "vendedor", label: "Vendedor", required: true },
        { key: "percentual", label: "Percentual", required: true },
        { key: "venda", label: "Venda", required: true },
        { key: "valor", label: "Valor" },
      ]}
    />
  );
}
