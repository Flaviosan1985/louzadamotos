import { formatCurrency } from "@/lib/format";
import type { Margem } from "@/lib/negocio/margem";
import { cn } from "@/lib/utils";

const pct = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 });

export function VeiculoMargemCard({ margem, comissaoPct }: { margem: Margem; comissaoPct: number }) {
  const linhas = [
    ["Preço de venda", margem.venda],
    ["Custo de compra", -margem.custo],
    ["Despesas do veículo", -margem.despesas],
    [`Comissão (${String(comissaoPct).replace(".", ",")}%)`, -margem.comissao],
  ] as const;

  return (
    <section aria-labelledby="margem-titulo" className="bg-card space-y-3 rounded-xl border p-5">
      <h2 id="margem-titulo" className="font-semibold">
        Margem do veículo
      </h2>
      <dl className="space-y-1.5 text-sm">
        {linhas.map(([label, valor]) => (
          <div key={label} className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="tabular-nums">{formatCurrency(valor)}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-3 border-t pt-2 font-semibold">
          <dt>Margem</dt>
          <dd className={cn("tabular-nums", margem.margem < 0 && "text-destructive")}>
            {formatCurrency(margem.margem)}
            {margem.margemPct !== null ? ` · ${pct.format(margem.margemPct)}` : ""}
          </dd>
        </div>
      </dl>
    </section>
  );
}
