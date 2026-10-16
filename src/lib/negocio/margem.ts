import { parseDecimalBR } from "./simulacao.ts";

export const CATEGORIA_COMPRA = "Compra de veículo";

type VeiculoMargem = { id: string; preco_custo: number; preco_venda: number };
type LancamentoMargem = { tipo: string; categoria: string; valor: number; veiculo_id: string | null };

export type Margem = {
  venda: number;
  custo: number;
  despesas: number;
  comissao: number;
  margem: number;
  margemPct: number | null;
};

/** A compra já está no custo do veículo; contá-la de novo zeraria a margem. */
export function margemVeiculo(veiculo: VeiculoMargem, financeiro: LancamentoMargem[], comissaoPct: number): Margem {
  const despesas = financeiro
    .filter((l) => l.tipo === "despesa" && l.veiculo_id === veiculo.id && l.categoria !== CATEGORIA_COMPRA)
    .reduce((soma, l) => soma + l.valor, 0);
  const venda = veiculo.preco_venda;
  const comissao = (venda * comissaoPct) / 100;
  const margem = venda - veiculo.preco_custo - despesas - comissao;
  return {
    venda,
    custo: veiculo.preco_custo,
    despesas,
    comissao,
    margem,
    margemPct: venda > 0 ? margem / venda : null,
  };
}

export function margemMedia(itens: { margemPct: number | null }[]): number | null {
  const validos = itens.map((i) => i.margemPct).filter((p): p is number => p !== null);
  if (validos.length === 0) return null;
  return validos.reduce((a, b) => a + b, 0) / validos.length;
}

export function percentualComissao(comissoes: { percentual?: string }[] | Record<string, string>[]): number {
  const valor = parseDecimalBR(comissoes[0]?.percentual ?? "");
  return Number.isFinite(valor) ? valor : 0;
}
