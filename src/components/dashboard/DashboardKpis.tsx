import { Car, CircleDollarSign, TrendingUp, Wallet } from "lucide-react";
import { formatCurrency, monthStartISO } from "@/lib/format";
import type { LancamentoFinanceiro, Veiculo } from "@/lib/types/database";
import { DashboardKpiCard } from "@/components/dashboard/DashboardKpiCard";

export function DashboardKpis({
  veiculos,
  financeiro,
}: {
  veiculos: Veiculo[];
  financeiro: LancamentoFinanceiro[];
}) {
  const estoque = veiculos.filter((item) => item.status !== "vendido").length;
  const mes = monthStartISO();
  const vendidosMes = veiculos.filter(
    (item) => item.status === "vendido" && (item.vendido_em ?? "") >= mes,
  ).length;
  const pagos = financeiro.filter((item) => item.status === "pago");
  const caixa =
    pagos.filter((item) => item.tipo === "receita").reduce((sum, item) => sum + item.valor, 0) -
    pagos.filter((item) => item.tipo === "despesa").reduce((sum, item) => sum + item.valor, 0);
  const receber = financeiro
    .filter((item) => item.tipo === "receita" && item.status === "pendente")
    .reduce((sum, item) => sum + item.valor, 0);

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardKpiCard
        label="Estoque"
        value={String(estoque)}
        hint="Veículos disponíveis e reservados"
        icon={Car}
      />
      <DashboardKpiCard
        label="Vendidos no mês"
        value={String(vendidosMes)}
        hint="Saídas registradas neste mês"
        icon={TrendingUp}
      />
      <DashboardKpiCard
        label="Caixa atual"
        value={formatCurrency(caixa)}
        hint="Receitas pagas menos despesas pagas"
        icon={Wallet}
      />
      <DashboardKpiCard
        label="Contas a receber"
        value={formatCurrency(receber)}
        hint="Receitas ainda pendentes"
        icon={CircleDollarSign}
      />
    </section>
  );
}
