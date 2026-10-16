"use client";

import { CatalogPage } from "@/components/shared/CatalogPage";

export function UsuariosPage() {
  return (
    <CatalogPage
      title="Usuários"
      description="Quem acessa o sistema da revenda e com qual papel."
      newLabel="Novo usuário"
      searchPlaceholder="Buscar nome ou e-mail"
      extraKey="usuarios"
      countLabel="usuário(s)"
      columns={[
        { header: "Nome", render: (row) => row.nome },
        { header: "E-mail", render: (row) => row.email },
        { header: "Papel", render: (row) => row.papel },
        { header: "Loja", render: (row) => row.loja },
        { header: "Ativo", render: (row) => (row.ativo === "sim" ? "Sim" : "Não") },
      ]}
      fields={[
        { key: "nome", label: "Nome", required: true },
        { key: "email", label: "E-mail", type: "email", required: true },
        {
          key: "papel",
          label: "Papel",
          type: "select",
          options: [
            { value: "admin", label: "Admin" },
            { value: "vendedor", label: "Vendedor" },
            { value: "financeiro", label: "Financeiro" },
          ],
        },
        { key: "loja", label: "Loja", required: true },
        {
          key: "ativo",
          label: "Ativo",
          type: "select",
          options: [
            { value: "sim", label: "Sim" },
            { value: "nao", label: "Não" },
          ],
        },
      ]}
    />
  );
}
