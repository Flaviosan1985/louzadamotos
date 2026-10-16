"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function MensagensPage() {
  return (
    <CatalogPage
      title="Mensagens"
      description="Textos prontos para WhatsApp e SMS. Use {{veiculo}} como variável."
      newLabel="Nova mensagem"
      searchPlaceholder="Buscar título"
      extraKey="mensagens"
      columns={[
        { header: "Canal", render: (row) => row.canal },
        { header: "Título", render: (row) => row.titulo },
        { header: "Texto", render: (row) => row.texto },
      ]}
      fields={[
        {
          key: "canal",
          label: "Canal",
          type: "select",
          options: [
            { value: "WhatsApp", label: "WhatsApp" },
            { value: "SMS", label: "SMS" },
            { value: "E-mail", label: "E-mail" },
          ],
        },
        { key: "titulo", label: "Título", required: true },
        { key: "texto", label: "Texto", type: "textarea", required: true },
      ]}
    />
  );
}
