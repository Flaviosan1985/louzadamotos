"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { VehicleDetailView } from "@/components/louzada/VehicleDetailView";
import { readDemoState } from "@/lib/demo/store";
import { veiculoToPublic } from "@/lib/catalog/from-dashboard";
import type { VehicleWithPhotos } from "@/lib/louzada/types";

export function DashboardVehicleDetail({ id }: { id: string }) {
  const [vehicle, setVehicle] = useState<VehicleWithPhotos | null | undefined>(undefined);

  useEffect(() => {
    const load = () => {
      const found = readDemoState().veiculos.find((item) => item.id === id);
      if (!found || found.status === "reservado") {
        setVehicle(null);
        return;
      }
      setVehicle(veiculoToPublic(found));
    };
    load();
    window.addEventListener("patio-demo-updated", load);
    return () => window.removeEventListener("patio-demo-updated", load);
  }, [id]);

  if (vehicle === undefined) {
    return <p className="px-4 py-16 text-center text-sm text-zinc-400">Carregando veículo…</p>;
  }

  if (!vehicle) {
    return (
      <div className="px-4 py-16 text-center text-zinc-300">
        <p>Este veículo não está na vitrine.</p>
        <Link href="/" className="mt-4 inline-block text-sm text-[#c41e3a]">
          Voltar ao estoque
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/40">
      <VehicleDetailView vehicle={vehicle} />
    </div>
  );
}
