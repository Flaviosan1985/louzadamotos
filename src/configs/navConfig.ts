import type * as Icon from "lucide-react";

type IconName = keyof typeof Icon;

export type MenuLeafSubItem = {
  label: string;
  href: string;
  activePath?: string;
  badge?: string;
  badgeClassName?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
};

export type MenuGroupSubItem = {
  label: string;
  childItems: MenuLeafSubItem[];
};

export type MenuSubItem = MenuLeafSubItem | MenuGroupSubItem;

export type MenuItem = {
  icon: IconName;
  label: string;
} & (
  | {
      href: string;
      badge?: string;
      badgeClassName?: string;
      childItems?: never;
      target?: "_blank" | "_self" | "_parent" | "_top";
    }
  | {
      href?: never;
      badge?: string;
      badgeClassName?: string;
      childItems: MenuSubItem[];
    }
);

export type NavItem = {
  groupLabel?: string;
  items: MenuItem[];
};

export type ShortcutItem = {
  label: string;
  href: string;
  icon: IconName;
};

export const navItems: NavItem[] = [
  {
    items: [
      {
        icon: "LayoutDashboard",
        label: "Dashboard",
        href: "/sistema",
      },
      {
        icon: "Contact",
        label: "Cadastros",
        childItems: [
          { label: "Usuários", href: "/cadastros/usuarios" },
          { label: "Lojas/Locais", href: "/cadastros/lojas" },
          { label: "Clientes", href: "/cadastros/clientes" },
          { label: "Fornecedores", href: "/cadastros/fornecedores" },
          { label: "Bancos", href: "/cadastros/bancos" },
          { label: "Despachantes", href: "/cadastros/despachantes" },
          { label: "Almoxarifado", href: "/cadastros/almoxarifado" },
        ],
      },
      {
        icon: "Car",
        label: "Veículos",
        childItems: [
          { label: "Adicionar", href: "/veiculos/adicionar" },
          { label: "À venda", href: "/veiculos/a-venda", activePath: "/veiculos/a-venda" },
          { label: "Vendidos", href: "/veiculos/vendidos" },
          { label: "Reservados", href: "/veiculos/reservados" },
          { label: "Emprestados", href: "/veiculos/emprestados" },
          { label: "Conferência", href: "/veiculos/conferencia" },
          { label: "Renave", href: "/veiculos/renave" },
          { label: "Pendências", href: "/veiculos/pendencias" },
          { label: "Cadastro Pendente", href: "/veiculos/cadastro-pendente" },
          { label: "Excluídos", href: "/veiculos/excluidos" },
        ],
      },
      {
        icon: "Wallet",
        label: "Financeiro",
        childItems: [
          { label: "Resumo", href: "/financeiro/resumo" },
          { label: "Fluxo de caixa", href: "/financeiro/fluxo-caixa" },
          { label: "Painel", href: "/financeiro/painel" },
        ],
      },
      {
        icon: "BarChart3",
        label: "Relatórios",
        childItems: [
          { label: "Estatísticas", href: "/relatorios/estatisticas" },
          { label: "Finanças", href: "/relatorios/financas" },
          { label: "Veículos", href: "/relatorios/veiculos" },
          { label: "Clientes", href: "/relatorios/clientes" },
          { label: "Vendas", href: "/relatorios/vendas" },
          { label: "E-mails", href: "/relatorios/emails" },
          { label: "Listagem de estoque", href: "/relatorios/estoque" },
          { label: "Ações de usuários", href: "/relatorios/acoes" },
          { label: "Via de percepção", href: "/relatorios/via-percepcao" },
        ],
      },
      {
        icon: "Settings",
        label: "Configurações",
        childItems: [
          { label: "Impressos", href: "/configuracoes/impressos" },
          { label: "Procedimentos", href: "/configuracoes/procedimentos" },
          { label: "Mensagens", href: "/configuracoes/mensagens" },
          { label: "Link com o site", href: "/configuracoes/link-site" },
          { label: "Propriedades", href: "/configuracoes/propriedades" },
          { label: "Tutorial", href: "/configuracoes/tutorial" },
          { label: "Gestão de comissões", href: "/configuracoes/comissoes" },
          { label: "Módulos", href: "/configuracoes/modulos" },
          { label: "API", href: "/configuracoes/api" },
        ],
      },
    ],
  },
];

export const shortcutItems: ShortcutItem[] = [
  { label: "Renave", href: "/veiculos/renave", icon: "FileCheck" },
  { label: "Dashboard", href: "/sistema", icon: "LayoutDashboard" },
  { label: "Consulta de leilão", href: "/atalhos/leilao", icon: "Search" },
  { label: "DRE", href: "/financeiro/painel", icon: "PieChart" },
  { label: "IPVA", href: "/atalhos/ipva", icon: "Car" },
  { label: "Fichas de crédito", href: "/atalhos/credito", icon: "ClipboardList" },
  { label: "Leads do mês", href: "/atalhos/leads", icon: "Filter" },
  { label: "Veículos procurados", href: "/atalhos/procurados", icon: "ScanSearch" },
  { label: "Agenda", href: "/atalhos/agenda", icon: "Calendar" },
  { label: "Armazenamento digital", href: "/atalhos/arquivos", icon: "Folder" },
  { label: "Simulador", href: "/atalhos/calculadora", icon: "Calculator" },
  { label: "Nota fiscal", href: "/atalhos/nfe", icon: "FileText" },
  { label: "Impressos", href: "/configuracoes/impressos", icon: "Printer" },
  { label: "Kanban", href: "/atalhos/kanban", icon: "Kanban" },
  { label: "Tutorial", href: "/configuracoes/tutorial", icon: "CircleHelp" },
];
