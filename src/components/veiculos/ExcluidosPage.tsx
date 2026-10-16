"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function ExcluidosPage() {
  return (
    <CatalogPage
      title="Excluídos"
      description="Veículos removidos do pátio. Restaure para devolver ao estoque operacional."
      searchPlaceholder="Buscar placa ou veículo"
      extraKey="excluidos"
      countLabel="excluído(s)"
      restore
      columns={[
        { header: "Veículo", render: (row) => row.veiculo },
        { header: "Placa", render: (row) => row.placa },
        { header: "Status anterior", render: (row) => row.status },
        { header: "Excluído em", render: (row) => row.excluido_em },
      ]}
      fields={[]}
    />
  );
}
