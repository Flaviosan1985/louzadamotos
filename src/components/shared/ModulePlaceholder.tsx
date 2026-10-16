import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ModulePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="bg-card mx-auto max-w-2xl rounded-xl border p-8">
      <p className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
        Módulo
      </p>
      <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      <Button className="mt-6" render={<Link href="/" />}>
        Voltar ao dashboard
      </Button>
    </section>
  );
}
