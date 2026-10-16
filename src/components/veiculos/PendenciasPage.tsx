"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function PendenciasPage() {
  return (
    <CatalogPage
      title="Pendências"
      description="Documentos e obrigações em aberto na compra ou na venda."
      newLabel="Nova pendência"
      searchPlaceholder="Buscar veículo ou tipo"
      extraKey="pendencias"
      countLabel="pendência(s)"
      columns={[
        { header: "Veículo", render: (row) => row.veiculo },
        { header: "Tipo", render: (row) => row.tipo },
        { header: "Descrição", render: (row) => row.descricao },
        { header: "Status", render: (row) => row.status },
      ]}
      fields={[
        { key: "veiculo", label: "Veículo", required: true },
        { key: "tipo", label: "Tipo", required: true },
        { key: "descricao", label: "Descrição", type: "textarea" },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "aberta", label: "Aberta" },
            { value: "resolvida", label: "Resolvida" },
          ],
        },
      ]}
    />
  );
}
