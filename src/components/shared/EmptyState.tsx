export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-card flex flex-col items-start gap-3 rounded-xl border border-dashed px-6 py-10">
      <p className="text-muted-foreground text-[10px] font-medium tracking-[0.22em] uppercase">
        Sem registros
      </p>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground max-w-lg text-sm">{description}</p>
      {action}
    </div>
  );
}
