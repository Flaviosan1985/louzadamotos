"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type VehicleFiltersProps = {
  brands: string[];
  basePath: string;
};

const fieldClass =
  "h-11 w-full rounded-xl border border-[#2a2a2a] bg-[#141414] px-3 text-sm text-white placeholder:text-[#555] focus:border-[#c41e3a]/50 focus:outline-none";

export function VehicleFilters({ brands, basePath }: VehicleFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function update(field: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(field, value);
    else params.delete(field);
    startTransition(() => {
      router.push(`${basePath}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <form
      className="mb-8 grid gap-3 md:grid-cols-2 lg:grid-cols-5"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        className={fieldClass}
        placeholder="Buscar marca, modelo..."
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => update("q", e.target.value)}
        aria-label="Busca"
      />
      <select
        className={fieldClass}
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
      <input
        type="number"
        className={fieldClass}
        placeholder="Preço mín."
        defaultValue={searchParams.get("minPrice") ?? ""}
        onChange={(e) => update("minPrice", e.target.value)}
        aria-label="Preço mínimo"
      />
      <input
        type="number"
        className={fieldClass}
        placeholder="Preço máx."
        defaultValue={searchParams.get("maxPrice") ?? ""}
        onChange={(e) => update("maxPrice", e.target.value)}
        aria-label="Preço máximo"
      />
      <label className="flex h-11 items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#141414] px-3 text-sm text-[#aaa]">
        <input
          type="checkbox"
          className="size-4 accent-[#c41e3a]"
          checked={searchParams.get("hideSold") === "1"}
          onChange={(e) => update("hideSold", e.target.checked ? "1" : "")}
        />
        Ocultar vendidos
      </label>
      {pending ? <p className="text-xs text-[#666] lg:col-span-5">Filtrando…</p> : null}
    </form>
  );
}
