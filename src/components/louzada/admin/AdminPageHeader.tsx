import Link from "next/link";
import { ChevronLeft, LogOut } from "lucide-react";
import type { AdminTabId } from "@/components/louzada/admin/types";
import { ADMIN_TAB_LABELS } from "@/components/louzada/admin/types";

type AdminPageHeaderProps = {
  active: AdminTabId;
  onLogout: () => void;
};

export function AdminPageHeader({ active, onLogout }: AdminPageHeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="flex size-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-zinc-600 shadow-sm transition hover:text-[#E10600]"
          aria-label="Voltar ao site"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div>
          <p className="text-xs font-medium text-zinc-500">Louzada Motos</p>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
            {ADMIN_TAB_LABELS[active]}
          </h1>
        </div>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-[#E10600]/30 hover:text-[#E10600] xl:hidden"
      >
        <LogOut className="size-4" />
        Sair
      </button>
    </header>
  );
}
