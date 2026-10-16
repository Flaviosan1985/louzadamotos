import type { Cliente } from "../types/database.ts";

export function recusarExclusao() {
  return "Clientes não são excluídos por causa dos documentos fiscais. Use anonimizar.";
}

export function anonimizarCliente<T extends Cliente>(cliente: T, quando: string): T {
  if (cliente.anonimizado_em) {
    throw new Error("Cliente já anonimizado.");
  }
  return {
    ...cliente,
    nome: "Cliente anonimizado",
    documento: null,
    telefone: null,
    email: null,
    endereco: null,
    anonimizado_em: quando,
  };
}

export type ExportacaoCliente = {
  cliente: Cliente;
  vendas: { numero: string; veiculo?: string; valor?: string }[];
  documentos: { tipo: string; nome_arquivo: string }[];
  contratos: { numero: string }[];
};

export function exportarDadosCliente(entrada: ExportacaoCliente) {
  return {
    exportado_em: new Date().toISOString(),
    cliente: { ...entrada.cliente },
    vendas: entrada.vendas.map((item) => ({ ...item })),
    documentos: entrada.documentos.map((item) => ({ ...item })),
    contratos: entrada.contratos.map((item) => ({ ...item })),
  };
}
