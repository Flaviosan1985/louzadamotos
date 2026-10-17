import type { PapelUsuario } from "../types/database.ts";
import type { ExtraKey } from "../types/modulos.ts";
import type {
  MenuGroupSubItem,
  MenuItem,
  MenuSubItem,
  NavItem,
  ShortcutItem,
} from "../../configs/navConfig.ts";

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
  { prefixo: "/veiculos/adicionar", papeis: ["admin", "vendedor"] },
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
  return {
    icon: item.icon,
    label: item.label,
    badge: item.badge,
    badgeClassName: item.badgeClassName,
    childItems,
  };
}

export function filtrarNav(groups: NavItem[], papel: PapelUsuario): NavItem[] {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.map((item) => filtrarItem(item, papel)).filter((item): item is MenuItem => Boolean(item)),
    }))
    .filter((group) => group.items.length > 0);
}

export function filtrarAtalhos(items: ShortcutItem[], papel: PapelUsuario) {
  return items.filter((item) => rotaPermitida(item.href, papel));
}

const CATALOGO_USUARIOS: ExtraKey[] = ["usuarios"];
const CATALOGO_CONFIG: ExtraKey[] = [
  "impressos",
  "procedimentos",
  "mensagens",
  "linkSite",
  "comissoes",
  "modulos",
  "apiKeys",
];

export function escritaDoCatalogo(extraKey: ExtraKey, papel: PapelUsuario) {
  if (CATALOGO_USUARIOS.includes(extraKey)) return pode(papel, "usuarios.gerenciar");
  if (CATALOGO_CONFIG.includes(extraKey)) return pode(papel, "configuracoes.editar");
  return pode(papel, "comercial.escrever");
}
