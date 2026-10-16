"use client";

import { formatCurrency, formatDate, formatPlaca } from "@/lib/format";
import { AVISO_JURIDICO } from "@/lib/negocio/avisos";
import { vendaDoVeiculo } from "@/lib/negocio/funil";
import { AvisoLegal } from "@/components/shared/AvisoLegal";
import { Assinaturas } from "@/components/impressao/Assinaturas";
import { DadosTabela } from "@/components/impressao/DadosTabela";
import { PrintShell } from "@/components/impressao/PrintShell";
import { PrintState } from "@/components/impressao/PrintState";

export function ReciboVendaDocumento({ veiculoId }: { veiculoId: string }) {
  return (
    <PrintState>
      {(data) => {
        const veiculo = data.veiculos.find((v) => v.id === veiculoId);
        if (!veiculo) return <p className="p-8 text-sm">Veículo não encontrado.</p>;
        const venda = vendaDoVeiculo(veiculo.id, data.extras.kanban, data.clientes);
        const comprador = venda.cliente?.nome ?? venda.nomeComprador;
        const recebido = data.financeiro
          .filter((l) => l.tipo === "receita" && l.veiculo_id === veiculo.id && l.status === "pago")
          .reduce((s, l) => s + l.valor, 0);
        return (
          <PrintShell tenant={data.tenant} titulo="Recibo de venda de veículo">
            <p>
              {data.tenant.nome}
              {data.tenant.cnpj ? `, CNPJ ${data.tenant.cnpj},` : ""} declara ter recebido de{" "}
              <strong>{comprador || "________________________________"}</strong>
              {venda.cliente?.documento ? `, documento ${venda.cliente.documento},` : ""} a quantia de{" "}
              <strong>{formatCurrency(recebido || veiculo.preco_venda)}</strong> referente à venda do veículo abaixo.
            </p>
            <DadosTabela
              titulo="Veículo"
              linhas={[
                ["Veículo", `${veiculo.marca} ${veiculo.modelo}`],
                ["Ano", `${veiculo.ano_fabricacao}/${veiculo.ano_modelo}`],
                ["Placa", formatPlaca(veiculo.placa)],
                ["Renavam", veiculo.renavam ?? ""],
                ["Data da venda", formatDate(veiculo.vendido_em)],
                ["Preço de venda", formatCurrency(veiculo.preco_venda)],
              ]}
            />
            {recebido && recebido !== veiculo.preco_venda ? (
              <p className="text-xs">
                Valor do recibo = lançamentos de receita pagos deste veículo. Saldo em aberto:{" "}
                {formatCurrency(veiculo.preco_venda - recebido)}.
              </p>
            ) : null}
            <AvisoLegal texto={AVISO_JURIDICO} />
            <Assinaturas
              partes={[
                { papel: "Vendedor", nome: data.tenant.nome },
                { papel: "Comprador", nome: comprador },
              ]}
            />
          </PrintShell>
        );
      }}
    </PrintState>
  );
}
