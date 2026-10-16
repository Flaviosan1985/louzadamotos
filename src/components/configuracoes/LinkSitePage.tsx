"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function LinkSitePage() {
  return (
    <CatalogPage
      title="Link com o site"
      description="Endereço da vitrine pública e token de integração."
      newLabel="Novo link"
      searchPlaceholder="Buscar URL"
      extraKey="linkSite"
      columns={[
        { header: "URL", render: (row) => row.url },
        { header: "Token", render: (row) => row.token },
        { header: "Publicado", render: (row) => (row.publicado === "sim" ? "Sim" : "Não") },
      ]}
      fields={[
        { key: "url", label: "URL da vitrine", required: true },
        { key: "token", label: "Token" },
        {
          key: "publicado",
          label: "Publicado",
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
