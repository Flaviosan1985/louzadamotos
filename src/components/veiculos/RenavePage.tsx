"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function RenavePage() {
  return (
    <CatalogPage
      title="Renave"
      description="Protocolos de entrada e baixa no registro nacional de veículos em estoque."
      newLabel="Novo protocolo"
      searchPlaceholder="Buscar placa ou protocolo"
      extraKey="renave"
      countLabel="protocolo(s)"
      columns={[
        { header: "Veículo", render: (row) => row.veiculo },
        { header: "Placa", render: (row) => row.placa },
        { header: "Status", render: (row) => row.status },
        { header: "Protocolo", render: (row) => row.protocolo },
      ]}
      fields={[
        { key: "veiculo", label: "Veículo", required: true },
        { key: "placa", label: "Placa", required: true },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "pendente", label: "Pendente" },
            { value: "enviado", label: "Enviado" },
            { value: "baixado", label: "Baixado" },
          ],
        },
        { key: "protocolo", label: "Protocolo" },
      ]}
    />
  );
}
