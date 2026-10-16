import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/hero-bg.jpg)" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/70" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 py-20">
        <p className="mb-2 text-xs font-semibold tracking-[0.35em] text-[#c41e3a] uppercase">
          Louzada Motos
        </p>
        <h1 className="max-w-2xl text-4xl font-black tracking-tight text-white uppercase md:text-6xl">
          Pronta entrega, do jeito que você precisa
        </h1>
        <p className="mt-4 max-w-xl text-base text-zinc-300 md:text-lg">
          Motos e autos revisados, documentação em dia e atendimento rápido pelo WhatsApp.
        </p>
        <Link
          href="/#estoque"
          className="mt-8 inline-flex rounded-full bg-[#c41e3a] px-8 py-3 text-sm font-bold tracking-wide text-white uppercase transition hover:bg-[#a01830]"
        >
          Ver estoque
        </Link>
      </div>
    </section>
  );
}
