"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function AgendaPage() {
  return (
    <CatalogPage
      title="Agenda"
      description="Entregas, avaliações e visitas marcadas."
      newLabel="Novo compromisso"
      searchPlaceholder="Buscar compromisso"
      extraKey="agenda"
      columns={[
        { header: "Título", render: (row) => row.titulo },
        { header: "Quando", render: (row) => row.quando },
        { header: "Cliente", render: (row) => row.cliente },
        { header: "Local", render: (row) => row.local },
      ]}
      fields={[
        { key: "titulo", label: "Título", required: true },
        { key: "quando", label: "Quando", required: true },
        { key: "cliente", label: "Cliente" },
        { key: "local", label: "Local" },
      ]}
    />
  );
}
