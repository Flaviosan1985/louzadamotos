"use client";

import { type ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icon from "lucide-react";
import { shortcutItems } from "@/configs/navConfig";
import { cn } from "@/lib/utils";

export function ShortcutBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Atalhos"
      className="bg-card flex flex-wrap items-center gap-1 overflow-x-auto rounded-xl border px-2 py-2"
    >
      {shortcutItems.map((item) => {
        const Tag = Icon[item.icon] as ComponentType<{ className?: string }>;
        const active = item.href === "/" ? pathname === "/" : pathname === item.href;

        return (
          <Link
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
          </Link>
        );
      })}
    </nav>
  );
}
