import type { LucideIcon } from "lucide-react";

export function DashboardKpiCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
}) {
  return (
    <article className="bg-card rounded-xl border p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase">
          {label}
        </p>
        <Icon className="text-muted-foreground size-4" />
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="text-muted-foreground mt-1 text-xs">{hint}</p>
    </article>
  );
}
