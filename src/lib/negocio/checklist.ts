export const DOCUMENTOS_VEICULO = [
  { chave: "doc_crv", label: "CRV / ATPV-e assinado" },
  { chave: "doc_crlv", label: "CRLV do exercício" },
  { chave: "doc_debitos", label: "Nada consta de débitos e multas" },
  { chave: "doc_leilao", label: "Consulta de leilão e sinistro" },
  { chave: "doc_cautelar", label: "Laudo cautelar" },
  { chave: "doc_quitacao", label: "Quitação de financiamento anterior" },
  { chave: "doc_chave", label: "Chave reserva e manual" },
  { chave: "doc_contrato", label: "Contrato de compra do veículo" },
] as const;

export type DocumentoVeiculo = (typeof DOCUMENTOS_VEICULO)[number];

export function progressoChecklist(registro: Record<string, string | undefined> | undefined) {
  const pendentes = DOCUMENTOS_VEICULO.filter((d) => registro?.[d.chave] !== "sim");
  return {
    feitos: DOCUMENTOS_VEICULO.length - pendentes.length,
    total: DOCUMENTOS_VEICULO.length,
    pendentes,
  };
}
