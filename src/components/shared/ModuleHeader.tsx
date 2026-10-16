export function ModuleHeader({
  title,
  count,
  action,
}: {
  title: string;
  count: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground text-sm">{count}</p>
      </div>
      {action}
    </div>
  );
}
