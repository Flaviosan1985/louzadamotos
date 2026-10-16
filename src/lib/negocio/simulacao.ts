export type SimulacaoEntrada = {
  valor: number;
  desconto: number;
  entrada: number;
  troca: number;
  prazo: number;
  taxaMensalPct: number;
  tarifas: number;
  iof: number;
  renda: number;
};

export type CenarioFinanciado = {
  valorLiquido: number;
  valorFinanciado: number;
  parcela: number;
  totalPago: number;
  juros: number;
  cetMensal: number;
  cetAnual: number;
  comprometimentoRenda: number | null;
  alertaRenda: boolean;
};

export type ResultadoSimulacao = {
  aVista: { total: number };
  financiado: CenarioFinanciado | null;
  comTroca: CenarioFinanciado | null;
};

export const PRAZO_MIN = 12;
export const PRAZO_MAX = 60;
export const LIMITE_RENDA = 0.3;

export function parcelaPrice(pv: number, taxa: number, n: number): number {
  if (taxa === 0) return pv / n;
  return (pv * taxa) / (1 - Math.pow(1 + taxa, -n));
}

/** Taxa mensal que iguala o valor líquido recebido ao fluxo de parcelas (TIR). */
export function taxaImplicita(liquido: number, parcela: number, n: number): number {
  if (parcela * n <= liquido) return 0;
  const presente = (i: number) => (parcela * (1 - Math.pow(1 + i, -n))) / i;
  let lo = 1e-9;
  let hi = 1;
  for (let k = 0; k < 200; k++) {
    const mid = (lo + hi) / 2;
    if (presente(mid) > liquido) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

function cenario(
  liquido: number,
  entradaPaga: number,
  e: SimulacaoEntrada,
): CenarioFinanciado | null {
  if (liquido <= 0) return null;
  const taxa = e.taxaMensalPct / 100;
  const valorFinanciado = liquido + e.tarifas + e.iof;
  const parcela = parcelaPrice(valorFinanciado, taxa, e.prazo);
  const cetMensal = taxaImplicita(liquido, parcela, e.prazo);
  const comprometimentoRenda = e.renda > 0 ? parcela / e.renda : null;
  return {
    valorLiquido: liquido,
    valorFinanciado,
    parcela,
    totalPago: parcela * e.prazo + entradaPaga,
    juros: parcela * e.prazo - valorFinanciado,
    cetMensal,
    cetAnual: Math.pow(1 + cetMensal, 12) - 1,
    comprometimentoRenda,
    alertaRenda: comprometimentoRenda !== null && comprometimentoRenda > LIMITE_RENDA,
  };
}

export function simular(e: SimulacaoEntrada): ResultadoSimulacao {
  const precoFinal = e.valor - e.desconto;
  return {
    aVista: { total: precoFinal },
    financiado: cenario(precoFinal - e.entrada, e.entrada, e),
    comTroca: e.troca > 0 ? cenario(precoFinal - e.entrada - e.troca, e.entrada, e) : null,
  };
}

export type SimulacaoErros = Partial<Record<keyof SimulacaoEntrada, string>>;

export function validarSimulacao(e: SimulacaoEntrada): SimulacaoErros {
  const erros: SimulacaoErros = {};
  if (!(e.valor > 0)) erros.valor = "Informe o valor do veículo.";
  if (e.desconto < 0) erros.desconto = "O desconto não pode ser negativo.";
  else if (e.valor > 0 && e.desconto >= e.valor) erros.desconto = "O desconto deve ser menor que o valor.";
  if (e.entrada < 0) erros.entrada = "A entrada não pode ser negativa.";
  else if (e.valor > 0 && e.entrada + e.troca > e.valor - e.desconto)
    erros.entrada = "Entrada mais troca passam do valor com desconto.";
  if (e.troca < 0) erros.troca = "A troca não pode ser negativa.";
  if (!Number.isInteger(e.prazo) || e.prazo < PRAZO_MIN || e.prazo > PRAZO_MAX)
    erros.prazo = `Prazo entre ${PRAZO_MIN} e ${PRAZO_MAX} meses.`;
  if (!(e.taxaMensalPct >= 0) || e.taxaMensalPct > 10) erros.taxaMensalPct = "Taxa entre 0% e 10% ao mês.";
  if (e.tarifas < 0) erros.tarifas = "As tarifas não podem ser negativas.";
  if (e.iof < 0) erros.iof = "O IOF não pode ser negativo.";
  if (e.renda < 0) erros.renda = "A renda não pode ser negativa.";
  for (const campo of Object.keys(e) as (keyof SimulacaoEntrada)[]) {
    if (!Number.isFinite(e[campo])) erros[campo] = "Número inválido.";
  }
  return erros;
}

/** Aceita "1.234,56", "1234.56" ou "1234"; devolve NaN para texto inválido. */
export function parseDecimalBR(raw: string): number {
  const s = raw.trim().replace(/\s|R\$/g, "");
  if (!s) return 0;
  const normalizado = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
  return /^-?\d+(\.\d+)?$/.test(normalizado) ? Number(normalizado) : NaN;
}
