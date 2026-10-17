"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl, storeContactMessage } from "@/lib/louzada/whatsapp";
import { WaIcon } from "@/components/louzada/WaIcon";

const links = [
  { label: "Início", href: "/#inicio" },
  { label: "Destaques", href: "/#destaques" },
  { label: "Estoque", href: "/#estoque" },
  { label: "Motos", href: "/motos" },
  { label: "Autos", href: "/autos" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Contato", href: "/#contato" },
];

export function StoreHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const wa = buildWhatsAppUrl(storeContactMessage());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#2a2a2a]"
          : "bg-gradient-to-b from-[#0a0a0a]/80 to-transparent",
      )}
    >
      <div className="h-0.5 w-full bg-[#c41e3a]" />

      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <Link href="/#inicio" className="flex shrink-0 items-center gap-2.5" onClick={close}>
          <Image
            src="/logo.jpg"
            alt="Louzada Motos"
            width={48}
            height={48}
            className="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12"
            priority
          />
          <div>
            <p className="font-display text-base leading-none font-black tracking-wide text-white italic sm:text-lg">
              LOU<span className="text-[#c41e3a]">ZADA</span>
            </p>
            <p className="mt-0.5 text-[9px] tracking-widest text-[#666] uppercase">Motos & Autos</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 xl:gap-7 lg:flex" aria-label="Principal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "py-2 text-sm font-medium tracking-wider uppercase transition-colors",
                pathname === link.href || (link.href.startsWith("/#") && pathname === "/")
                  ? "text-white"
                  : "text-[#aaa] hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#25D366] px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#1db954] sm:px-4 sm:text-sm"
            >
              <WaIcon className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          ) : null}

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#aaa] transition-all hover:bg-[#1a1a1a] hover:text-white lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-[#2a2a2a] bg-[#0f0f0f]/98 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col px-4 py-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="flex items-center border-b border-[#1a1a1a] py-4 text-base font-semibold tracking-wider text-[#ccc] uppercase active:text-[#c41e3a]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
