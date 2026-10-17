"use client";

import { type ReactNode, useCallback } from "react";
import { loadAppSnapshot, type AppSnapshot } from "@/lib/data/app-data";
import { AppSnapshotContext } from "@/hooks/use-app-snapshot";
import { useQuery } from "@/hooks/use-query";

export function AppSnapshotProvider({ children }: { children: ReactNode }) {
  const fetcher = useCallback(() => loadAppSnapshot(), []);
  const value = useQuery<AppSnapshot>("app-snapshot", fetcher);

  return <AppSnapshotContext.Provider value={value}>{children}</AppSnapshotContext.Provider>;
}
