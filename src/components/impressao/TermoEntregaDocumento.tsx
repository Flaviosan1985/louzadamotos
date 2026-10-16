"use client";

import { formatDate, formatKm, formatPlaca } from "@/lib/format";
import { AVISO_JURIDICO } from "@/lib/negocio/avisos";
import { DOCUMENTOS_VEICULO } from "@/lib/negocio/checklist";
import { vendaDoVeiculo } from "@/lib/negocio/funil";
import { prazoTransferencia } from "@/lib/negocio/transferencia";
import { AvisoLegal } from "@/components/shared/AvisoLegal";
import { Assinaturas } from "@/components/impressao/Assinaturas";
import { DadosTabela } from "@/components/impressao/DadosTabela";
import { PrintShell } from "@/components/impressao/PrintShell";
import { PrintState } from "@/components/impressao/PrintState";

export function TermoEntregaDocumento({ veiculoId }: { veiculoId: string }) {
  return (
    <PrintState>
      {(data) => {
        const veiculo = data.veiculos.find((v) => v.id === veiculoId);
        if (!veiculo) return <p className="p-8 text-sm">Veículo não encontrado.</p>;
        const venda = vendaDoVeiculo(veiculo.id, data.extras.kanban, data.clientes);
        const comprador = venda.cliente?.nome ?? venda.nomeComprador;
        const checklist = data.extras.checklists.find((c) => c.id === `ck-${veiculo.id}`);
        const limite = veiculo.vendido_em ? prazoTransferencia(veiculo.vendido_em, new Date()).limite : null;
        return (
          <PrintShell tenant={data.tenant} titulo="Termo de entrega de veículo">
            <DadosTabela
              titulo="Comprador"
              linhas={[
                ["Nome", comprador],
                ["CPF/CNPJ", venda.cliente?.documento ?? ""],
                ["Endereço", venda.cliente?.endereco ?? ""],
              ]}
            />
            <DadosTabela
              titulo="Veículo entregue"
              linhas={[
                ["Veículo", `${veiculo.marca} ${veiculo.modelo}`],
                ["Ano", `${veiculo.ano_fabricacao}/${veiculo.ano_modelo}`],
                ["Placa", formatPlaca(veiculo.placa)],
                ["Renavam", veiculo.renavam ?? ""],
                ["Cor", veiculo.cor ?? ""],
                ["Quilometragem na entrega", formatKm(veiculo.km)],
                ["Data de entrega", formatDate(venda.dataEntrega || veiculo.vendido_em)],
              ]}
            />
            <DadosTabela
              titulo="Documentos e itens entregues"
              linhas={DOCUMENTOS_VEICULO.map((d) => [d.label, checklist?.[d.chave] === "sim" ? "Entregue" : "Pendente"])}
            />
            <ol className="list-decimal space-y-1 pl-5 text-sm">
              <li>O comprador declara ter vistoriado o veículo e recebê-lo nas condições descritas acima.</li>
              <li>
                A partir desta entrega, o comprador responde por multas, débitos e uso do veículo.
              </li>
              <li>
                O comprador deve transferir a propriedade em até 30 dias da venda
                {limite ? ` (até ${formatDate(limite.toISOString())})` : ""}.
              </li>
            </ol>
            <AvisoLegal texto={AVISO_JURIDICO} />
            <Assinaturas
              partes={[
                { papel: "Loja", nome: data.tenant.nome },
                { papel: "Comprador", nome: comprador },
              ]}
            />
          </PrintShell>
        );
      }}
    </PrintState>
  );
}
