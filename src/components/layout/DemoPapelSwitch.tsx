"use client";

import type { PapelUsuario } from "@/lib/types/database";
import { demoUpdateProfile } from "@/lib/demo/store";
import { useAppSnapshot } from "@/hooks/use-app-snapshot";

const PAPEIS: { value: PapelUsuario; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "vendedor", label: "Vendedor" },
  { value: "financeiro", label: "Financeiro" },
];

export function DemoPapelSwitch() {
  const { data, refetch } = useAppSnapshot();
  if (!data || data.mode !== "demo") return null;

  return (
    <label className="text-muted-foreground flex flex-col gap-1 px-2 py-1.5 text-xs">
      Perfil de demonstração
      <select
        className="border-input h-8 rounded-md border bg-transparent px-2 text-sm text-foreground"
        value={data.profile.papel}
        onChange={(event) => {
          demoUpdateProfile({ papel: event.target.value as PapelUsuario });
          void refetch();
        }}
      >
        {PAPEIS.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
