"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { normalizePanelPath } from "@/lib/panel/paths";

type PanelNavValue = {
  pathname: string;
  navigate: (href: string) => void;
};

const PanelNavContext = createContext<PanelNavValue | null>(null);

export function PanelNavProvider({ children }: { children: ReactNode }) {
  const nextPathname = usePathname();
  const [pathname, setPathname] = useState(nextPathname);

  useEffect(() => {
    setPathname(nextPathname);
  }, [nextPathname]);

  useEffect(() => {
    function onPopState() {
      setPathname(window.location.pathname);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((href: string) => {
    const url = new URL(href, window.location.origin);
    const nextPath = normalizePanelPath(url.pathname);
    const next = `${nextPath}${url.search}`;
    const current = `${window.location.pathname}${window.location.search}`;
    if (next !== current) {
      window.history.pushState(null, "", next);
    }
    setPathname(nextPath);
  }, []);

  const value = useMemo(() => ({ pathname, navigate }), [pathname, navigate]);

  return <PanelNavContext.Provider value={value}>{children}</PanelNavContext.Provider>;
}

export function usePanelNav() {
  const context = useContext(PanelNavContext);
  if (!context) {
    throw new Error("usePanelNav precisa do PanelNavProvider");
  }
  return context;
}
