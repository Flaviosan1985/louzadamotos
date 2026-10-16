import { TriangleAlert } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { CenarioFinanciado } from "@/lib/negocio/simulacao";
import { cn } from "@/lib/utils";

const percent = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 2 });

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs uppercase">{label}</dt>
      <dd className="font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

export function SimulacaoCenarioCard({
  titulo,
  cenario,
  prazo,
  vazio,
}: {
  titulo: string;
  cenario: CenarioFinanciado | null;
  prazo: number;
  vazio: string;
}) {
  return (
    <section
      aria-label={titulo}
      className={cn("bg-card space-y-3 rounded-xl border p-5", cenario?.alertaRenda && "border-amber-500/60")}
    >
      <h2 className="font-semibold">{titulo}</h2>
      {cenario ? (
        <>
          <p className="text-2xl font-semibold tabular-nums">
            {prazo}× {formatCurrency(cenario.parcela)}
          </p>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <Item label="Financiado" value={formatCurrency(cenario.valorFinanciado)} />
            <Item label="Juros" value={formatCurrency(cenario.juros)} />
            <Item label="Total pago" value={formatCurrency(cenario.totalPago)} />
            <Item
              label="CET estimado"
              value={`${percent.format(cenario.cetMensal)} a.m. · ${percent.format(cenario.cetAnual)} a.a.`}
            />
            {cenario.comprometimentoRenda !== null ? (
              <Item label="Da renda" value={percent.format(cenario.comprometimentoRenda)} />
            ) : null}
          </dl>
          {cenario.alertaRenda ? (
            <p className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              Parcela acima de 30% da renda informada; a aprovação tende a ser difícil.
            </p>
          ) : null}
        </>
      ) : (
        <p className="text-muted-foreground text-sm">{vazio}</p>
      )}
    </section>
  );
}
