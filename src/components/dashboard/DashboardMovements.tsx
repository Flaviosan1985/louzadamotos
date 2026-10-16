import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import type { LancamentoFinanceiro } from "@/lib/types/database";

export function DashboardMovements({ financeiro }: { financeiro: LancamentoFinanceiro[] }) {
  const rows = [...financeiro]
    .sort((a, b) => b.criado_em.localeCompare(a.criado_em))
    .slice(0, 4);

  return (
    <section className="rounded-2xl border border-black/5 bg-white p-4 shadow-[0_8px_24px_rgba(20,16,40,0.04)]">
      <ul className="divide-y divide-zinc-100">
        {rows.length === 0 ? (
          <li className="text-muted-foreground px-2 py-6 text-sm">Nenhum lançamento neste período.</li>
        ) : (
          rows.map((item) => {
            const entrada = item.tipo === "receita";
            return (
              <li key={item.id} className="flex items-center gap-3 px-2 py-3">
                <span
                  className={
                    entrada
                      ? "flex size-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
                      : "flex size-8 items-center justify-center rounded-full bg-red-50 text-[#E10600]"
                  }
                >
                  {entrada ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{item.descricao}</span>
                  <span className="text-muted-foreground block text-xs">
                    {formatDate(item.data_vencimento)}
                  </span>
                </span>
                <span className={entrada ? "text-sm font-semibold text-emerald-600" : "text-sm font-semibold text-[#E10600]"}>
                  {entrada ? "" : "−"}
                  {formatCurrency(item.valor)}
                </span>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}
