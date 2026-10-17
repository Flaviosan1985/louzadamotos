import Image from "next/image";
import Link from "next/link";
import { AtSign, Mail, MapPin } from "lucide-react";

export function StoreFooter() {
  return (
    <footer className="border-t border-[#1f1f1f] bg-[#080808]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <Image
                src="/logo.jpg"
                alt="Louzada Motos"
                width={44}
                height={44}
                className="rounded-full"
              />
              <div>
                <p className="font-display text-lg leading-none font-black text-white italic">
                  LOU<span className="text-[#c41e3a]">ZADA</span> MOTOS
                </p>
                <p className="text-[10px] tracking-widest text-[#555] uppercase">Motos & Autos</p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[#666]">
              Loja de motos e automóveis com estoque online, atendimento humano e negociação
              transparente.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold tracking-widest text-white uppercase">Navegação</p>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/#estoque", label: "Estoque" },
                { href: "/motos", label: "Motos" },
                { href: "/autos", label: "Autos" },
                { href: "/#sobre", label: "Sobre" },
                { href: "/#contato", label: "Contato" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[#666] transition-colors hover:text-[#c41e3a]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold tracking-widest text-white uppercase">Contato</p>
            <ul className="space-y-3 text-sm text-[#666]">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#c41e3a]" />
                Av. Principal, 1200 — Centro
              </li>
              <li>
                <a
                  href="mailto:contato@louzadamotos.com.br"
                  className="flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Mail size={14} className="text-[#c41e3a]" />
                  contato@louzadamotos.com.br
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-white"
                >
                  <AtSign size={14} className="text-[#c41e3a]" />
                  @louzadamotos
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#1f1f1f] pt-8 sm:flex-row">
          <p className="text-xs text-[#444]">
            © {new Date().getFullYear()} Louzada Motos · Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
