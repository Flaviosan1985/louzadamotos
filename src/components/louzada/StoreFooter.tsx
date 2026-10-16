import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";

const footerLinks = [
  { href: "/", label: "Início" },
  { href: "/motos", label: "Motos" },
  { href: "/autos", label: "Autos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function StoreFooter() {
  return (
    <footer className="relative mt-auto border-t border-white/10 bg-zinc-950 text-zinc-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <Image
            src="/logo.jpg"
            alt="Louzada Motos"
            width={160}
            height={64}
            className="mb-4 h-14 w-auto object-contain"
          />
          <p className="text-sm leading-relaxed text-zinc-400">
            Motos e autos selecionados, atendimento direto e condições especiais na região.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-white uppercase">
            Navegação
          </p>
          <ul className="space-y-2 text-sm">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-[#c41e3a]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-white uppercase">
            Contato
          </p>
          <p className="text-sm">Av. Principal, 1200 — Centro</p>
          <p className="text-sm">Seg–Sex 9h–18h · Sáb 9h–13h</p>
          <div className="mt-4 flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 p-2 hover:border-[#c41e3a] hover:text-[#c41e3a]"
              aria-label="Instagram"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 p-2 hover:border-[#c41e3a] hover:text-[#c41e3a]"
              aria-label="Facebook"
            >
              <Facebook className="size-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Louzada Motos. Todos os direitos reservados.
      </div>
    </footer>
  );
}
