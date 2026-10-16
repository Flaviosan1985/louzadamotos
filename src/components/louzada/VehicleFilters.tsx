"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type VehicleFiltersProps = {
  brands: string[];
  basePath: string;
};

export function VehicleFilters({ brands, basePath }: VehicleFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function update(field: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(field, value);
    else params.delete(field);
    startTransition(() => {
      router.push(`${basePath}?${params.toString()}`);
    });
  }

  return (
    <form
      className="mb-6 grid gap-3 md:grid-cols-2 lg:grid-cols-5"
      onSubmit={(e) => e.preventDefault()}
    >
      <Input
        placeholder="Buscar marca, modelo..."
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => update("q", e.target.value)}
        aria-label="Busca"
      />
      <select
        className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm"
        value={searchParams.get("brand") ?? ""}
        onChange={(e) => update("brand", e.target.value)}
        aria-label="Marca"
      >
        <option value="">Todas as marcas</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>
      <Input
        type="number"
        placeholder="Preço mín."
        defaultValue={searchParams.get("minPrice") ?? ""}
        onChange={(e) => update("minPrice", e.target.value)}
        aria-label="Preço mínimo"
      />
      <Input
        type="number"
        placeholder="Preço máx."
        defaultValue={searchParams.get("maxPrice") ?? ""}
        onChange={(e) => update("maxPrice", e.target.value)}
        aria-label="Preço máximo"
      />
      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          className="size-4 accent-[#c41e3a]"
          checked={searchParams.get("hideSold") === "1"}
          onChange={(e) => update("hideSold", e.target.checked ? "1" : "")}
        />
        Ocultar vendidos
      </label>
      {pending ? (
        <Button type="button" variant="outline" disabled className="lg:col-span-5">
          Filtrando…
        </Button>
      ) : null}
    </form>
  );
}
