import Link from "next/link";
import { Printer } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import type { ModuleRow } from "@/lib/types/modulos";
import { Button } from "@/components/ui/button";

export function SimulacoesSalvas({ rows }: { rows: ModuleRow[] }) {
  if (rows.length === 0) return null;
  return (
    <section aria-labelledby="simulacoes-titulo" className="bg-card space-y-3 rounded-xl border p-5">
      <h2 id="simulacoes-titulo" className="font-semibold">
        Simulações salvas
      </h2>
      <ul className="divide-y">
        {rows.map((row) => (
          <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 py-2 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{row.veiculo || "Valor avulso"}</p>
              <p className="text-muted-foreground text-xs">
                {[row.cliente, row.criado_em && formatDate(row.criado_em), row.parcela && formatCurrency(row.parcela)]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              nativeButton={false}
              render={<Link href={`/imprimir/proposta/${row.id}`} target="_blank" />}
            >
              <Printer aria-hidden />
              Proposta
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
