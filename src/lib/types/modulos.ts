export type ModuleRow = {
  id: string;
  tenant_id: string;
  criado_em: string;
} & Record<string, string>;

export type ExtraKey =
  | "usuarios"
  | "lojas"
  | "fornecedores"
  | "bancos"
  | "despachantes"
  | "almoxarifado"
  | "emprestimos"
  | "conferencia"
  | "renave"
  | "pendencias"
  | "excluidos"
  | "emails"
  | "acoes"
  | "impressos"
  | "procedimentos"
  | "mensagens"
  | "linkSite"
  | "comissoes"
  | "modulos"
  | "apiKeys"
  | "leilao"
  | "ipva"
  | "credito"
  | "leads"
  | "procurados"
  | "agenda"
  | "arquivos"
  | "notas"
  | "kanban"
  | "simulacoes"
  | "transferencias"
  | "checklists"
  | "tarefas"
  | "vendas"
  | "documentos"
  | "contratos"
  | "modelosContrato"
  | "auditLog";

export type DemoExtras = Record<ExtraKey, ModuleRow[]>;

export type CatalogField = {
  key: string;
  label: string;
  type?: "text" | "email" | "tel" | "select" | "number" | "date" | "textarea";
  options?: { value: string; label: string }[];
  required?: boolean;
};

export type CatalogColumn = {
  header: string;
  render: (row: ModuleRow) => string;
};
