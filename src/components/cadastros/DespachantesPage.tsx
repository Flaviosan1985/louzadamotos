"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function DespachantesPage() {
  return (
    <CatalogPage
      title="Despachantes"
      description="Parceiros de transferência, CRLV e Renave."
      newLabel="Novo despachante"
      searchPlaceholder="Buscar despachante"
      extraKey="despachantes"
      countLabel="despachante(s)"
      columns={[
        { header: "Nome", render: (row) => row.nome },
        { header: "Telefone", render: (row) => row.telefone },
        { header: "Cidade", render: (row) => row.cidade },
      ]}
      fields={[
        { key: "nome", label: "Nome", required: true },
        { key: "telefone", label: "Telefone", type: "tel" },
        { key: "cidade", label: "Cidade" },
      ]}
    />
  );
}
