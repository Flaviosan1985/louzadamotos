"use client";

import { createContext, useContext } from "react";
import type { AppSnapshot } from "@/lib/data/app-data";

export type { AppSnapshot };

export type AppSnapshotState = {
  data: AppSnapshot | null;
  error: Error | null;
  loading: boolean;
  refetch: () => Promise<AppSnapshot | null>;
};

export const AppSnapshotContext = createContext<AppSnapshotState | null>(null);

export function useAppSnapshot() {
  const context = useContext(AppSnapshotContext);
  if (!context) {
    throw new Error("useAppSnapshot precisa do AppSnapshotProvider");
  }
  return context;
}
