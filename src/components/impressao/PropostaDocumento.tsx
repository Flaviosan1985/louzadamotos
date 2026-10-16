"use client";

import { formatCurrency, formatDate, formatKm, formatPlaca } from "@/lib/format";
import { AVISO_SIMULACAO } from "@/lib/negocio/avisos";
import { simular, type CenarioFinanciado, type SimulacaoEntrada } from "@/lib/negocio/simulacao";
import { AvisoLegal } from "@/components/shared/AvisoLegal";
import { Assinaturas } from "@/components/impressao/Assinaturas";
import { DadosTabela } from "@/components/impressao/DadosTabela";
import { PrintShell } from "@/components/impressao/PrintShell";
import { PrintState } from "@/components/impressao/PrintState";

const CAMPOS: (keyof SimulacaoEntrada)[] = [
  "valor",
  "desconto",
  "entrada",
  "troca",
  "prazo",
  "taxaMensalPct",
  "tarifas",
  "iof",
  "renda",
];

const pct = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 2 });

function linhasCenario(c: CenarioFinanciado, prazo: number): [string, string][] {
  return [
    ["Valor financiado", formatCurrency(c.valorFinanciado)],
    ["Parcelas", `${prazo} × ${formatCurrency(c.parcela)}`],
    ["Total pago", formatCurrency(c.totalPago)],
    ["CET estimado", `${pct.format(c.cetMensal)} a.m. · ${pct.format(c.cetAnual)} a.a.`],
  ];
}

export function PropostaDocumento({ simulacaoId }: { simulacaoId: string }) {
  return (
    <PrintState>
      {(data) => {
        const sim = data.extras.simulacoes.find((s) => s.id === simulacaoId);
        if (!sim) return <p className="p-8 text-sm">Simulação não encontrada.</p>;
        const entrada = Object.fromEntries(CAMPOS.map((k) => [k, Number(sim[k] ?? 0)])) as SimulacaoEntrada;
        const r = simular(entrada);
        const veiculo = data.veiculos.find((v) => v.id === sim.veiculo_id);
        const cliente = data.clientes.find((c) => c.id === sim.cliente_id);
        return (
          <PrintShell tenant={data.tenant} titulo="Proposta comercial">
            <DadosTabela
              titulo="Cliente"
              linhas={[
                ["Nome", cliente?.nome ?? sim.cliente ?? ""],
                ["CPF/CNPJ", cliente?.documento ?? ""],
                ["Telefone", cliente?.telefone ?? ""],
              ]}
            />
            <DadosTabela
              titulo="Veículo"
              linhas={
                veiculo
                  ? [
                      ["Veículo", `${veiculo.marca} ${veiculo.modelo}`],
                      ["Ano", `${veiculo.ano_fabricacao}/${veiculo.ano_modelo}`],
                      ["Placa", formatPlaca(veiculo.placa)],
                      ["Quilometragem", formatKm(veiculo.km)],
                      ["Cor", veiculo.cor ?? ""],
                    ]
                  : [["Veículo", sim.veiculo || "Valor digitado manualmente"]]
              }
            />
            <DadosTabela
              titulo="Condições"
              linhas={[
                ["Preço", formatCurrency(entrada.valor)],
                ["Desconto", formatCurrency(entrada.desconto)],
                ["À vista", formatCurrency(r.aVista.total)],
                ["Entrada", formatCurrency(entrada.entrada)],
                ["Veículo na troca", formatCurrency(entrada.troca)],
                ["Taxa", `${String(entrada.taxaMensalPct).replace(".", ",")}% a.m.`],
                ["Tarifas e IOF", formatCurrency(entrada.tarifas + entrada.iof)],
              ]}
            />
            {r.financiado ? (
              <DadosTabela titulo="Financiado sem troca" linhas={linhasCenario(r.financiado, entrada.prazo)} />
            ) : null}
            {r.comTroca ? (
              <DadosTabela titulo="Financiado com troca" linhas={linhasCenario(r.comTroca, entrada.prazo)} />
            ) : null}
            <p className="text-xs">Simulação gerada em {formatDate(sim.criado_em)}.</p>
            <AvisoLegal texto={AVISO_SIMULACAO} />
            <Assinaturas
              partes={[
                { papel: "Cliente", nome: cliente?.nome ?? sim.cliente ?? "" },
                { papel: "Vendedor", nome: data.profile.nome },
              ]}
            />
          </PrintShell>
        );
      }}
    </PrintState>
  );
}
