"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="bg-card max-w-md rounded-xl border p-6">
        <h2 className="text-lg font-semibold">Algo deu errado</h2>
        <p className="text-muted-foreground mt-1 text-sm">{error.message}</p>
        <Button className="mt-4" onClick={reset}>
          Tentar de novo
        </Button>
      </div>
    </div>
  );
}
