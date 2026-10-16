"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function FornecedoresPage() {
  return (
    <CatalogPage
      title="Fornecedores"
      description="Origem de compra de veículos e peças."
      newLabel="Novo fornecedor"
      searchPlaceholder="Buscar nome ou documento"
      extraKey="fornecedores"
      countLabel="fornecedor(es)"
      columns={[
        { header: "Nome", render: (row) => row.nome },
        { header: "Documento", render: (row) => row.documento },
        { header: "Telefone", render: (row) => row.telefone },
        { header: "Cidade", render: (row) => row.cidade },
      ]}
      fields={[
        { key: "nome", label: "Nome", required: true },
        { key: "documento", label: "CNPJ" },
        { key: "telefone", label: "Telefone", type: "tel" },
        { key: "cidade", label: "Cidade" },
      ]}
    />
  );
}
