"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { VehicleWithPhotos } from "@/lib/louzada/types";
import { formatCurrency } from "@/lib/format";

export function AdminSoldTab() {
  const [vehicles, setVehicles] = useState<VehicleWithPhotos[]>([]);

  const load = useCallback(async () => {
    const res = await fetch("/api/vehicles");
    const data = (await res.json()) as VehicleWithPhotos[];
    setVehicles(data.filter((v) => v.status === "vendido"));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function reactivate(id: number) {
    await fetch(`/api/vehicles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "disponivel" }),
    });
    void load();
  }

  return (
    <div className="space-y-3">
      {vehicles.length === 0 ? (
        <p className="text-sm text-zinc-500">Nenhum veículo vendido no momento.</p>
      ) : (
        vehicles.map((v) => (
          <div
            key={v.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3"
          >
            <div>
              <p className="font-medium">
                {v.brand} {v.model} ({v.year})
              </p>
              <p className="text-sm text-zinc-500">{formatCurrency(v.price)}</p>
            </div>
            <Button type="button" variant="outline" onClick={() => reactivate(v.id)}>
              Voltar a disponível
            </Button>
          </div>
        ))
      )}
    </div>
  );
}
