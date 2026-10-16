"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function RelatorioEmailsPage() {
  return (
    <CatalogPage
      title="E-mails"
      description="Mensagens disparadas pela revenda."
      newLabel="Registrar e-mail"
      searchPlaceholder="Buscar destinatário ou assunto"
      extraKey="emails"
      columns={[
        { header: "Destinatário", render: (row) => row.destinatario },
        { header: "Assunto", render: (row) => row.assunto },
        { header: "Status", render: (row) => row.status },
        { header: "Quando", render: (row) => row.quando },
      ]}
      fields={[
        { key: "destinatario", label: "Destinatário", type: "email", required: true },
        { key: "assunto", label: "Assunto", required: true },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "enviado", label: "Enviado" },
            { value: "falhou", label: "Falhou" },
          ],
        },
        { key: "quando", label: "Quando" },
      ]}
    />
  );
}
