"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function LeilaoPage() {
  return (
    <CatalogPage
      title="Consulta de leilão"
      description="Histórico de consultas de placa em leilão."
      newLabel="Nova consulta"
      searchPlaceholder="Buscar placa"
      extraKey="leilao"
      columns={[
        { header: "Placa", render: (row) => row.placa },
        { header: "Resultado", render: (row) => row.resultado },
        { header: "Consultado", render: (row) => row.consultado },
      ]}
      fields={[
        { key: "placa", label: "Placa", required: true },
        { key: "resultado", label: "Resultado", required: true },
        { key: "consultado", label: "Consultado em", type: "date" },
      ]}
    />
  );
}
