export const VARIAVEIS_CONTRATO = [
  "cliente.nome",
  "cliente.documento",
  "cliente.endereco",
  "cliente.telefone",
  "veiculo.marca",
  "veiculo.modelo",
  "veiculo.ano",
  "veiculo.placa",
  "veiculo.renavam",
  "venda.numero",
  "venda.valor",
  "venda.data",
  "loja.nome",
  "loja.cnpj",
] as const;

export type VariavelContrato = (typeof VARIAVEIS_CONTRATO)[number];

const PERMITIDAS = new Set<string>(VARIAVEIS_CONTRATO);

export function escaparHtml(valor: string) {
  return valor
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function extrairVariaveis(corpo: string) {
  const achadas: string[] = [];
  for (const match of corpo.matchAll(/\{\{\s*([a-z.]+)\s*\}\}/gi)) {
    const nome = match[1]?.toLowerCase();
    if (nome && !achadas.includes(nome)) achadas.push(nome);
  }
  return achadas;
}

export function preencherModelo(corpo: string, valores: Record<string, string>) {
  const desconhecidas = extrairVariaveis(corpo).filter((nome) => !PERMITIDAS.has(nome));
  if (desconhecidas.length) {
    throw new Error(`Variável não permitida: ${desconhecidas.join(", ")}`);
  }
  return corpo.replace(/\{\{\s*([a-z.]+)\s*\}\}/gi, (_, nome: string) => {
    const chave = nome.toLowerCase();
    return escaparHtml(valores[chave] ?? "");
  });
}

export function congelarContrato(
  modelo: string,
  valores: Record<string, string>,
  versao_modelo: number,
  gerado_em: string,
) {
  return Object.freeze({
    corpo: preencherModelo(modelo, valores),
    versao_modelo,
    gerado_em,
  });
}

export function incrementarVersao(atual: number) {
  return atual + 1;
}
