import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function DashboardHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/"
        aria-label="Abrir a vitrine"
        className="text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-full transition"
      >
        <ChevronLeft className="size-5" />
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
    </div>
  );
}
