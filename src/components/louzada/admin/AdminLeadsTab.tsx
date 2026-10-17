"use client";

import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LeadRow = {
  id: number;
  vehicle_id: number;
  customer_name: string;
  phone: string;
  message: string;
  created_at: string;
  brand: string;
  model: string;
  year: number;
};

function formatPhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (d.length === 11) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }
  return phone;
}

export function AdminLeadsTab() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/leads");
    if (res.ok) {
      setLeads((await res.json()) as LeadRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const q = filter.trim().toLowerCase();
  const filtered = q
    ? leads.filter(
        (l) =>
          l.customer_name.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          `${l.brand} ${l.model}`.toLowerCase().includes(q) ||
          l.message.toLowerCase().includes(q),
      )
    : leads;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Filtrar por nome, telefone ou veículo…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Button type="button" variant="outline" onClick={() => void load()}>
          Atualizar
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Carregando…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-zinc-500">Nenhum interessado registrado ainda.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-100 text-xs uppercase">
              <tr>
                <th className="px-3 py-2">Data</th>
                <th className="px-3 py-2">Cliente</th>
                <th className="px-3 py-2">Veículo</th>
                <th className="px-3 py-2">Mensagem</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-t align-top">
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-zinc-500">
                    {new Date(l.created_at).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium">{l.customer_name}</p>
                    <p className="text-xs text-zinc-500">{formatPhone(l.phone)}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium">
                      {l.brand} {l.model}
                    </p>
                    <p className="text-xs text-zinc-500">{l.year}</p>
                  </td>
                  <td className="max-w-xs px-3 py-3 text-zinc-600">
                    {l.message || "—"}
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
