const reviews = [
  {
    nome: "Felipe R.",
    nota: 5,
    tempo: "há 2 semanas",
    texto: "Comprei minha CB 500 com a Louzada. Atendimento transparente, moto igual às fotos do site e negociação justa.",
    tag: "Compra de moto",
  },
  {
    nome: "Juliana M.",
    nota: 5,
    tempo: "há 1 mês",
    texto: "Fechamos um HB20 pelo WhatsApp, visitamos a loja e saímos de carro no mesmo dia. Recomendo demais.",
    tag: "Compra de auto",
  },
  {
    nome: "Renato C.",
    nota: 5,
    tempo: "há 3 semanas",
    texto: "Fizeram avaliação da minha moto na troca e explicaram cada detalhe do financiamento. Muito profissionais.",
    tag: "Troca + financiamento",
  },
];

function Estrelas({ nota }: { nota: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < nota ? "text-[#FBBC04]" : "text-[#333]"}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function StoreDepoimentos() {
  return (
    <section className="bg-[#0a0a0a] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:mb-14 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold tracking-widest text-[#c41e3a] uppercase">
              O que dizem nossos clientes
            </p>
            <h2
              className="font-display leading-none font-black text-white uppercase italic"
              style={{ fontSize: "clamp(34px, 8vw, 68px)" }}
            >
              Avaliações <span className="text-[#c41e3a]">reais</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <div
              key={r.nome}
              className="flex flex-col rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6 transition-all hover:border-[#c41e3a]/30"
            >
              <div className="mb-4">
                <p className="text-sm leading-tight font-semibold text-white">{r.nome}</p>
                <p className="mt-0.5 text-xs text-[#555]">{r.tempo}</p>
              </div>
              <Estrelas nota={r.nota} />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[#999]">&ldquo;{r.texto}&rdquo;</p>
              <div className="mt-4 border-t border-[#1f1f1f] pt-4">
                <span className="text-[10px] font-semibold tracking-wider text-[#c41e3a] uppercase">
                  {r.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
