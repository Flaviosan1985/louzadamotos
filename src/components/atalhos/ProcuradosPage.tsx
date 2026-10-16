"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function ProcuradosPage() {
  return (
    <CatalogPage
      title="Veículos procurados"
      description="Pedidos de clientes para quando entrar um modelo no pátio."
      newLabel="Novo pedido"
      searchPlaceholder="Buscar marca ou cliente"
      extraKey="procurados"
      columns={[
        { header: "Marca", render: (row) => row.marca },
        { header: "Modelo", render: (row) => row.modelo },
        { header: "Ano", render: (row) => row.ano },
        { header: "Cliente", render: (row) => row.cliente },
        { header: "Telefone", render: (row) => row.telefone },
      ]}
      fields={[
        { key: "marca", label: "Marca", required: true },
        { key: "modelo", label: "Modelo", required: true },
        { key: "ano", label: "Ano" },
        { key: "cliente", label: "Cliente", required: true },
        { key: "telefone", label: "Telefone", type: "tel" },
      ]}
    />
  );
}
