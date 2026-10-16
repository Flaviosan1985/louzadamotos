import { CalendarClock, Car, FileWarning, Percent, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { calcularIndicadores } from "@/lib/negocio/indicadores";
import { DashboardKpiCard } from "@/components/dashboard/DashboardKpiCard";

const pct = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 });

export function DashboardIndicadores({ indicadores: i }: { indicadores: ReturnType<typeof calcularIndicadores> }) {
  return (
    <section aria-label="Indicadores" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <DashboardKpiCard
        label="Valor do estoque"
        value={formatCurrency(i.valorEstoque)}
        hint={`${i.veiculosEstoque} veículo(s) a preço de venda`}
        icon={Car}
      />
      <DashboardKpiCard
        label="Margem média"
        value={i.margemMedia === null ? "—" : pct.format(i.margemMedia)}
        hint="Vendidos, após despesas e comissão"
        icon={Percent}
      />
      <DashboardKpiCard
        label="Dias em estoque"
        value={i.diasMedioEstoque === null ? "—" : `${i.diasMedioEstoque} dias`}
        hint="Média dos veículos não vendidos"
        icon={CalendarClock}
      />
      <DashboardKpiCard
        label="Conversão do funil"
        value={i.conversaoFunil === null ? "—" : pct.format(i.conversaoFunil)}
        hint="Cartões vendidos sobre o total"
        icon={TrendingUp}
      />
      <DashboardKpiCard
        label="Transferências"
        value={String(i.transferenciasPendentes)}
        hint={
          i.transferenciasAlerta > 0
            ? `${i.transferenciasAlerta} com prazo em até 5 dias ou vencido`
            : "Pendentes dentro do prazo de 30 dias"
        }
        icon={FileWarning}
      />
    </section>
  );
}
