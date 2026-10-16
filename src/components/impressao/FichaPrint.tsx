"use client";

import { AVISO_JURIDICO } from "@/lib/negocio/avisos";
import { AvisoLegal } from "@/components/shared/AvisoLegal";
import { Assinaturas } from "@/components/impressao/Assinaturas";
import { DadosTabela } from "@/components/impressao/DadosTabela";
import { PrintShell } from "@/components/impressao/PrintShell";
import { PrintState } from "@/components/impressao/PrintState";

export function FichaPrint({ id }: { id: string }) {
  return (
    <PrintState>
      {(data) => {
        const cliente = data.clientes.find((c) => c.id === id);
        if (!cliente) return <p className="p-8 text-sm">Cliente não encontrado.</p>;
        return (
          <PrintShell tenant={data.tenant} titulo="Ficha cadastral">
            <DadosTabela
              titulo="Dados do cliente"
              linhas={[
                ["Nome", cliente.nome],
                ["Tipo", cliente.tipo_pessoa === "juridica" ? "Pessoa jurídica" : "Pessoa física"],
                ["Documento", cliente.documento ?? ""],
                ["Telefone", cliente.telefone ?? ""],
                ["E-mail", cliente.email ?? ""],
                ["Endereço", cliente.endereco ?? ""],
              ]}
            />
            <AvisoLegal texto={AVISO_JURIDICO} />
            <Assinaturas
              partes={[
                { papel: "Loja", nome: data.tenant.nome },
                { papel: "Cliente", nome: cliente.nome },
              ]}
            />
          </PrintShell>
        );
      }}
    </PrintState>
  );
}
