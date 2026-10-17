export const SECTION_HREFS: Record<string, string> = {
  "/cadastros": "/cadastros/usuarios",
  "/veiculos": "/veiculos/a-venda",
  "/financeiro": "/financeiro/resumo",
  "/relatorios": "/relatorios/estatisticas",
  "/configuracoes": "/configuracoes/impressos",
  "/atalhos": "/atalhos/agenda",
};

const PANEL_PREFIXES = [
  "/sistema",
  "/cadastros",
  "/veiculos",
  "/financeiro",
  "/relatorios",
  "/configuracoes",
  "/atalhos",
  "/conta",
  "/suporte",
];

const VEICULO_LEAVES = new Set([
  "adicionar",
  "a-venda",
  "vendidos",
  "reservados",
  "emprestados",
  "conferencia",
  "renave",
  "pendencias",
  "cadastro-pendente",
  "excluidos",
]);

export function isPanelPath(pathname: string) {
  return PANEL_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function normalizePanelPath(pathname: string) {
  return SECTION_HREFS[pathname] ?? pathname;
}

export function matchVeiculoId(pathname: string) {
  const match = pathname.match(/^\/veiculos\/([^/]+)$/);
  if (!match) return null;
  const id = match[1];
  if (VEICULO_LEAVES.has(id)) return null;
  return id;
}
