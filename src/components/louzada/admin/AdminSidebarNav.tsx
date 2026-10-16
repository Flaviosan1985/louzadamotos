"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Bike, Camera, CheckCircle, PlusCircle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LOUZADA_RED } from "@/lib/louzada/admin-theme";
import type { AdminTabId } from "@/components/louzada/admin/types";

type NavItem = {
  id: AdminTabId;
  label: string;
  icon: LucideIcon;
  group: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: "vehicles", label: "Veículos", icon: Bike, group: "Estoque" },
  { id: "register", label: "Cadastrar", icon: PlusCircle, group: "Estoque" },
  { id: "photos", label: "Fotos", icon: Camera, group: "Gestão" },
  { id: "sold", label: "Vendidos", icon: CheckCircle, group: "Gestão" },
];

type AdminSidebarNavProps = {
  active: AdminTabId;
  onChange: (id: AdminTabId) => void;
};

export function AdminSidebarNav({ active, onChange }: AdminSidebarNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<AdminTabId, HTMLButtonElement>());
  const [indicator, setIndicator] = useState({ top: 0, height: 0, opacity: 0 });

  const updateIndicator = useCallback(() => {
    const el = itemRefs.current.get(active);
    const container = containerRef.current;
    if (!el || !container) return;
    const c = container.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setIndicator({
      top: r.top - c.top,
      height: r.height,
      opacity: 1,
    });
  }, [active]);

  useLayoutEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  const groups = [...new Set(NAV_ITEMS.map((i) => i.group))];

  return (
    <nav aria-label="Painel">
      <div ref={containerRef} className="relative space-y-6">
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 left-0 rounded-xl transition-[top,height,opacity] duration-300 ease-out"
          style={{
            top: indicator.top,
            height: indicator.height,
            opacity: indicator.opacity,
            backgroundColor: LOUZADA_RED,
          }}
        />

        {groups.map((groupTitle) => (
          <div key={groupTitle}>
            <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
              {groupTitle}
            </p>
            <div className="space-y-0.5">
              {NAV_ITEMS.filter((i) => i.group === groupTitle).map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    ref={(node) => {
                      if (node) itemRefs.current.set(item.id, node);
                      else itemRefs.current.delete(item.id);
                    }}
                    type="button"
                    onClick={() => onChange(item.id)}
                    className={cn(
                      "relative z-10 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors duration-200",
                      isActive ? "text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                    )}
                  >
                    <Icon
                      className={cn("size-[18px] shrink-0", isActive ? "text-white" : "text-zinc-400")}
                    />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
