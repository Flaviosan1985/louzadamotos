export type TipoNumero = "venda" | "contrato";

const PREFIXO: Record<TipoNumero, string> = {
  venda: "VD",
  contrato: "CT",
};

export function formatarNumero(tipo: TipoNumero, sequencial: number, ano: number) {
  return `${PREFIXO[tipo]}-${ano}-${String(sequencial).padStart(5, "0")}`;
}

export function proximoValor(atual: number) {
  return atual + 1;
}

export type VendaVinculo = {
  id: string;
  tenant_id: string;
  numero: string;
  cliente_id: string;
  veiculo_id: string;
  kanban_id: string;
  valor: string;
  data: string;
  criado_em: string;
};

export function vinculoVenda(entrada: VendaVinculo): VendaVinculo {
  if (!entrada.cliente_id.trim()) throw new Error("Venda exige cliente.");
  if (!entrada.veiculo_id.trim()) throw new Error("Venda exige veículo.");
  if (!entrada.numero.trim()) throw new Error("Venda exige número.");
  return { ...entrada };
}
