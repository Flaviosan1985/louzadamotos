"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function ProcedimentosPage() {
  return (
    <CatalogPage
      title="Procedimentos"
      description="Passos padrão de compra e venda na loja."
      newLabel="Novo procedimento"
      searchPlaceholder="Buscar procedimento"
      extraKey="procedimentos"
      columns={[
        { header: "Nome", render: (row) => row.nome },
        { header: "Etapa", render: (row) => row.etapa },
        { header: "Conteúdo", render: (row) => row.conteudo },
      ]}
      fields={[
        { key: "nome", label: "Nome", required: true },
        { key: "etapa", label: "Etapa", required: true },
        { key: "conteudo", label: "Conteúdo", type: "textarea", required: true },
      ]}
    />
  );
}
