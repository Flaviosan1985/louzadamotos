"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function ModulosPage() {
  return (
    <CatalogPage
      title="Módulos"
      description="Liga ou desliga funções extras da revenda."
      newLabel="Novo módulo"
      searchPlaceholder="Buscar módulo"
      extraKey="modulos"
      columns={[
        { header: "Módulo", render: (row) => row.nome },
        { header: "Ativo", render: (row) => (row.ativo === "sim" ? "Sim" : "Não") },
      ]}
      fields={[
        { key: "nome", label: "Nome", required: true },
        {
          key: "ativo",
          label: "Ativo",
          type: "select",
          options: [
            { value: "sim", label: "Sim" },
            { value: "nao", label: "Não" },
          ],
        },
      ]}
    />
  );
}
