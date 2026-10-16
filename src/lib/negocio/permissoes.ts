import type { PapelUsuario } from "../types/database.ts";
import type { MenuGroupSubItem, MenuItem, MenuSubItem, NavItem } from "../../configs/navConfig.ts";

const isSubGroup = (item: MenuSubItem): item is MenuGroupSubItem => "childItems" in item;

export type Acao =
  | "financeiro.acessar"
  | "usuarios.gerenciar"
  | "configuracoes.editar"
  | "modelos_contrato.editar"
  | "cliente.anonimizar"
  | "cliente.excluir"
  | "cliente.exportar"
  | "comercial.escrever"
  | "documentos.anexar"
  | "audit.ler"
  | "contratos.gerar";

const ADMIN: Acao[] = [
  "financeiro.acessar",
  "usuarios.gerenciar",
  "configuracoes.editar",
  "modelos_contrato.editar",
  "cliente.anonimizar",
  "cliente.exportar",
  "comercial.escrever",
  "documentos.anexar",
  "audit.ler",
  "contratos.gerar",
];

const VENDEDOR: Acao[] = [
  "cliente.exportar",
  "comercial.escrever",
  "documentos.anexar",
  "contratos.gerar",
];

const FINANCEIRO: Acao[] = ["financeiro.acessar", "audit.ler", "cliente.exportar"];

const POR_PAPEL: Record<PapelUsuario, readonly Acao[]> = {
  admin: ADMIN,
  vendedor: VENDEDOR,
  financeiro: FINANCEIRO,
};

export function pode(papel: PapelUsuario, acao: Acao) {
  return POR_PAPEL[papel].includes(acao);
}

const PREFIXOS: { prefixo: string; papeis: PapelUsuario[] }[] = [
  { prefixo: "/cadastros/usuarios", papeis: ["admin"] },
  { prefixo: "/financeiro", papeis: ["admin", "financeiro"] },
  { prefixo: "/relatorios/acoes", papeis: ["admin"] },
  { prefixo: "/relatorios/financas", papeis: ["admin", "financeiro"] },
  { prefixo: "/configuracoes/contratos", papeis: ["admin"] },
  { prefixo: "/configuracoes/tutorial", papeis: ["admin", "vendedor", "financeiro"] },
  { prefixo: "/configuracoes", papeis: ["admin"] },
];

export function rotaPermitida(pathname: string, papel: PapelUsuario) {
  const regra = PREFIXOS.find(
    (item) => pathname === item.prefixo || pathname.startsWith(`${item.prefixo}/`),
  );
  if (!regra) return true;
  return regra.papeis.includes(papel);
}

function leafPermitida(href: string, papel: PapelUsuario) {
  return rotaPermitida(href, papel);
}

function filtrarSub(sub: MenuSubItem, papel: PapelUsuario): MenuSubItem | null {
  if (isSubGroup(sub)) {
    const childItems = sub.childItems.filter((leaf) => leafPermitida(leaf.href, papel));
    return childItems.length ? { ...sub, childItems } : null;
  }
  return leafPermitida(sub.href, papel) ? sub : null;
}

function filtrarItem(item: MenuItem, papel: PapelUsuario): MenuItem | null {
  if (item.href) {
    return leafPermitida(item.href, papel) ? item : null;
  }
  const childItems = (item.childItems ?? [])
    .map((sub) => filtrarSub(sub, papel))
    .filter((sub): sub is MenuSubItem => Boolean(sub));
  if (!childItems.length) return null;
  return { ...item, childItems };
}

export function filtrarNav(groups: NavItem[], papel: PapelUsuario): NavItem[] {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.map((item) => filtrarItem(item, papel)).filter((item): item is MenuItem => Boolean(item)),
    }))
    .filter((group) => group.items.length > 0);
}
