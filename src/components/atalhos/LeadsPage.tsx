"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function LeadsPage() {
  return (
    <CatalogPage
      title="Leads do mês"
      description="Pessoas que pediram contato e ainda não fecharam."
      newLabel="Novo lead"
      searchPlaceholder="Buscar nome ou interesse"
      extraKey="leads"
      columns={[
        { header: "Nome", render: (row) => row.nome },
        { header: "Telefone", render: (row) => row.telefone },
        { header: "Interesse", render: (row) => row.interesse },
        { header: "Proposta", render: (row) => row.proposta },
        { header: "Status", render: (row) => row.status },
        { header: "Origem", render: (row) => row.origem },
      ]}
      fields={[
        { key: "nome", label: "Nome", required: true },
        { key: "telefone", label: "Telefone", type: "tel" },
        { key: "interesse", label: "Interesse" },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "novo", label: "Novo" },
            { value: "atendimento", label: "Atendimento" },
            { value: "ganho", label: "Ganho" },
            { value: "perdido", label: "Perdido" },
          ],
        },
        { key: "origem", label: "Origem" },
      ]}
    />
  );
}
