"use client";

import { formatCurrency } from "@/lib/format";
import { AVISO_SIMULACAO } from "@/lib/negocio/avisos";
import { simular, type SimulacaoEntrada } from "@/lib/negocio/simulacao";
import { AvisoLegal } from "@/components/shared/AvisoLegal";
import { Assinaturas } from "@/components/impressao/Assinaturas";
import { DadosTabela } from "@/components/impressao/DadosTabela";
import { PrintCenario } from "@/components/impressao/PrintCenario";
import { PrintShell } from "@/components/impressao/PrintShell";
import { PrintState } from "@/components/impressao/PrintState";
import type { ModuleRow } from "@/lib/types/modulos";

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

function entradaDaLinha(row: ModuleRow): SimulacaoEntrada {
  return Object.fromEntries(CAMPOS.map((key) => [key, Number(row[key] ?? 0)])) as SimulacaoEntrada;
}

export function PropostaPrint({ id }: { id: string }) {
  return (
    <PrintState>
      {(data) => {
        const row = data.extras.simulacoes.find((s) => s.id === id);
        if (!row) return <p className="p-8 text-sm">Simulação não encontrada.</p>;
        const entrada = entradaDaLinha(row);
        const resultado = simular(entrada);
        return (
          <PrintShell tenant={data.tenant} titulo="Proposta comercial">
            <DadosTabela
              titulo="Negociação"
              linhas={[
                ["Cliente", row.cliente],
                ["Veículo", row.veiculo],
                ["Valor", formatCurrency(entrada.valor)],
                ["Desconto", formatCurrency(entrada.desconto)],
                ["Entrada", formatCurrency(entrada.entrada)],
                ["Troca", formatCurrency(entrada.troca)],
                ["Prazo", `${entrada.prazo} meses`],
                ["Taxa informada", `${String(entrada.taxaMensalPct).replace(".", ",")}% a.m.`],
              ]}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <section>
                <h2 className="text-xs font-semibold tracking-wide uppercase">À vista</h2>
                <p className="text-base font-semibold">{formatCurrency(resultado.aVista.total)}</p>
              </section>
              <PrintCenario titulo="Financiado" cenario={resultado.financiado} prazo={entrada.prazo} />
              <PrintCenario titulo="Com troca" cenario={resultado.comTroca} prazo={entrada.prazo} />
            </div>
            <AvisoLegal texto={AVISO_SIMULACAO} />
            <Assinaturas
              partes={[
                { papel: "Loja", nome: data.tenant.nome },
                { papel: "Cliente", nome: row.cliente },
              ]}
            />
          </PrintShell>
        );
      }}
    </PrintState>
  );
}
