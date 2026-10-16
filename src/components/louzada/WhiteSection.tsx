import type { ReactNode } from "react";

type WhiteSectionProps = {
  title: string;
  id?: string;
  children: ReactNode;
  action?: ReactNode;
};

export function WhiteSection({ title, id, children, action }: WhiteSectionProps) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-xl bg-white p-6 shadow-xl md:p-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase">{title}</h2>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}
