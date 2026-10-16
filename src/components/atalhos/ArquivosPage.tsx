"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function ArquivosPage() {
  return (
    <CatalogPage
      title="Armazenamento digital"
      description="Documentos da loja: CRLV, contratos e laudos."
      newLabel="Novo arquivo"
      searchPlaceholder="Buscar arquivo"
      extraKey="arquivos"
      columns={[
        { header: "Nome", render: (row) => row.nome },
        { header: "Pasta", render: (row) => row.pasta },
        { header: "Atualizado", render: (row) => row.atualizado },
      ]}
      fields={[
        { key: "nome", label: "Nome", required: true },
        { key: "pasta", label: "Pasta" },
        { key: "atualizado", label: "Atualizado em", type: "date" },
      ]}
    />
  );
}
