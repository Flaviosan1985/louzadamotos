"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { VehicleFilters } from "@/components/louzada/VehicleFilters";
import { VehicleGrid } from "@/components/louzada/VehicleGrid";
import { WhiteSection } from "@/components/louzada/WhiteSection";
import { readDemoState } from "@/lib/demo/store";
import { listPublicFromDashboard } from "@/lib/catalog/from-dashboard";
import { demoVeiculos } from "@/lib/demo/seed";
import { parseFiltersFromSearchParams } from "@/lib/louzada/parse-filters";
import type { VehicleType } from "@/lib/louzada/types";
import type { Veiculo } from "@/lib/types/database";

function useDashboardVeiculos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>(demoVeiculos);

  useEffect(() => {
    const load = () => setVeiculos(readDemoState().veiculos);
    load();
    window.addEventListener("patio-demo-updated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("patio-demo-updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  return veiculos;
}

export function DashboardStock({
  variant,
  basePath,
  title,
  defaultType,
}: {
  variant: "home" | "listing";
  basePath: string;
  title: string;
  defaultType?: VehicleType;
}) {
  const searchParams = useSearchParams();
  const veiculos = useDashboardVeiculos();
  const filters = useMemo(() => {
    const record: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      record[key] = value;
    });
    return parseFiltersFromSearchParams(record, defaultType);
  }, [searchParams, defaultType]);

  const stock = useMemo(
    () => listPublicFromDashboard(veiculos, filters),
    [veiculos, filters],
  );
  const brands = useMemo(() => {
    const pool = listPublicFromDashboard(veiculos, { type: filters.type, hideSold: true });
    return [...new Set(pool.map((vehicle) => vehicle.brand))].sort((a, b) => a.localeCompare(b));
  }, [veiculos, filters.type]);

  if (variant === "home") {
    const featured = listPublicFromDashboard(veiculos, { hideSold: true }).slice(0, 3);
    return (
      <>
        <WhiteSection title="Destaques">
          <VehicleGrid
            vehicles={featured}
            emptyMessage="Em breve novos destaques no estoque."
          />
        </WhiteSection>
        <div className="bg-zinc-900/50 py-2">
          <WhiteSection title="Estoque" id="estoque">
            <VehicleFilters brands={brands} basePath={basePath} />
            <VehicleGrid vehicles={stock} />
          </WhiteSection>
        </div>
      </>
    );
  }

  return (
    <div className="bg-zinc-900/50 py-10">
      <WhiteSection title={title}>
        <VehicleFilters brands={brands} basePath={basePath} />
        <VehicleGrid vehicles={stock} />
      </WhiteSection>
    </div>
  );
}
