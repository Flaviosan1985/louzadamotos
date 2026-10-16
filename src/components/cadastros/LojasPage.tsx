"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function LojasPage() {
  return (
    <CatalogPage
      title="Lojas/Locais"
      description="Unidades da revenda usadas no estoque e nos usuários."
      newLabel="Nova loja"
      searchPlaceholder="Buscar loja ou cidade"
      extraKey="lojas"
      countLabel="loja(s)"
      columns={[
        { header: "Nome", render: (row) => row.nome },
        { header: "Cidade", render: (row) => `${row.cidade}/${row.uf}` },
        { header: "Telefone", render: (row) => row.telefone },
        { header: "Responsável", render: (row) => row.responsavel },
      ]}
      fields={[
        { key: "nome", label: "Nome", required: true },
        { key: "cidade", label: "Cidade", required: true },
        { key: "uf", label: "UF", required: true },
        { key: "telefone", label: "Telefone", type: "tel" },
        { key: "responsavel", label: "Responsável" },
      ]}
    />
  );
}
