import Link from "next/link";
import { Calendar, MessageCircle, Phone } from "lucide-react";

export function DashboardActions({ telefone }: { telefone: string | null }) {
  const ligar = telefone ? `tel:${telefone.replace(/\D/g, "")}` : "/contato";

  const actions = [
    { href: ligar, label: "Ligar agora", icon: Phone },
    { href: "/suporte", label: "Enviar mensagem", icon: MessageCircle },
    { href: "/atalhos/agenda", label: "Agendar atendimento", icon: Calendar },
  ];

  return (
    <section className="rounded-2xl border border-black/5 bg-white p-2 shadow-[0_8px_24px_rgba(20,16,40,0.04)]">
      <ul>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <li key={action.label}>
              <Link
                href={action.href}
                className="hover:bg-[#F5F4F8] flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition"
              >
                <Icon className="text-muted-foreground size-4" />
                {action.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
