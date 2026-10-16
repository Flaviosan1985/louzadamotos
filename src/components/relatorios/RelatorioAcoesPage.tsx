"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function RelatorioAcoesPage() {
  return (
    <CatalogPage
      title="Ações de usuários"
      description="Trilha de o que cada usuário fez no sistema."
      newLabel="Registrar ação"
      searchPlaceholder="Buscar usuário ou ação"
      extraKey="acoes"
      columns={[
        { header: "Usuário", render: (row) => row.usuario },
        { header: "Ação", render: (row) => row.acao },
        { header: "Quando", render: (row) => row.quando },
      ]}
      fields={[
        { key: "usuario", label: "Usuário", required: true },
        { key: "acao", label: "Ação", required: true },
        { key: "quando", label: "Quando" },
      ]}
    />
  );
}
