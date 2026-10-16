"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function AlmoxarifadoPage() {
  return (
    <CatalogPage
      title="Almoxarifado"
      description="Itens de apoio da loja: capacete, capa, kit estética."
      newLabel="Novo item"
      searchPlaceholder="Buscar item"
      extraKey="almoxarifado"
      countLabel="item(ns)"
      columns={[
        { header: "Item", render: (row) => row.item },
        { header: "Qtd", render: (row) => row.quantidade },
        { header: "Unidade", render: (row) => row.unidade },
        { header: "Local", render: (row) => row.local },
      ]}
      fields={[
        { key: "item", label: "Item", required: true },
        { key: "quantidade", label: "Quantidade", type: "number", required: true },
        { key: "unidade", label: "Unidade" },
        { key: "local", label: "Local" },
      ]}
    />
  );
}
