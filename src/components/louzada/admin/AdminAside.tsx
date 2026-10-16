"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, LogOut, MessageCircle } from "lucide-react";
import { adminCardClass } from "@/lib/louzada/admin-theme";
import { buildWhatsAppUrl, storeContactMessage } from "@/lib/louzada/whatsapp";

type AdminAsideProps = {
  onLogout: () => void;
};

export function AdminAside({ onLogout }: AdminAsideProps) {
  const wa = buildWhatsAppUrl(storeContactMessage());

  return (
    <aside className="hidden w-[280px] shrink-0 space-y-4 xl:block">
      <div className={`${adminCardClass} px-5 py-6 text-center`}>
        <div className="mx-auto mb-3 flex size-16 items-center justify-center overflow-hidden rounded-full bg-zinc-100 ring-2 ring-zinc-100">
          <Image src="/logo.jpg" alt="" width={64} height={64} className="size-14 object-contain" />
        </div>
        <p className="font-semibold text-zinc-900">Louzada Motos</p>
        <p className="text-sm text-zinc-500">Painel administrativo</p>

        <ul className="mt-5 divide-y divide-zinc-100 text-left text-sm">
          <li>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-3 text-zinc-700 transition hover:text-[#E10600]"
            >
              <MessageCircle className="size-4 text-zinc-400" />
              WhatsApp da loja
            </a>
          </li>
          <li>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 py-3 text-zinc-700 transition hover:text-[#E10600]"
            >
              <ExternalLink className="size-4 text-zinc-400" />
              Ver site público
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-3 py-3 text-left text-zinc-700 transition hover:text-[#E10600]"
            >
              <LogOut className="size-4 text-zinc-400" />
              Sair do painel
            </button>
          </li>
        </ul>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl p-5 text-white shadow-sm"
        style={{
          background: "linear-gradient(135deg, #E10600 0%, #9a0400 100%)",
        }}
      >
        <p className="text-xs font-semibold tracking-wider uppercase opacity-80">Marca</p>
        <p className="mt-2 text-lg font-bold">Louzada Motos</p>
        <p className="mt-1 text-sm opacity-90">Estoque, fotos e vendidos em um só lugar.</p>
        <div className="pointer-events-none absolute -right-6 -bottom-8 size-32 rounded-full bg-white/10" />
      </div>
    </aside>
  );
}
