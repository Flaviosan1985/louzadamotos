"use client";

import { formatCurrency, formatDate, formatPlaca } from "@/lib/format";
import { AVISO_JURIDICO } from "@/lib/negocio/avisos";
import { vendaDoVeiculo } from "@/lib/negocio/funil";
import { AvisoLegal } from "@/components/shared/AvisoLegal";
import { Assinaturas } from "@/components/impressao/Assinaturas";
import { DadosTabela } from "@/components/impressao/DadosTabela";
import { PrintShell } from "@/components/impressao/PrintShell";
import { PrintState } from "@/components/impressao/PrintState";

export function ReciboPrint({ id }: { id: string }) {
  return (
    <PrintState>
      {(data) => {
        const veiculo = data.veiculos.find((v) => v.id === id);
        if (!veiculo) return <p className="p-8 text-sm">Veículo não encontrado.</p>;
        const venda = vendaDoVeiculo(id, data.extras.kanban, data.clientes, `${veiculo.marca} ${veiculo.modelo}`);
        const comprador = venda.cliente;
        return (
          <PrintShell tenant={data.tenant} titulo="Recibo de venda">
            <p>
              Recebemos de {venda.nomeComprador || "________________"} a quantia de{" "}
              {formatCurrency(veiculo.preco_venda)} referente à venda do veículo abaixo.
            </p>
            <DadosTabela
              titulo="Veículo"
              linhas={[
                ["Marca / modelo", `${veiculo.marca} ${veiculo.modelo}`],
                ["Placa", formatPlaca(veiculo.placa)],
                ["Renavam", veiculo.renavam ?? ""],
                ["Ano", `${veiculo.ano_fabricacao}/${veiculo.ano_modelo}`],
                ["Cor", veiculo.cor ?? ""],
                ["KM", String(veiculo.km)],
                ["Venda", formatDate(veiculo.vendido_em)],
              ]}
            />
            <DadosTabela
              titulo="Comprador"
              linhas={[
                ["Nome", venda.nomeComprador],
                ["Documento", comprador?.documento ?? ""],
                ["Telefone", comprador?.telefone ?? ""],
                ["Endereço", comprador?.endereco ?? ""],
              ]}
            />
            <AvisoLegal texto={AVISO_JURIDICO} />
            <Assinaturas
              partes={[
                { papel: "Loja", nome: data.tenant.nome },
                { papel: "Comprador", nome: venda.nomeComprador },
              ]}
            />
          </PrintShell>
        );
      }}
    </PrintState>
  );
}
