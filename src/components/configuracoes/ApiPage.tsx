"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function ApiPage() {
  return (
    <CatalogPage
      title="API"
      description="Chaves de integração com o site e outros sistemas."
      newLabel="Nova chave"
      searchPlaceholder="Buscar chave"
      extraKey="apiKeys"
      columns={[
        { header: "Nome", render: (row) => row.nome },
        { header: "Chave", render: (row) => row.chave },
        { header: "Criada", render: (row) => row.criado },
      ]}
      fields={[
        { key: "nome", label: "Nome", required: true },
        { key: "chave", label: "Chave", required: true },
        { key: "criado", label: "Criada em", type: "date" },
      ]}
    />
  );
}
