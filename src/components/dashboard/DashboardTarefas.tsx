import { PanelLink } from "@/components/layout/panel/PanelLink";
import { ListTodo } from "lucide-react";
import type { Tarefa } from "@/lib/negocio/tarefas";
import { cn } from "@/lib/utils";

const hora = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

export function DashboardTarefas({ tarefas }: { tarefas: Tarefa[] }) {
  return (
    <section aria-labelledby="tarefas-titulo" className="bg-card rounded-xl border p-5 shadow-sm">
      <header className="mb-3 flex items-center justify-between gap-2">
        <h2 id="tarefas-titulo" className="flex items-center gap-2 font-semibold">
          <ListTodo className="size-4" aria-hidden />
          Tarefas de hoje
        </h2>
        <span className="text-muted-foreground text-xs">{tarefas.length}</span>
      </header>
      {tarefas.length === 0 ? (
        <p className="text-muted-foreground text-sm">Nenhuma pendência no funil, na agenda ou nas transferências.</p>
      ) : (
        <ul className="divide-y">
          {tarefas.map((t) => (
            <li key={t.id}>
              <PanelLink href={t.href} className="hover:bg-muted/50 -mx-2 flex items-start gap-3 rounded-md px-2 py-2.5">
                <span
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    t.prioridade === "alta" ? "bg-destructive" : "bg-amber-500",
                  )}
                  aria-label={t.prioridade === "alta" ? "Prioridade alta" : "Prioridade média"}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{t.titulo}</span>
                  <span className="text-muted-foreground block text-xs">{t.detalhe}</span>
                </span>
                <time className="text-muted-foreground shrink-0 text-xs tabular-nums" dateTime={t.quando.toISOString()}>
                  {hora.format(t.quando)}
                </time>
              </PanelLink>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
