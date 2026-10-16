"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { VehicleWithPhotos } from "@/lib/louzada/types";

export function AdminPhotosTab() {
  const [vehicles, setVehicles] = useState<VehicleWithPhotos[]>([]);
  const [vehicleId, setVehicleId] = useState<number | null>(null);
  const [selected, setSelected] = useState<VehicleWithPhotos | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadVehicles = useCallback(async () => {
    const res = await fetch("/api/vehicles");
    const data = (await res.json()) as VehicleWithPhotos[];
    setVehicles(data);
  }, []);

  const loadVehicle = useCallback(async (id: number) => {
    const res = await fetch(`/api/vehicles/${id}`);
    if (res.ok) setSelected((await res.json()) as VehicleWithPhotos);
  }, []);

  useEffect(() => {
    void loadVehicles();
  }, [loadVehicles]);

  useEffect(() => {
    if (vehicleId) void loadVehicle(vehicleId);
  }, [vehicleId, loadVehicle]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!vehicleId || !e.target.files?.length) return;
    setUploading(true);
    const form = new FormData();
    Array.from(e.target.files).forEach((file) => form.append("files", file));
    await fetch(`/api/vehicles/${vehicleId}/photos`, { method: "POST", body: form });
    setUploading(false);
    e.target.value = "";
    void loadVehicle(vehicleId);
  }

  async function setCover(photoId: number) {
    await fetch(`/api/photos/${photoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cover" }),
    });
    if (vehicleId) void loadVehicle(vehicleId);
  }

  async function removePhoto(photoId: number) {
    if (!confirm("Excluir foto?")) return;
    await fetch(`/api/photos/${photoId}`, { method: "DELETE" });
    if (vehicleId) void loadVehicle(vehicleId);
  }

  async function movePhoto(photoId: number, direction: -1 | 1) {
    if (!selected) return;
    const ids = selected.photos.map((p) => p.id);
    const index = ids.indexOf(photoId);
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    await fetch(`/api/photos/${photoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "reorder",
        vehicleId: selected.id,
        photoIds: ids,
      }),
    });
    void loadVehicle(selected.id);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Veículo</label>
          <select
            className="h-9 min-w-[240px] rounded-md border px-3 text-sm"
            value={vehicleId ?? ""}
            onChange={(e) => setVehicleId(Number(e.target.value) || null)}
          >
            <option value="">Selecione…</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.brand} {v.model} ({v.year})
              </option>
            ))}
          </select>
        </div>
        {vehicleId ? (
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
            <input type="file" accept="image/*" multiple className="text-sm" onChange={onUpload} disabled={uploading} />
            {uploading ? "Enviando…" : "Enviar fotos"}
          </label>
        ) : null}
      </div>

      {selected?.photos.length ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {selected.photos.map((photo, index) => (
            <li key={photo.id} className="rounded-lg border p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/uploads/${encodeURIComponent(photo.filename)}`}
                alt=""
                className="mb-2 aspect-video w-full rounded object-cover"
              />
              <p className="text-xs text-zinc-500">
                {index === 0 ? "Capa" : `Posição ${index + 1}`}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {index !== 0 ? (
                  <Button type="button" size="sm" variant="outline" onClick={() => setCover(photo.id)}>
                    Definir capa
                  </Button>
                ) : null}
                <Button type="button" size="sm" variant="outline" onClick={() => movePhoto(photo.id, -1)}>
                  ↑
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => movePhoto(photo.id, 1)}>
                  ↓
                </Button>
                <Button type="button" size="sm" variant="destructive" onClick={() => removePhoto(photo.id)}>
                  Excluir
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-zinc-500">Nenhuma foto para este veículo.</p>
      )}
    </div>
  );
}
