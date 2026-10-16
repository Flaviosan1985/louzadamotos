"use client";

import { formatDate, formatKm, formatPlaca } from "@/lib/format";
import { AVISO_JURIDICO } from "@/lib/negocio/avisos";
import { vendaDoVeiculo } from "@/lib/negocio/funil";
import { AvisoLegal } from "@/components/shared/AvisoLegal";
import { Assinaturas } from "@/components/impressao/Assinaturas";
import { DadosTabela } from "@/components/impressao/DadosTabela";
import { PrintShell } from "@/components/impressao/PrintShell";
import { PrintState } from "@/components/impressao/PrintState";

export function EntregaPrint({ id }: { id: string }) {
  return (
    <PrintState>
      {(data) => {
        const veiculo = data.veiculos.find((v) => v.id === id);
        if (!veiculo) return <p className="p-8 text-sm">Veículo não encontrado.</p>;
        const venda = vendaDoVeiculo(id, data.extras.kanban, data.clientes, `${veiculo.marca} ${veiculo.modelo}`);
        return (
          <PrintShell tenant={data.tenant} titulo="Termo de entrega">
            <p>
              O comprador declara ter recebido o veículo abaixo nas condições em que se encontra, com as chaves e os
              documentos combinados, na data de {formatDate(venda.dataEntrega || veiculo.vendido_em)}.
            </p>
            <DadosTabela
              titulo="Veículo entregue"
              linhas={[
                ["Marca / modelo", `${veiculo.marca} ${veiculo.modelo}`],
                ["Placa", formatPlaca(veiculo.placa)],
                ["Renavam", veiculo.renavam ?? ""],
                ["KM no ato", formatKm(veiculo.km)],
                ["Comprador", venda.nomeComprador],
                ["Data de entrega", formatDate(venda.dataEntrega || veiculo.vendido_em)],
              ]}
            />
            <p>
              O prazo de 30 dias para transferência de propriedade conta a partir da venda. A comunicação de venda ao
              Detran é de responsabilidade da loja; a transferência, do comprador.
            </p>
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
