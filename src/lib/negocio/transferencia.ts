export const PRAZO_TRANSFERENCIA_DIAS = 30;
export const ALERTA_TRANSFERENCIA_DIAS = 5;

export const STATUS_TRANSFERENCIA = ["pendente", "em andamento", "concluida"] as const;
export type StatusTransferencia = (typeof STATUS_TRANSFERENCIA)[number];

export type SituacaoPrazo = "ok" | "alerta" | "vencido";

const DIA = 86_400_000;

function inicioDoDia(data: Date) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

export function prazoTransferencia(vendidoEm: string, agora: Date) {
  const venda = new Date(vendidoEm);
  const limite = new Date(venda.getFullYear(), venda.getMonth(), venda.getDate() + PRAZO_TRANSFERENCIA_DIAS);
  const diasRestantes = Math.round((limite.getTime() - inicioDoDia(agora).getTime()) / DIA);
  const situacao: SituacaoPrazo =
    diasRestantes < 0 ? "vencido" : diasRestantes <= ALERTA_TRANSFERENCIA_DIAS ? "alerta" : "ok";
  return { limite, diasRestantes, situacao };
}

export function normalizarStatusTransferencia(valor: string | undefined): StatusTransferencia {
  return (STATUS_TRANSFERENCIA as readonly string[]).includes(valor ?? "")
    ? (valor as StatusTransferencia)
    : "pendente";
}

export function transferenciasPendentes(
  veiculos: { id: string; status: string; vendido_em: string | null }[],
  registros: { veiculo_id?: string; status?: string }[] | Record<string, string>[],
  agora: Date,
) {
  return veiculos
    .filter((v) => v.status === "vendido" && v.vendido_em)
    .map((v) => {
      const status = normalizarStatusTransferencia(registros.find((r) => r.veiculo_id === v.id)?.status);
      return { veiculoId: v.id, status, ...prazoTransferencia(v.vendido_em!, agora) };
    })
    .filter((item) => item.status !== "concluida")
    .sort((a, b) => a.diasRestantes - b.diasRestantes);
}
