"use client";

import { formatCurrency, formatDate } from "@/lib/format";
import { normalizarEtapa } from "@/lib/negocio/funil";
import { DadosTabela } from "@/components/impressao/DadosTabela";
import { PrintShell } from "@/components/impressao/PrintShell";
import { PrintState } from "@/components/impressao/PrintState";

const mesmoNome = (a: string | undefined, b: string) =>
  (a ?? "").trim().toLocaleLowerCase("pt-BR") === b.trim().toLocaleLowerCase("pt-BR");

export function FichaClienteDocumento({ clienteId }: { clienteId: string }) {
  return (
    <PrintState>
      {(data) => {
        const cliente = data.clientes.find((c) => c.id === clienteId);
        if (!cliente) return <p className="p-8 text-sm">Cliente não encontrado.</p>;
        const negocios = data.extras.kanban.filter((k) => mesmoNome(k.cliente, cliente.nome));
        const simulacoes = data.extras.simulacoes.filter((s) => s.cliente_id === cliente.id);
        return (
          <PrintShell tenant={data.tenant} titulo="Ficha do cliente">
            <DadosTabela
              titulo="Dados cadastrais"
              linhas={[
                ["Nome", cliente.nome],
                ["Tipo", cliente.tipo_pessoa === "juridica" ? "Pessoa jurídica" : "Pessoa física"],
                [cliente.tipo_pessoa === "juridica" ? "CNPJ" : "CPF", cliente.documento ?? ""],
                ["Telefone", cliente.telefone ?? ""],
                ["E-mail", cliente.email ?? ""],
                ["Endereço", cliente.endereco ?? ""],
                ["Cliente desde", formatDate(cliente.criado_em)],
              ]}
            />
            <DadosTabela
              titulo="Negociações"
              linhas={
                negocios.length
                  ? negocios.map((k) => [k.veiculo || k.titulo, normalizarEtapa(k.coluna)] as [string, string])
                  : [["Nenhuma", ""]]
              }
            />
            <DadosTabela
              titulo="Simulações"
              linhas={
                simulacoes.length
                  ? simulacoes.map(
                      (s) =>
                        [
                          `${formatDate(s.criado_em)} · ${s.veiculo || "valor manual"}`,
                          s.parcela ? `${s.prazo} × ${formatCurrency(s.parcela)}` : formatCurrency(s.valor),
                        ] as [string, string],
                    )
                  : [["Nenhuma", ""]]
              }
            />
            <p className="text-xs text-black/60">
              Dados pessoais tratados para execução do contrato de compra e venda (LGPD, art. 7º, V).
            </p>
          </PrintShell>
        );
      }}
    </PrintState>
  );
}
