"use client";

import { Button } from "@/components/ui/button";
import type { ModuleRow } from "@/lib/types/modulos";
import { etapaVizinha, type Etapa } from "@/lib/negocio/funil";
import { formatDate } from "@/lib/format";

export function KanbanColumn({
  etapa,
  cards,
  onMove,
  onDelete,
}: {
  etapa: Etapa;
  cards: ModuleRow[];
  onMove: (row: ModuleRow, destino: Etapa) => void;
  onDelete: (id: string) => void;
}) {
  const anterior = etapa === "Vendido" ? null : etapaVizinha(etapa, -1);
  const proxima = etapaVizinha(etapa, 1);
  const encerrada = etapa === "Vendido" || etapa === "Perdido";

  return (
    <section
      aria-label={etapa}
      className="bg-muted/40 flex min-h-72 w-64 shrink-0 flex-col rounded-xl border p-3"
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">{etapa}</h2>
        <span className="text-muted-foreground text-xs">{cards.length}</span>
      </header>
      <div className="space-y-2">
        {cards.length === 0 ? (
          <p className="text-muted-foreground px-1 text-xs">Nenhum cartão nesta etapa.</p>
        ) : (
          cards.map((card) => (
            <article key={card.id} className="bg-card space-y-2 rounded-lg border p-3">
              <p className="font-medium">{card.titulo}</p>
              <p className="text-muted-foreground text-xs">{card.cliente}</p>
              {card.veiculo ? <p className="text-muted-foreground text-xs">{card.veiculo}</p> : null}
              {card.test_drive_em && !encerrada ? (
                <p className="text-xs text-emerald-700 dark:text-emerald-400">Test drive feito</p>
              ) : null}
              {etapa === "Vendido" && card.data_entrega ? (
                <p className="text-xs">Entrega {formatDate(card.data_entrega)}</p>
              ) : null}
              {etapa === "Perdido" && card.motivo_perda ? (
                <p className="text-destructive text-xs">{card.motivo_perda}</p>
              ) : null}
              <div className="flex flex-wrap gap-1">
                {anterior ? (
                  <Button type="button" size="sm" variant="ghost" onClick={() => onMove(card, anterior)}>
                    Voltar
                  </Button>
                ) : null}
                {proxima ? (
                  <Button type="button" size="sm" variant="ghost" onClick={() => onMove(card, proxima)}>
                    Avançar
                  </Button>
                ) : null}
                {!encerrada ? (
                  <Button type="button" size="sm" variant="ghost" onClick={() => onMove(card, "Perdido")}>
                    Perdido
                  </Button>
                ) : null}
                {etapa === "Perdido" ? (
                  <Button type="button" size="sm" variant="ghost" onClick={() => onMove(card, "Contatado")}>
                    Reabrir
                  </Button>
                ) : null}
                <Button type="button" size="sm" variant="ghost" onClick={() => onDelete(card.id)}>
                  Excluir
                </Button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
