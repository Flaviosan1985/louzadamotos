"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function EmprestadosPage() {
  return (
    <CatalogPage
      title="Emprestados"
      description="Veículos que saíram do pátio em empréstimo e ainda não voltaram."
      newLabel="Registrar empréstimo"
      searchPlaceholder="Buscar placa ou cliente"
      extraKey="emprestimos"
      countLabel="empréstimo(s)"
      columns={[
        { header: "Veículo", render: (row) => row.veiculo },
        { header: "Placa", render: (row) => row.placa },
        { header: "Cliente", render: (row) => row.cliente },
        { header: "Saída", render: (row) => row.saida },
        { header: "Previsão", render: (row) => row.previsao },
        { header: "Status", render: (row) => row.status },
      ]}
      fields={[
        { key: "veiculo", label: "Veículo", required: true },
        { key: "placa", label: "Placa", required: true },
        { key: "cliente", label: "Cliente", required: true },
        { key: "saida", label: "Data de saída", type: "date", required: true },
        { key: "previsao", label: "Previsão de retorno", type: "date" },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "aberto", label: "Aberto" },
            { value: "devolvido", label: "Devolvido" },
          ],
        },
      ]}
    />
  );
}
