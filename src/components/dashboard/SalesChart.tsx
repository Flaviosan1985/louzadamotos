import { formatCurrency, formatMonthLabel, monthStartISO } from "@/lib/format";
import type { LancamentoFinanceiro, Veiculo } from "@/lib/types/database";

export function SalesChart({
  veiculos,
  financeiro,
}: {
  veiculos: Veiculo[];
  financeiro: LancamentoFinanceiro[];
}) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const count = veiculos.filter((item) => (item.vendido_em ?? "").startsWith(key)).length;
    return { key, count };
  });
  const max = Math.max(...months.map((item) => item.count), 1);
  const pagos = financeiro.filter((item) => item.status === "pago");
  const caixa =
    pagos.filter((item) => item.tipo === "receita").reduce((sum, item) => sum + item.valor, 0) -
    pagos.filter((item) => item.tipo === "despesa").reduce((sum, item) => sum + item.valor, 0);
  const atual = months.at(-1)?.count ?? 0;
  const anterior = months.at(-2)?.count ?? 0;
  const variacao = anterior === 0 ? (atual > 0 ? 100 : 0) : ((atual - anterior) / anterior) * 100;
  const positiva = variacao >= 0;
  const mes = monthStartISO();
  const vendidosMes = veiculos.filter(
    (item) => item.status === "vendido" && (item.vendido_em ?? "") >= mes,
  ).length;
  const receber = financeiro
    .filter((item) => item.tipo === "receita" && item.status === "pendente")
    .reduce((sum, item) => sum + item.valor, 0);

  return (
    <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_8px_24px_rgba(20,16,40,0.04)]">
      <p className="text-sm text-zinc-500">Caixa do pátio</p>
      <div className="mt-1 flex flex-wrap items-end gap-3">
        <p className="text-4xl font-semibold tracking-tight">{formatCurrency(caixa)}</p>
        <p className={positiva ? "mb-1 text-sm font-medium text-emerald-600" : "mb-1 text-sm font-medium text-[#E10600]"}>
          {positiva ? "↑" : "↓"} {Math.abs(variacao).toFixed(0)}%
        </p>
      </div>
      <p className="mt-2 text-xs text-zinc-500">
        {vendidosMes} {vendidosMes === 1 ? "vendido" : "vendidos"} no mês · {formatCurrency(receber)} a receber
      </p>
      <div className="mt-8 flex h-36 items-end gap-3">
        {months.map((item) => (
          <div key={item.key} className="flex h-full flex-1 flex-col justify-end gap-2">
            <div
              className={item.count > 0 ? "w-full rounded-md bg-[#E10600]" : "w-full rounded-md bg-zinc-200"}
              style={{ height: `${item.count > 0 ? Math.max((item.count / max) * 100, 18) : 8}%` }}
            />
            <span className="text-center text-[11px] text-zinc-400 uppercase">
              {formatMonthLabel(item.key)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
