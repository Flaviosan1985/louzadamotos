"use client";

import { useEffect } from "react";
import { isDemoMode } from "@/lib/data/app-data";
import { readDemoState } from "@/lib/demo/store";

/** Envia o estoque do demo (localStorage) para o snapshot que alimenta o site público. */
export function VitrineDemoSync() {
  useEffect(() => {
    if (!isDemoMode()) return;

    const push = () => {
      const veiculos = readDemoState().veiculos;
      void fetch("/api/vitrine/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ veiculos }),
        credentials: "same-origin",
      }).then((res) => {
        if (!res.ok) {
          console.warn("[vitrine] sync falhou:", res.status);
        }
      });
    };

    push();
    window.addEventListener("patio-demo-updated", push);
    return () => window.removeEventListener("patio-demo-updated", push);
  }, []);

  return null;
}
