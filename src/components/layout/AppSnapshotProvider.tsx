"use client";

import { type ReactNode, useCallback, useEffect } from "react";
import { loadAppSnapshot, type AppSnapshot } from "@/lib/data/app-data";
import { AppSnapshotContext } from "@/hooks/use-app-snapshot";
import { useQuery } from "@/hooks/use-query";

export function AppSnapshotProvider({ children }: { children: ReactNode }) {
  const fetcher = useCallback(() => loadAppSnapshot(), []);
  const value = useQuery<AppSnapshot>("app-snapshot", fetcher);
  const { refetch } = value;

  useEffect(() => {
    const refresh = () => {
      void refetch();
    };
    window.addEventListener("patio-demo-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("patio-demo-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refetch]);

  return <AppSnapshotContext.Provider value={value}>{children}</AppSnapshotContext.Provider>;
}
