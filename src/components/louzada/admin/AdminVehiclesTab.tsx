"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { VehicleWithPhotos } from "@/lib/louzada/types";
import { formatCurrency } from "@/lib/format";

type LeadRow = { vehicle_id: number };

type ViewMode = "grid" | "table";

function VehicleLeadsList({ vehicleId }: { vehicleId: number }) {
  const [rows, setRows] = useState<
    { customer_name: string; phone: string; message: string; created_at: string }[]
  >([]);
  const [open, setOpen] = useState(false);

  async function load() {
    const res = await fetch(`/api/leads?vehicleId=${vehicleId}`);
    if (res.ok) setRows(await res.json());
    setOpen(true);
  }

  return (
    <>
      <Button type="button" size="sm" variant="outline" onClick={() => void load()}>
        Interessados
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Clientes interessados</DialogTitle>
          </DialogHeader>
          {rows.length === 0 ? (
            <p className="text-sm text-zinc-500">Ninguém registrou interesse ainda.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {rows.map((r, i) => (
                <li key={`${r.created_at}-${i}`} className="rounded-lg border p-3">
                  <p className="font-medium">{r.customer_name}</p>
                  <p className="text-zinc-500">{r.phone}</p>
                  {r.message ? <p className="mt-2 text-zinc-600">{r.message}</p> : null}
                  <p className="mt-1 text-xs text-zinc-400">
                    {new Date(r.created_at).toLocaleString("pt-BR")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AdminVehiclesTab() {
  const [vehicles, setVehicles] = useState<VehicleWithPhotos[]>([]);
  const [leadCounts, setLeadCounts] = useState<Record<string, number>>({});
  const [q, setQ] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<VehicleWithPhotos | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    const [vehiclesRes, leadsRes] = await Promise.all([
      fetch(`/api/vehicles?${params}`),
      fetch("/api/leads"),
    ]);
    const data = (await vehiclesRes.json()) as VehicleWithPhotos[];
    setVehicles(data.filter((v) => v.status === "disponivel"));

    if (leadsRes.ok) {
      const leads = (await leadsRes.json()) as LeadRow[];
      const counts: Record<string, number> = {};
      for (const l of leads) {
        const key = String(l.vehicle_id);
        counts[key] = (counts[key] ?? 0) + 1;
      }
      setLeadCounts(counts);
    }
    setLoading(false);
  }, [q]);

  useEffect(() => {
    void load();
  }, [load]);

  const motos = useMemo(() => vehicles.filter((v) => v.type === "moto"), [vehicles]);
  const autos = useMemo(() => vehicles.filter((v) => v.type === "auto"), [vehicles]);
  const list = [...motos, ...autos];

  async function saveEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const form = new FormData(e.currentTarget);
    await fetch(`/api/vehicles/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: form.get("type"),
        brand: form.get("brand"),
        model: form.get("model"),
        year: Number(form.get("year")),
        km: Number(form.get("km")),
        color: form.get("color"),
        price: Number(form.get("price")),
        description: form.get("description"),
        displacement: form.get("displacement") ? Number(form.get("displacement")) : null,
        featured: form.get("featured") === "on",
      }),
    });
    setSaving(false);
    setEditing(null);
    void load();
  }

  async function toggleSold(id: number | string) {
    await fetch(`/api/vehicles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "vendido" }),
    });
    void load();
  }

  async function remove(id: number | string) {
    if (!confirm("Excluir este veículo?")) return;
    await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
    void load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Buscar..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button type="button" variant="outline" onClick={() => void load()}>
          Atualizar
        </Button>
        <div className="ml-auto flex gap-1 rounded-lg border p-1">
          <Button
            type="button"
            size="sm"
            variant={view === "grid" ? "default" : "ghost"}
            className={view === "grid" ? "bg-[#E10600] hover:bg-[#C00500]" : ""}
            onClick={() => setView("grid")}
          >
            Grade
          </Button>
          <Button
            type="button"
            size="sm"
            variant={view === "table" ? "default" : "ghost"}
            className={view === "table" ? "bg-[#E10600] hover:bg-[#C00500]" : ""}
            onClick={() => setView("table")}
          >
            Tabela
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Carregando…</p>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((v) => (
            <article key={v.id} className="overflow-hidden rounded-xl border bg-white">
              <div className="relative aspect-[4/3] bg-zinc-100">
                <Image
                  src={v.coverUrl ?? "/logo.jpg"}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
                {(leadCounts[String(v.id)] ?? 0) > 0 ? (
                  <span className="absolute top-2 right-2 rounded-full bg-[#E10600] px-2 py-0.5 text-xs font-bold text-white">
                    {leadCounts[String(v.id)]} interessado(s)
                  </span>
                ) : null}
              </div>
              <div className="space-y-2 p-4">
                <p className="font-semibold">
                  {v.brand} {v.model} ({v.year})
                </p>
                <p className="text-xs text-zinc-500">
                  {v.type === "moto" && v.displacement ? `${v.displacement} cc · ` : ""}
                  {v.color} · {formatCurrency(v.price)}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => setEditing(v)}>
                    Editar
                  </Button>
                  <VehicleLeadsList vehicleId={Number(v.id)} />
                  <Button type="button" size="sm" variant="outline" onClick={() => toggleSold(v.id)}>
                    Vendido
                  </Button>
                  <Button type="button" size="sm" variant="destructive" onClick={() => remove(v.id)}>
                    Excluir
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-100 text-xs uppercase">
              <tr>
                <th className="px-3 py-2">Foto</th>
                <th className="px-3 py-2">Veículo</th>
                <th className="px-3 py-2">Preço</th>
                <th className="px-3 py-2">Leads</th>
                <th className="px-3 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {list.map((v) => (
                <tr key={v.id} className="border-t align-middle">
                  <td className="px-3 py-2">
                    <div className="relative h-14 w-20 overflow-hidden rounded-md bg-zinc-100">
                      <Image
                        src={v.coverUrl ?? "/logo.jpg"}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium">
                      {v.brand} {v.model} ({v.year})
                    </p>
                    <p className="text-xs text-zinc-500">
                      {v.type}
                      {v.displacement ? ` · ${v.displacement} cc` : ""}
                    </p>
                  </td>
                  <td className="px-3 py-3">{formatCurrency(v.price)}</td>
                  <td className="px-3 py-3">{leadCounts[String(v.id)] ?? 0}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={() => setEditing(v)}>
                        Editar
                      </Button>
                      <VehicleLeadsList vehicleId={Number(v.id)} />
                      <Button type="button" size="sm" variant="outline" onClick={() => toggleSold(v.id)}>
                        Vendido
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

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar veículo</DialogTitle>
          </DialogHeader>
          {editing ? (
            <form onSubmit={(e) => void saveEdit(e)} className="grid gap-3">
              <div className="grid gap-2">
                <Label>Tipo</Label>
                <select name="type" defaultValue={editing.type} className="h-9 rounded-md border px-3 text-sm">
                  <option value="moto">Moto</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Marca</Label>
                  <Input name="brand" defaultValue={editing.brand} required />
                </div>
                <div className="grid gap-2">
                  <Label>Modelo</Label>
                  <Input name="model" defaultValue={editing.model} required />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label>Ano</Label>
                  <Input name="year" type="number" defaultValue={editing.year} required />
                </div>
                <div className="grid gap-2">
                  <Label>Cilindrada</Label>
                  <Input
                    name="displacement"
                    type="number"
                    defaultValue={editing.displacement ?? ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Km</Label>
                  <Input name="km" type="number" defaultValue={editing.km} />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Cor</Label>
                  <Input name="color" defaultValue={editing.color} />
                </div>
                <div className="grid gap-2">
                  <Label>Preço</Label>
                  <Input name="price" type="number" step="0.01" defaultValue={editing.price} required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Descrição</Label>
                <Textarea name="description" rows={3} defaultValue={editing.description} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="featured" defaultChecked={editing.featured === 1} className="size-4" />
                Destaque na home
              </label>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving} className="bg-[#E10600] hover:bg-[#C00500]">
                  {saving ? "Salvando…" : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
