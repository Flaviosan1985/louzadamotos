"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { removeModuleRow, saveModuleRow, saveVeiculo } from "@/lib/data/app-data";
import { useAppSnapshot } from "@/hooks/use-app-snapshot";
import { aplicarTransicao, ETAPAS, normalizarEtapa, validarTransicao, type Etapa } from "@/lib/negocio/funil";
import { pode } from "@/lib/negocio/permissoes";
import { Button } from "@/components/ui/button";
import { QueryState } from "@/components/shared/QueryState";
import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { EntityForm } from "@/components/shared/EntityForm";
import { KanbanColumn } from "@/components/atalhos/KanbanColumn";
import { FunilTransicaoDialog, type DestinoComDados } from "@/components/atalhos/FunilTransicaoDialog";
import type { ModuleRow } from "@/lib/types/modulos";

type Pendente = { card: ModuleRow; destino: DestinoComDados };

const COM_DADOS: readonly Etapa[] = ["Vendido", "Perdido", "Agendamento"];

export function KanbanPage() {
  const { data, error, loading, refetch } = useAppSnapshot();
  const [creating, setCreating] = useState(false);
  const [pendente, setPendente] = useState<Pendente | null>(null);
  const podeEscrever = data ? pode(data.profile.papel, "comercial.escrever") : false;
  const cards = useMemo(() => data?.extras.kanban ?? [], [data?.extras.kanban]);
  const veiculos = useMemo(() => data?.veiculos ?? [], [data?.veiculos]);

  const grouped = useMemo(
    () =>
      ETAPAS.map((etapa) => ({
        etapa,
        cards: cards.filter((card) => normalizarEtapa(card.coluna) === etapa),
      })),
    [cards],
  );

  const mover = useCallback(
    async (card: ModuleRow, destino: Etapa) => {
      if (!data || !pode(data.profile.papel, "comercial.escrever")) return;
      const placa = veiculos.find((v) => v.id === card.veiculo_id)?.placa ?? null;
      const falha = validarTransicao(card, destino, { placaDoVeiculo: placa });
      if (falha) {
        if (COM_DADOS.includes(destino)) setPendente({ card, destino: destino as DestinoComDados });
        else toast.error(falha);
        return;
      }
      try {
        const agora = new Date().toISOString();
        await saveModuleRow("kanban", aplicarTransicao(card, destino, agora));
        if (destino === "Vendido" && card.veiculo_id) {
          await saveVeiculo({ id: card.veiculo_id, status: "vendido", vendido_em: agora }, data.mode === "demo");
        }
        toast.success(`Cartão movido para ${destino}.`);
        setPendente(null);
        await refetch();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Falha ao mover.");
      }
    },
    [data, refetch, veiculos],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await removeModuleRow("kanban", id);
        toast.success("Cartão excluído.");
        await refetch();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Falha ao excluir.");
      }
    },
    [refetch],
  );

  const handleCreate = useCallback(
    async (payload: Record<string, string>) => {
      if (!data) return;
      const agora = new Date().toISOString();
      try {
        await saveModuleRow("kanban", {
          ...payload,
          coluna: "Novo lead",
          etapa_em: agora,
          tenant_id: data.tenant.id,
          id: crypto.randomUUID(),
          criado_em: agora,
        });
        toast.success("Lead criado.");
        setCreating(false);
        await refetch();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Falha ao salvar.");
        throw err;
      }
    },
    [data, refetch],
  );

  return (
    <QueryState loading={loading && !data} error={error} empty={false} onRetry={refetch}>
      <QueryState.Loading />
      <QueryState.Error />
      <QueryState.Ready>
        <div className="space-y-5">
          <ModuleHeader
            title="Funil de vendas"
            count={`${cards.length} cartão(ões)`}
            action={
              podeEscrever ? <Button onClick={() => setCreating(true)}>Novo lead</Button> : undefined
            }
          />
          <p className="text-muted-foreground -mt-3 text-sm">
            Negociação exige test drive; venda exige veículo com placa e data de entrega; perda exige motivo.
          </p>
          {creating && podeEscrever ? (
            <EntityForm
              submitLabel="Salvar"
              onCancel={() => setCreating(false)}
              onSave={handleCreate}
              fields={[
                { key: "titulo", label: "Título", required: true },
                { key: "cliente", label: "Cliente", required: true },
                { key: "telefone", label: "Telefone", type: "tel" },
                { key: "veiculo", label: "Veículo de interesse" },
              ]}
            />
          ) : null}
          <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
            {grouped.map((column) => (
              <KanbanColumn
                key={column.etapa}
                etapa={column.etapa}
                cards={column.cards}
                onMove={(row, destino) => void mover(row, destino)}
                onDelete={(id) => void handleDelete(id)}
                somenteLeitura={!podeEscrever}
              />
            ))}
          </div>
          {pendente ? (
            <FunilTransicaoDialog
              key={`${pendente.card.id}-${pendente.destino}`}
              cartao={pendente.card}
              destino={pendente.destino}
              veiculos={veiculos}
              onCancel={() => setPendente(null)}
              onConfirm={(patch) => mover({ ...pendente.card, ...patch }, pendente.destino)}
            />
          ) : null}
        </div>
      </QueryState.Ready>
    </QueryState>
  );
}
