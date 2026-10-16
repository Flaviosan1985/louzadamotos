import type { Profile, Tenant } from "@/lib/types/database";

function initialsFrom(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function DashboardProfile({ profile, tenant }: { profile: Profile; tenant: Tenant }) {
  return (
    <section className="rounded-2xl border border-black/5 bg-white px-5 py-6 text-center shadow-[0_8px_24px_rgba(20,16,40,0.04)]">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#E10600] text-lg font-semibold text-white">
        {initialsFrom(profile.nome)}
      </span>
      <h2 className="mt-3 text-lg font-semibold">{profile.nome}</h2>
      <p className="text-muted-foreground text-sm">{tenant.nome}</p>
    </section>
  );
}
