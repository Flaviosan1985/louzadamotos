"use client";

import { type ComponentType } from "react";
import { PanelLink } from "@/components/layout/panel/PanelLink";
import { usePanelNav } from "@/components/layout/panel/PanelNavProvider";
import * as Icon from "lucide-react";
import { shortcutItems } from "@/configs/navConfig";
import { filtrarAtalhos } from "@/lib/negocio/permissoes";
import { useAppSnapshot } from "@/hooks/use-app-snapshot";
import { cn } from "@/lib/utils";

export function ShortcutBar() {
  const { pathname } = usePanelNav();
  const { data } = useAppSnapshot();
  const atalhos = data ? filtrarAtalhos(shortcutItems, data.profile.papel) : shortcutItems;

  return (
    <nav
      aria-label="Atalhos"
      className="bg-card flex flex-wrap items-center gap-1 overflow-x-auto rounded-xl border px-2 py-2"
    >
      {atalhos.map((item) => {
        const Tag = Icon[item.icon] as ComponentType<{ className?: string }>;
        const active = item.href === "/" ? pathname === "/" : pathname === item.href;

        return (
          <PanelLink
            key={item.label}
            href={item.href}
            title={item.label}
            className={cn(
              "text-muted-foreground hover:text-foreground hover:bg-muted flex size-10 items-center justify-center rounded-md transition",
              active && "text-primary bg-primary/10",
            )}
          >
            {Tag ? <Tag className="size-5" /> : null}
            <span className="sr-only">{item.label}</span>
          </PanelLink>
        );
      })}
    </nav>
  );
}
