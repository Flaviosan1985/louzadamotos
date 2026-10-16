"use client";

import { useCallback } from "react";
import { loadAppSnapshot, type AppSnapshot } from "@/lib/data/app-data";
import { useQuery } from "@/hooks/use-query";

export type { AppSnapshot };

export function useAppSnapshot() {
  const fetcher = useCallback(() => loadAppSnapshot(), []);
  return useQuery<AppSnapshot>("app-snapshot", fetcher);
}
