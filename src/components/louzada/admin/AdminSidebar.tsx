"use client";

import Image from "next/image";
import Link from "next/link";
import { AdminSidebarNav } from "@/components/louzada/admin/AdminSidebarNav";
import type { AdminTabId } from "@/components/louzada/admin/types";

type AdminSidebarProps = {
  active: AdminTabId;
  onTabChange: (id: AdminTabId) => void;
};

export function AdminSidebar({ active, onTabChange }: AdminSidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-r border-zinc-200/80 bg-white md:w-[240px] lg:w-[260px]">
      <div className="border-b border-zinc-100 px-5 py-5">
        <Link href="/admin" className="inline-flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="Louzada Motos"
            width={120}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
        <p className="mt-2 text-xs font-medium text-zinc-500">Painel · Louzada Motos</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <AdminSidebarNav active={active} onChange={onTabChange} />
      </div>

      <div className="border-t border-zinc-100 px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl bg-[#F5F4F8] px-3 py-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E10600] text-sm font-bold text-white">
            LM
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-900">Administrador</p>
            <p className="truncate text-xs text-zinc-500">Sessão ativa</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
