import { formatCurrency } from "@/lib/format";
import type { CenarioFinanciado } from "@/lib/negocio/simulacao";

const percent = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 2 });

export function PrintCenario({ titulo, cenario, prazo }: { titulo: string; cenario: CenarioFinanciado | null; prazo: number }) {
  return (
    <section className="print:break-inside-avoid space-y-1">
      <h2 className="text-xs font-semibold tracking-wide uppercase">{titulo}</h2>
      {cenario ? (
        <ul className="space-y-0.5">
          <li>
            {prazo}× {formatCurrency(cenario.parcela)}
          </li>
          <li>Financiado {formatCurrency(cenario.valorFinanciado)}</li>
          <li>Juros {formatCurrency(cenario.juros)}</li>
          <li>Total pago {formatCurrency(cenario.totalPago)}</li>
          <li>
            CET estimado {percent.format(cenario.cetMensal)} a.m. · {percent.format(cenario.cetAnual)} a.a.
          </li>
          {cenario.alertaRenda ? <li>Parcela acima de 30% da renda informada.</li> : null}
        </ul>
      ) : (
        <p>Não se aplica neste cenário.</p>
      )}
    </section>
  );
}
