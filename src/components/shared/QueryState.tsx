"use client";

import { createContext, useContext, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface QueryStateValue {
  loading: boolean;
  error: Error | null;
  empty: boolean;
  onRetry?: () => void;
}

const QueryStateContext = createContext<QueryStateValue | undefined>(undefined);

function useQueryStateContext() {
  const context = useContext(QueryStateContext);
  if (!context) {
    throw new Error("QueryState.* precisa estar dentro de QueryState");
  }
  return context;
}

function QueryStateRoot({
  loading,
  error,
  empty,
  onRetry,
  children,
}: QueryStateValue & { children: ReactNode }) {
  return (
    <QueryStateContext.Provider value={{ loading, error, empty, onRetry }}>
      {children}
    </QueryStateContext.Provider>
  );
}

function Loading({ children }: { children?: ReactNode }) {
  const { loading, error } = useQueryStateContext();
  if (!loading || error) return null;
  return (
    <>
      {children ?? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}
    </>
  );
}

function ErrorView() {
  const { error, onRetry } = useQueryStateContext();
  if (!error) return null;
  return (
    <div className="bg-card rounded-xl border p-6">
      <h2 className="text-lg font-semibold">Não foi possível carregar</h2>
      <p className="text-muted-foreground mt-1 text-sm">{error.message}</p>
      {onRetry ? (
        <Button className="mt-4" onClick={onRetry}>
          Tentar de novo
        </Button>
      ) : null}
    </div>
  );
}

function Ready({ children }: { children: ReactNode }) {
  const { loading, error } = useQueryStateContext();
  if (loading || error) return null;
  return <>{children}</>;
}

function Empty({ children }: { children: ReactNode }) {
  const { loading, error, empty } = useQueryStateContext();
  if (loading || error || !empty) return null;
  return <>{children}</>;
}

function Success({ children }: { children: ReactNode }) {
  const { loading, error, empty } = useQueryStateContext();
  if (loading || error || empty) return null;
  return <>{children}</>;
}

export const QueryState = Object.assign(QueryStateRoot, {
  Loading,
  Error: ErrorView,
  Ready,
  Empty,
  Success,
});
