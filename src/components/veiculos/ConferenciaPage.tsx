"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function ConferenciaPage() {
  return (
    <CatalogPage
      title="Conferência"
      description="Entradas e saídas que ainda precisam ser conferidas antes do destino final."
      newLabel="Nova conferência"
      searchPlaceholder="Buscar veículo"
      extraKey="conferencia"
      countLabel="movimento(s)"
      columns={[
        { header: "Veículo", render: (row) => row.veiculo },
        { header: "Tipo", render: (row) => row.tipo },
        { header: "Status", render: (row) => row.status },
        { header: "Data", render: (row) => row.data },
      ]}
      fields={[
        { key: "veiculo", label: "Veículo", required: true },
        {
          key: "tipo",
          label: "Tipo",
          type: "select",
          options: [
            { value: "entrada", label: "Entrada" },
            { value: "saida", label: "Saída" },
          ],
        },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "pendente", label: "Pendente" },
            { value: "conferido", label: "Conferido" },
          ],
        },
        { key: "data", label: "Data", type: "date", required: true },
      ]}
    />
  );
}
