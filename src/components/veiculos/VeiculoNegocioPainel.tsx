"use client";

import { useCallback } from "react";
import Link from "next/link";
import { Printer } from "lucide-react";
import { toast } from "sonner";
import { useAppSnapshot } from "@/hooks/use-app-snapshot";
import { saveModuleRow } from "@/lib/data/app-data";
import { AVISO_CONTABIL } from "@/lib/negocio/avisos";
import { margemVeiculo, percentualComissao } from "@/lib/negocio/margem";
import type { ExtraKey } from "@/lib/types/modulos";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AvisoLegal } from "@/components/shared/AvisoLegal";
import { VeiculoChecklist } from "@/components/veiculos/VeiculoChecklist";
import { VeiculoMargemCard } from "@/components/veiculos/VeiculoMargemCard";
import { VeiculoTransferencia } from "@/components/veiculos/VeiculoTransferencia";

export function VeiculoNegocioPainel({ veiculoId }: { veiculoId: string }) {
  const { data, refetch } = useAppSnapshot();
  const veiculo = data?.veiculos.find((v) => v.id === veiculoId);

  const salvar = useCallback(
    async (key: ExtraKey, id: string, patch: Record<string, string>) => {
      if (!data) return;
      const atual = data.extras[key].find((r) => r.id === id);
      try {
        await saveModuleRow(key, {
          ...(atual ?? { id, tenant_id: data.tenant.id, criado_em: new Date().toISOString(), veiculo_id: veiculoId }),
          ...patch,
        });
        await refetch();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Falha ao salvar.");
      }
    },
    [data, refetch, veiculoId],
  );

  if (!data) return <Skeleton className="h-64 w-full" />;
  if (!veiculo) return null;

  const comissaoPct = percentualComissao(data.extras.comissoes);
  const margem = margemVeiculo(veiculo, data.financeiro, comissaoPct);
  const checklistId = `ck-${veiculo.id}`;
  const transferenciaId = `tr-${veiculo.id}`;

  return (
    <div className="space-y-4">
      <div className="grid items-start gap-4 lg:grid-cols-3">
        <div className="space-y-4">
          <VeiculoMargemCard margem={margem} comissaoPct={comissaoPct} />
          <AvisoLegal texto={AVISO_CONTABIL} />
        </div>
        <VeiculoChecklist
          registro={data.extras.checklists.find((r) => r.id === checklistId)}
          onToggle={(chave, marcado) => void salvar("checklists", checklistId, { [chave]: marcado ? "sim" : "nao" })}
        />
        {veiculo.status === "vendido" && veiculo.vendido_em ? (
          <VeiculoTransferencia
            vendidoEm={veiculo.vendido_em}
            registro={data.extras.transferencias.find((r) => r.id === transferenciaId)}
            onChange={(patch) => void salvar("transferencias", transferenciaId, patch)}
          />
        ) : null}
      </div>
      {veiculo.status === "vendido" ? (
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" nativeButton={false} render={<Link href={`/imprimir/recibo/${veiculo.id}`} target="_blank" />}>
            <Printer aria-hidden />
            Recibo de venda
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href={`/imprimir/entrega/${veiculo.id}`} target="_blank" />}>
            <Printer aria-hidden />
            Termo de entrega
          </Button>
        </div>
      ) : null}
    </div>
  );
}
