"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { VehicleWithPhotos } from "@/lib/louzada/types";
import { formatCurrency } from "@/lib/format";

export function AdminVehiclesTab() {
  const [vehicles, setVehicles] = useState<VehicleWithPhotos[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    const res = await fetch(`/api/vehicles?${params}`);
    const data = (await res.json()) as VehicleWithPhotos[];
    setVehicles(data.filter((v) => v.status === "disponivel"));
    setLoading(false);
  }, [q]);

  useEffect(() => {
    void load();
  }, [load]);

  async function updatePrice(id: number, price: number) {
    await fetch(`/api/vehicles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price }),
    });
    void load();
  }

  async function toggleSold(id: number, sold: boolean) {
    await fetch(`/api/vehicles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: sold ? "vendido" : "disponivel" }),
    });
    void load();
  }

  async function remove(id: number) {
    if (!confirm("Excluir este veículo?")) return;
    await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
    void load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Buscar..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button type="button" variant="outline" onClick={() => void load()}>
          Atualizar
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Carregando…</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-100 text-xs uppercase">
              <tr>
                <th className="px-3 py-2">Veículo</th>
                <th className="px-3 py-2">Preço</th>
                <th className="px-3 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="border-t">
                  <td className="px-3 py-3">
                    <p className="font-medium">
                      {v.brand} {v.model} ({v.year})
                    </p>
                    <p className="text-xs text-zinc-500">{v.type}</p>
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      type="number"
                      className="w-32"
                      defaultValue={v.price}
                      onBlur={(e) => updatePrice(v.id, Number(e.target.value))}
                    />
                    <p className="mt-1 text-xs text-zinc-500">{formatCurrency(v.price)}</p>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => toggleSold(v.id, true)}
                      >
                        Marcar vendido
                      </Button>
                      <Button type="button" size="sm" variant="destructive" onClick={() => remove(v.id)}>
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
