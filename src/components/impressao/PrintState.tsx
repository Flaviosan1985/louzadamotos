"use client";

import type { ReactNode } from "react";
import { useAppSnapshot, type AppSnapshot } from "@/hooks/use-app-snapshot";
import { Skeleton } from "@/components/ui/skeleton";

export function PrintState({ children }: { children: (data: AppSnapshot) => ReactNode }) {
  const { data, error } = useAppSnapshot();
  if (error) return <p className="p-8 text-sm">Não foi possível carregar os dados: {error.message}</p>;
  if (!data) return <Skeleton className="mx-auto mt-8 h-[60vh] max-w-[210mm]" />;
  return <>{children(data)}</>;
}
