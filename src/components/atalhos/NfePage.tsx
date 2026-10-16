"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function NfePage() {
  return (
    <CatalogPage
      title="Nota fiscal"
      description="Notas emitidas nas vendas da revenda."
      newLabel="Nova nota"
      searchPlaceholder="Buscar número, cliente ou veículo"
      extraKey="notas"
      countLabel="nota(s)"
      columns={[
        { header: "Número", render: (row) => row.numero },
        { header: "Cliente", render: (row) => row.cliente },
        { header: "Veículo", render: (row) => row.veiculo },
        { header: "Valor", render: (row) => row.valor },
        { header: "Status", render: (row) => row.status },
        { header: "Emitida", render: (row) => row.emitida },
      ]}
      fields={[
        { key: "numero", label: "Número", required: true },
        { key: "cliente", label: "Cliente", required: true },
        { key: "veiculo", label: "Veículo", required: true },
        { key: "valor", label: "Valor", required: true },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "rascunho", label: "Rascunho" },
            { value: "emitida", label: "Emitida" },
            { value: "cancelada", label: "Cancelada" },
          ],
        },
        { key: "emitida", label: "Emitida em", type: "date" },
      ]}
    />
  );
}
