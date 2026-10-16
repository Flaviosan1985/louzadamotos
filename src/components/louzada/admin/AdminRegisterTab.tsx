"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AdminRegisterTab() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(e.currentTarget);
    const body = {
      type: String(form.get("type")),
      brand: String(form.get("brand")),
      model: String(form.get("model")),
      year: Number(form.get("year")),
      km: Number(form.get("km")),
      color: String(form.get("color")),
      price: Number(form.get("price")),
      description: String(form.get("description")),
      featured: form.get("featured") === "on",
    };
    const res = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    if (!res.ok) {
      setMessage("Erro ao cadastrar.");
      return;
    }
    setMessage("Veículo cadastrado! Envie fotos na aba Fotos.");
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-xl gap-4">
      <div className="grid gap-2">
        <Label htmlFor="type">Tipo</Label>
        <select id="type" name="type" className="h-9 rounded-md border px-3 text-sm" required>
          <option value="moto">Moto</option>
          <option value="auto">Auto</option>
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="brand">Marca</Label>
          <Input id="brand" name="brand" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="model">Modelo</Label>
          <Input id="model" name="model" required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="year">Ano</Label>
          <Input id="year" name="year" type="number" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="km">Km</Label>
          <Input id="km" name="km" type="number" defaultValue={0} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price">Preço</Label>
          <Input id="price" name="price" type="number" step="0.01" required />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="color">Cor</Label>
        <Input id="color" name="color" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" name="description" rows={4} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" className="size-4 accent-[#E10600]" />
        Destaque na home
      </label>
      {message ? <p className="text-sm text-zinc-600">{message}</p> : null}
      <Button type="submit" disabled={loading} className="w-fit bg-[#E10600] hover:bg-[#C00500] text-white">
        {loading ? "Salvando…" : "Cadastrar veículo"}
      </Button>
    </form>
  );
}
