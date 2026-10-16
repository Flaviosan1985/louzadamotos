"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ErrorBoundary>{children}</ErrorBoundary>
    </ThemeProvider>
  );
}
