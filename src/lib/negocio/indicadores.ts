import { normalizarEtapa } from "./funil.ts";
import { margemMedia, margemVeiculo } from "./margem.ts";
import { transferenciasPendentes } from "./transferencia.ts";

const DIA = 86_400_000;

type VeiculoIndicador = {
  id: string;
  status: string;
  preco_custo: number;
  preco_venda: number;
  criado_em: string;
  vendido_em: string | null;
};

export function calcularIndicadores({
  veiculos,
  financeiro,
  kanban,
  transferencias,
  comissaoPct,
  agora,
}: {
  veiculos: VeiculoIndicador[];
  financeiro: { tipo: string; categoria: string; valor: number; veiculo_id: string | null }[];
  kanban: { coluna?: string }[] | Record<string, string>[];
  transferencias: { veiculo_id?: string; status?: string }[] | Record<string, string>[];
  comissaoPct: number;
  agora: Date;
}) {
  const estoque = veiculos.filter((v) => v.status !== "vendido");
  const vendidos = veiculos.filter((v) => v.status === "vendido");
  const dias = estoque.map((v) => Math.floor((agora.getTime() - new Date(v.criado_em).getTime()) / DIA));
  const pendentes = transferenciasPendentes(veiculos, transferencias, agora);
  const fechados = kanban.filter((c) => normalizarEtapa(c.coluna) === "Vendido").length;

  return {
    veiculosEstoque: estoque.length,
    valorEstoque: estoque.reduce((s, v) => s + v.preco_venda, 0),
    diasMedioEstoque: dias.length ? Math.round(dias.reduce((a, b) => a + b, 0) / dias.length) : null,
    margemMedia: margemMedia(vendidos.map((v) => margemVeiculo(v, financeiro, comissaoPct))),
    conversaoFunil: kanban.length ? fechados / kanban.length : null,
    transferenciasPendentes: pendentes.length,
    transferenciasAlerta: pendentes.filter((p) => p.situacao !== "ok").length,
  };
}
