import type { ReactNode } from "react";
import { LOUZADA_SURFACE } from "@/lib/louzada/admin-theme";

type AdminShellProps = {
  sidebar: ReactNode;
  aside: ReactNode;
  children: ReactNode;
};

export function AdminShell({ sidebar, aside, children }: AdminShellProps) {
  return (
    <div
      className="flex min-h-screen flex-col md:flex-row"
      style={{ backgroundColor: LOUZADA_SURFACE }}
    >
      {sidebar}
      <div className="flex min-w-0 flex-1 flex-col xl:flex-row xl:gap-2">
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        <div className="shrink-0 px-4 pb-6 xl:px-0 xl:py-6 xl:pr-6">{aside}</div>
      </div>
    </div>
  );
}
