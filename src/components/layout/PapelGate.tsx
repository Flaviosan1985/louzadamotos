"use client";

import { type ReactNode } from "react";
import { rotaPermitida } from "@/lib/negocio/permissoes";
import { useAppSnapshot } from "@/hooks/use-app-snapshot";
import { usePanelNav } from "@/components/layout/panel/PanelNavProvider";
import { PapelBloqueado } from "@/components/layout/PapelBloqueado";

export function PapelGate({ children }: { children: ReactNode }) {
  const { pathname } = usePanelNav();
  const { data } = useAppSnapshot();
  if (data && !rotaPermitida(pathname, data.profile.papel)) {
    return <PapelBloqueado />;
  }
  return children;
}
