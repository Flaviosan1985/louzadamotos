"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function IpvaPage() {
  return (
    <CatalogPage
      title="IPVA"
      description="Situação do IPVA dos veículos do pátio."
      newLabel="Novo lançamento"
      searchPlaceholder="Buscar placa"
      extraKey="ipva"
      columns={[
        { header: "Veículo", render: (row) => row.veiculo },
        { header: "Placa", render: (row) => row.placa },
        { header: "Ano", render: (row) => row.ano },
        { header: "Status", render: (row) => row.status },
        { header: "Valor", render: (row) => row.valor },
      ]}
      fields={[
        { key: "veiculo", label: "Veículo", required: true },
        { key: "placa", label: "Placa", required: true },
        { key: "ano", label: "Ano", required: true },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "pago", label: "Pago" },
            { value: "pendente", label: "Pendente" },
          ],
        },
        { key: "valor", label: "Valor" },
      ]}
    />
  );
}
