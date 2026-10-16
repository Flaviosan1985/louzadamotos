"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl, storeContactMessage } from "@/lib/louzada/whatsapp";
import { WhatsAppLink } from "@/components/louzada/WhatsAppLink";

const links = [
  { href: "/", label: "Início" },
  { href: "/motos", label: "Motos" },
  { href: "/autos", label: "Autos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function StoreHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wa = buildWhatsAppUrl(storeContactMessage());

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.jpg"
            alt="Louzada Motos"
            width={140}
            height={56}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Principal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium tracking-wide uppercase transition",
                pathname === link.href ? "text-[#c41e3a]" : "text-zinc-300 hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <WhatsAppLink href={wa} label="WhatsApp" className="text-xs" />
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-white md:hidden"
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open ? (
        <nav
          className="border-t border-white/10 bg-black px-4 py-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-1 text-sm font-medium text-white uppercase"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <WhatsAppLink href={wa} className="w-full" />
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
