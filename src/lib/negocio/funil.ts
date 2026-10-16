export const ETAPAS = [
  "Novo lead",
  "Contatado",
  "Agendamento",
  "Compareceu",
  "Test drive",
  "Negociação",
  "Vendido",
  "Perdido",
] as const;

export type Etapa = (typeof ETAPAS)[number];

export type CartaoFunil = Record<string, string | undefined> & {
  coluna?: string;
  veiculo_id?: string;
  data_entrega?: string;
  agendado_para?: string;
  motivo_perda?: string;
  test_drive_em?: string;
  etapa_em?: string;
};

const TRILHA: readonly Etapa[] = ETAPAS.filter((e) => e !== "Perdido");

const LEGADO: Record<string, Etapa> = {
  Lead: "Novo lead",
  Atendimento: "Contatado",
  Proposta: "Negociação",
};

export function normalizarEtapa(coluna: string | undefined): Etapa {
  if (!coluna) return "Novo lead";
  if ((ETAPAS as readonly string[]).includes(coluna)) return coluna as Etapa;
  return LEGADO[coluna] ?? "Novo lead";
}

export function etapaVizinha(atual: Etapa, passo: -1 | 1): Etapa | null {
  const index = TRILHA.indexOf(atual);
  if (index < 0) return null;
  return TRILHA[index + passo] ?? null;
}

export function validarTransicao(
  cartao: CartaoFunil,
  destino: Etapa,
  ctx: { placaDoVeiculo: string | null },
): string | null {
  if (destino === "Agendamento" && !cartao.agendado_para) {
    return "Informe a data e a hora do agendamento.";
  }
  if (destino === "Negociação" && !cartao.test_drive_em) {
    return "Registre o test drive antes de ir para Negociação.";
  }
  if (destino === "Vendido") {
    if (!cartao.veiculo_id || !ctx.placaDoVeiculo) return "Escolha um veículo do estoque com placa.";
    if (!cartao.data_entrega) return "Informe a data de entrega.";
  }
  if (destino === "Perdido" && !cartao.motivo_perda?.trim()) {
    return "Informe o motivo da perda.";
  }
  return null;
}

const chaveNome = (nome: string | undefined) => (nome ?? "").trim().toLocaleLowerCase("pt-BR");

function mesmoVeiculo(cartao: CartaoFunil, nomeVeiculo: string) {
  const a = (cartao.veiculo ?? "").trim().toLocaleLowerCase("pt-BR");
  const b = nomeVeiculo.trim().toLocaleLowerCase("pt-BR");
  return Boolean(a && b && (b.startsWith(a) || a.startsWith(b)));
}

export function vendaDoVeiculo<C extends { id: string; nome: string }>(
  veiculoId: string,
  kanban: CartaoFunil[],
  clientes: C[],
  nomeVeiculo?: string,
) {
  const vendidos = kanban.filter((c) => normalizarEtapa(c.coluna) === "Vendido");
  const cartao =
    vendidos.find((c) => c.veiculo_id === veiculoId) ??
    (nomeVeiculo ? vendidos.find((c) => mesmoVeiculo(c, nomeVeiculo)) : undefined);
  const nomeComprador = (cartao?.cliente ?? "").trim();
  return {
    cartao: cartao ?? null,
    nomeComprador,
    dataEntrega: cartao?.data_entrega ?? "",
    cliente: nomeComprador ? (clientes.find((c) => chaveNome(c.nome) === chaveNome(nomeComprador)) ?? null) : null,
  };
}

export function aplicarTransicao<T extends CartaoFunil>(cartao: T, destino: Etapa, agora: string): T {
  const testDrive = destino === "Test drive" && !cartao.test_drive_em ? agora : cartao.test_drive_em;
  return { ...cartao, coluna: destino, etapa_em: agora, ...(testDrive ? { test_drive_em: testDrive } : {}) };
}
