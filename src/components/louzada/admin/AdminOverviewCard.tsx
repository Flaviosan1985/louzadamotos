"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { VehicleWithPhotos } from "@/lib/louzada/types";
import { formatCurrency } from "@/lib/format";
import { adminCardClass, LOUZADA_POSITIVE, LOUZADA_RED } from "@/lib/louzada/admin-theme";

export function AdminOverviewCard() {
  const [vehicles, setVehicles] = useState<VehicleWithPhotos[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/vehicles");
    const data = (await res.json()) as VehicleWithPhotos[];
    setVehicles(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(() => {
    const disponivel = vehicles.filter((v) => v.status === "disponivel");
    const vendidos = vehicles.filter((v) => v.status === "vendido");
    const motos = disponivel.filter((v) => v.type === "moto").length;
    const autos = disponivel.filter((v) => v.type === "auto").length;
    const valorEstoque = disponivel.reduce((sum, v) => sum + v.price, 0);
    return { disponivel: disponivel.length, vendidos: vendidos.length, motos, autos, valorEstoque };
  }, [vehicles]);

  const bars = [
    { label: "Motos", value: stats.motos },
    { label: "Autos", value: stats.autos },
    { label: "Disp.", value: stats.disponivel },
    { label: "Vend.", value: stats.vendidos },
  ];
  const maxBar = Math.max(...bars.map((b) => b.value), 1);

  return (
    <section className={`${adminCardClass} overflow-hidden`}>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 px-6 py-5">
        <div>
          <p className="text-sm font-medium text-zinc-500">Resumo do estoque</p>
          <div className="mt-1 flex flex-wrap items-baseline gap-3">
            <p className="text-3xl font-bold tracking-tight text-zinc-900">
              {loading ? "—" : formatCurrency(stats.valorEstoque)}
            </p>
            {!loading && stats.disponivel > 0 ? (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold"
                style={{ color: LOUZADA_POSITIVE }}
              >
                <ArrowUpRight className="size-3.5" />
                {stats.disponivel} disponíveis
              </span>
            ) : null}
            {!loading && stats.vendidos > 0 ? (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-[#E10600]"
              >
                <ArrowDownRight className="size-3.5" />
                {stats.vendidos} vendidos
              </span>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="text-sm font-medium text-[#E10600] hover:underline"
        >
          Atualizar
        </button>
      </div>

      <div className="flex items-end justify-between gap-2 px-6 pt-6 pb-5">
        {bars.map((bar) => (
          <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-28 w-full max-w-[52px] items-end justify-center">
              <div
                className="w-full max-w-[36px] rounded-t-md transition-all duration-500 ease-out"
                style={{
                  height: `${Math.max(12, (bar.value / maxBar) * 100)}%`,
                  backgroundColor: LOUZADA_RED,
                  opacity: bar.value === 0 ? 0.25 : 1,
                }}
              />
            </div>
            <span className="text-[10px] font-semibold tracking-wide text-zinc-400 uppercase">
              {bar.label}
            </span>
            <span className="text-sm font-bold text-zinc-800">{loading ? "—" : bar.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
