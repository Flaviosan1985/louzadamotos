"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function BancosPage() {
  return (
    <CatalogPage
      title="Bancos"
      description="Contas usadas em financiamento, Pix e conciliação."
      newLabel="Novo banco"
      searchPlaceholder="Buscar banco ou agência"
      extraKey="bancos"
      countLabel="banco(s)"
      columns={[
        { header: "Banco", render: (row) => row.nome },
        { header: "Agência", render: (row) => row.agencia },
        { header: "Conta", render: (row) => row.conta },
        { header: "Pix", render: (row) => row.pix },
      ]}
      fields={[
        { key: "nome", label: "Banco", required: true },
        { key: "agencia", label: "Agência" },
        { key: "conta", label: "Conta" },
        { key: "pix", label: "Chave Pix" },
      ]}
    />
  );
}
