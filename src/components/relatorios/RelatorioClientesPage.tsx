"use client";

import { useCallback } from "react";
import { ReportPage } from "@/components/shared/ReportPage";
import type { AppSnapshot } from "@/hooks/use-app-snapshot";

export function RelatorioClientesPage() {
  const buildRows = useCallback(
    (snapshot: AppSnapshot) =>
      snapshot.clientes.map((item) => ({
        id: item.id,
        tenant_id: item.tenant_id,
        criado_em: item.criado_em,
        nome: item.nome,
        documento: item.documento ?? "—",
        telefone: item.telefone ?? "—",
        email: item.email ?? "—",
      })),
    [],
  );

  return (
    <ReportPage
      title="Relatório de clientes"
      description="Base de clientes da revenda."
      buildRows={buildRows}
      columns={[
        { header: "Nome", render: (row) => row.nome },
        { header: "Documento", render: (row) => row.documento },
        { header: "Telefone", render: (row) => row.telefone },
        { header: "E-mail", render: (row) => row.email },
      ]}
    />
  );
}
